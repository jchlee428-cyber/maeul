import * as mammoth from "mammoth";
import JSZip from "jszip";
import * as CFB from "cfb";
import { inflate, inflateRaw } from "pako";

export interface ParsedDocumentResult {
  text: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  charCount: number;
}

/**
 * Extracts plain text from an XML string (e.g. from HWPX or DOCX)
 */
function extractTextFromXml(xmlString: string): string {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "text/xml");
    
    // For HWPX (<hp:p>, <hp:t>)
    const hpParagraphs = xmlDoc.getElementsByTagName("hp:p");
    if (hpParagraphs.length > 0) {
      const paragraphs: string[] = [];
      for (let i = 0; i < hpParagraphs.length; i++) {
        const texts: string[] = [];
        const textNodes = hpParagraphs[i].getElementsByTagName("hp:t");
        for (let j = 0; j < textNodes.length; j++) {
          const content = textNodes[j].textContent || "";
          if (content.trim()) texts.push(content);
        }
        if (texts.length > 0) {
          paragraphs.push(texts.join(" "));
        }
      }
      if (paragraphs.length > 0) {
        return paragraphs.join("\n");
      }
    }

    // Fallback: strip XML tags and clean up whitespace
    return xmlString
      .replace(/<[^>]+>/g, " ")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/[ \t]+/g, " ")
      .replace(/\n\s*\n/g, "\n")
      .trim();
  } catch {
    return xmlString.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }
}

/**
 * Parse DOCX file
 */
async function parseDocx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  try {
    const result = await mammoth.extractRawText({ arrayBuffer });
    if (result.value && result.value.trim()) {
      return result.value.trim();
    }
  } catch (err) {
    console.warn("Mammoth parsing failed, trying JSZip fallback:", err);
  }

  // Fallback via JSZip
  const zip = await JSZip.loadAsync(arrayBuffer);
  const docXml = zip.file("word/document.xml");
  if (docXml) {
    const xmlText = await docXml.async("text");
    return extractTextFromXml(xmlText);
  }
  throw new Error("DOCX 파일에서 본문 텍스트를 추출할 수 없습니다.");
}

/**
 * Parse HWPX (Hancom Office Open XML - Zip container)
 */
async function parseHwpx(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const zip = await JSZip.loadAsync(arrayBuffer);
  
  const sectionFiles = Object.keys(zip.files).filter((name) =>
    name.match(/Contents\/section\d+\.xml/i)
  );

  if (sectionFiles.length === 0) {
    // Try any xml files in Contents or root
    const anyXml = Object.keys(zip.files).filter((name) => name.endsWith(".xml"));
    if (anyXml.length > 0) {
      let combined = "";
      for (const name of anyXml) {
        const fileObj = zip.file(name);
        if (fileObj) {
          const content = await fileObj.async("text");
          const extracted = extractTextFromXml(content);
          if (extracted) combined += extracted + "\n\n";
        }
      }
      if (combined.trim()) return combined.trim();
    }
    throw new Error("HWPX 본문 섹션(section.xml)을 찾을 수 없습니다.");
  }

  // Sort section files numerically (section0, section1, ...)
  sectionFiles.sort((a, b) => {
    const numA = parseInt(a.replace(/[^0-9]/g, "") || "0", 10);
    const numB = parseInt(b.replace(/[^0-9]/g, "") || "0", 10);
    return numA - numB;
  });

  let fullText = "";
  for (const secPath of sectionFiles) {
    const secFile = zip.file(secPath);
    if (secFile) {
      const xmlContent = await secFile.async("text");
      const text = extractTextFromXml(xmlContent);
      if (text) {
        fullText += text + "\n\n";
      }
    }
  }

  return fullText.trim() || "HWPX 파일에서 텍스트를 찾을 수 없습니다.";
}

/**
 * Parse HWP (Hangul 5.0 OLE/CFB Binary format)
 */
