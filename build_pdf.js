import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.resolve(__dirname, "MAULJIGI_PROJECT_REPORT.html");
const pdfPath = path.resolve(__dirname, "MAULJIGI_PROJECT_REPORT.pdf");
const koreanPdfPath = path.resolve(__dirname, "마을지기_종합개발보고서_및_공공데이터_API_연동가이드.pdf");

const edgePath = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";

console.log("Starting PDF conversion...");
console.log("HTML Path:", htmlPath);
console.log("Target PDF Path:", pdfPath);

const args = [
  "--headless",
  "--disable-gpu",
  "--no-pdf-header-footer",
  `--print-to-pdf=${pdfPath}`,
  `file://${htmlPath}`
];

const child = spawn(edgePath, args);

child.on("close", (code) => {
  console.log(`Edge process finished with exit code: ${code}`);
  if (fs.existsSync(pdfPath)) {
    console.log("PDF created successfully! Size:", fs.statSync(pdfPath).size, "bytes");
    fs.copyFileSync(pdfPath, koreanPdfPath);
    console.log("Copied to Korean named file:", koreanPdfPath);
  } else {
    console.error("PDF was not created.");
  }
});
