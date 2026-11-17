import fs from 'fs';
import path from 'path';

const PDF_DIR = path.join(process.cwd(), 'netlify', 'pdfs');

export function getPDFPath(filename) {
  const safeName = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '');
  return path.join(PDF_DIR, safeName);
}

export function getPDFStream(filename) {
  const filePath = getPDFPath(filename);
  if (!fs.existsSync(filePath)) return null;
  return fs.createReadStream(filePath);
}

export function getPDFBuffer(filename) {
  const filePath = getPDFPath(filename);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath);
}

export function pdfExists(filename) {
  return fs.existsSync(getPDFPath(filename));
}

export function getAllPDFFiles() {
  if (!fs.existsSync(PDF_DIR)) return [];
  return fs.readdirSync(PDF_DIR).filter(f => f.endsWith('.pdf'));
}