async function parseHwp(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();

  try {
    // Check if it's a valid CFB / OLE file
    const cfb = CFB.read(new Uint8Array(arrayBuffer), { type: "array" });
    
    // Find Section streams under BodyText
    const sectionPaths = cfb.FileIndex
      .map((entry) => entry.name)
      .filter((name) => name && name.includes("Section"));

    if (sectionPaths.length > 0) {
      const extractedParagraphs: string[] = [];

      for (const secName of sectionPaths) {
        const entry = CFB.find(cfb, secName);
        if (entry && entry.content) {
          let decompressed: Uint8Array;
          try {
            // HWP section streams are raw deflate compressed
            decompressed = inflateRaw(entry.content as Uint8Array);
          } catch {
            try {
              decompressed = inflate(entry.content as Uint8Array);
            } catch {
              decompressed = entry.content as Uint8Array;
            }
          }

          // Parse decompressed HWP 5.0 records or extract text
          const secText = extractTextFromHwpDecompressed(decompressed);
          if (secText.trim()) {
            extractedParagraphs.push(secText.trim());
          }
        }
      }

      if (extractedParagraphs.length > 0) {
        return extractedParagraphs.join("\n\n");
      }
    }
  } catch (err) {
    console.warn("CFB HWP parsing attempt failed, falling back to binary string extraction:", err);
  }

  // Fallback: search for UTF-16LE / UTF-8 strings in binary
  const binaryText = extractStringsFromBinary(new Uint8Array(arrayBuffer));
  if (binaryText.trim().length > 20) {
    return binaryText.trim();
  }

  throw new Error("HWP 파일 내용 추출에 실패했습니다. HWPX 또는 PDF로 변환 후 업로드하시면 더욱 정확합니다.");
}

/**
 * Parse HWP decompressed stream records (HWPTAG_PARA_TEXT = 67 / 0x43)
 */
function extractTextFromHwpDecompressed(data: Uint8Array): string {
  let offset = 0;
  const result: string[] = [];
  const decoder = new TextDecoder("utf-16le");

  while (offset + 4 <= data.length) {
    const header = data[offset] | (data[offset + 1] << 8) | (data[offset + 2] << 16) | (data[offset + 3] << 24);
    const tagId = header & 0x3ff;
    let length = (header >> 20) & 0xfff;
    offset += 4;

    if (length === 0xfff) {
      if (offset + 4 <= data.length) {
        length = data[offset] | (data[offset + 1] << 8) | (data[offset + 2] << 16) | (data[offset + 3] << 24);
        offset += 4;
      }
    }

    if (offset + length > data.length) break;

    // HWPTAG_PARA_TEXT = 67 (0x43)
    if (tagId === 67) {
      const recordBytes = data.subarray(offset, offset + length);
      try {
        const rawString = decoder.decode(recordBytes);
        // Replace HWP control characters (0x00 to 0x1F) except newline/tab
        const cleaned = rawString
          .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, " ")
          .replace(/\r\n/g, "\n")
          .replace(/[ \t]+/g, " ")
          .trim();
        if (cleaned) {
          result.push(cleaned);
        }
      } catch {
        // Ignore decoding error for single record
      }
    }

    offset += length;
  }

  if (result.length > 0) {
    return result.join("\n");
  }

  // If no record tag 67 matched, attempt direct UTF-16LE scan
  return extractStringsFromBinary(data);
}

/**
 * Fallback binary string scanner (UTF-16LE and UTF-8 printable strings)
 */
function extractStringsFromBinary(data: Uint8Array): string {
  const result: string[] = [];
  const decoder = new TextDecoder("utf-16le");

  // Try decoding as UTF-16LE chunks
  for (let i = 0; i < data.length - 20; i += 2) {
    // Check if byte pairs resemble Hangul (0xAC00 - 0xD7A3) or Latin ASCII
    const code = data[i] | (data[i + 1] << 8);
    if ((code >= 0xac00 && code <= 0xd7a3) || (code >= 0x30 && code <= 0x39) || (code >= 0x41 && code <= 0x5a) || (code >= 0x61 && code <= 0x7a) || code === 0x20 || code === 0x0a) {
      let end = i;
      while (end + 1 < data.length) {
        const c = data[end] | (data[end + 1] << 8);
        if ((c >= 0xac00 && c <= 0xd7a3) || (c >= 0x1100 && c <= 0x11ff) || (c >= 0x3130 && c <= 0x318f) || (c >= 0x20 && c <= 0x7e) || c === 0x0a || c === 0x0d) {
          end += 2;
        } else {
          break;
        }
      }
      if (end - i >= 16) {
        try {
          const str = decoder.decode(data.subarray(i, end)).trim();
          if (str.length > 5 && /[가-힣]/.test(str)) {
            result.push(str);
          }
        } catch {
          // ignore
        }
        i = end;
      }
    }
  }

  return result.join("\n");
}

/**
 * Parse PDF file using pdfjs-dist
 */
async function parsePdf(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  
  // Dynamically import pdfjs-dist to avoid heavy initial bundle
  const pdfjsLib = await import("pdfjs-dist");

  // Configure worker
  try {
    if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
      pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || "4.10.38"}/pdf.worker.min.mjs`;
    }
  } catch {
    // worker config fallback
  }

  const loadingTask = pdfjsLib.getDocument({
    data: new Uint8Array(arrayBuffer),
    useSystemFonts: true,
  });

  const pdf = await loadingTask.promise;
  const numPages = pdf.numPages;
  const pageTexts: string[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => item.str || "")
      .filter((s: string) => s.trim().length > 0);

    if (pageStrings.length > 0) {
      pageTexts.push(`[페이지 ${pageNum}]\n` + pageStrings.join(" "));
    }
  }

  const result = pageTexts.join("\n\n").trim();
  if (!result) {
    throw new Error("PDF에서 텍스트를 추출할 수 없습니다. (스캔된 이미지 전용 PDF인 경우 텍스트 복사가 어려울 수 있습니다)");
  }
  return result;
}

/**
 * Parse plain text files (txt, csv, json, md, hws script, etc.)
 */
async function parsePlainText(file: File): Promise<string> {
  // Try UTF-8 first
  const text = await file.text();
  
  // Check if text contains replacement characters or corrupted encoding (e.g. EUC-KR)
  if (text.includes("") || text.includes("")) {
    const arrayBuffer = await file.arrayBuffer();
    try {
      const eucKrDecoder = new TextDecoder("euc-kr");
      const eucKrText = eucKrDecoder.decode(arrayBuffer);
      if (!eucKrText.includes("")) {
        return eucKrText;
      }
    } catch {
      // Return original if EUC-KR decoder fails
    }
  }

  return text;
}

/**
 * Main parser entry point supporting PDF, HWP, HWPX, HWS, DOCX, TXT
 */
export async function parseDocumentFile(file: File): Promise<ParsedDocumentResult> {
  const fileName = file.name;
  const ext = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();
  let extractedText = "";
  let detectedType = "일반 텍스트";

  switch (ext) {
    case ".pdf":
      detectedType = "PDF 문서";
      extractedText = await parsePdf(file);
      break;

    case ".docx":
    case ".doc":
      detectedType = "MS Word 문서 (.docx)";
      extractedText = await parseDocx(file);
      break;

    case ".hwpx":
      detectedType = "한글 표준 문서 (.hwpx)";
      extractedText = await parseHwpx(file);
      break;

    case ".hwp":
      detectedType = "한글 문서 (.hwp)";
      try {
        extractedText = await parseHwpx(file); // Some .hwp are actually zipped HWPX
      } catch {
        extractedText = await parseHwp(file);
      }
      break;

    case ".hws":
      detectedType = "한글 서식/스크립트 (.hws)";
      try {
        extractedText = await parseHwpx(file);
      } catch {
        try {
          extractedText = await parseHwp(file);
        } catch {
          extractedText = await parsePlainText(file);
        }
      }
      break;

    case ".txt":
    case ".csv":
    case ".tsv":
    case ".md":
    case ".log":
    default:
      detectedType = `텍스트 파일 (${ext || "txt"})`;
      extractedText = await parsePlainText(file);
      break;
  }

  // Clean up excessive whitespace & lines
  extractedText = extractedText
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!extractedText) {
    throw new Error(`'${fileName}' 파일에서 추출된 텍스트가 비어 있습니다.`);
  }

  return {
    text: extractedText,
    fileName: file.name,
    fileType: detectedType,
    fileSize: file.size,
    charCount: extractedText.length,
  };
}
