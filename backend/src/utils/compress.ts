import sharp from "sharp";
import { PDFDocument } from "pdf-lib";

/**
 * Compress documents to PDF < 300KB
 * Photos to JPG < 50KB
 */
export async function bufferToPdfCompressed(imageBuffer: Buffer): Promise<Buffer> {
  // Convert to PDF and try to keep under 300KB
  const pdf = await PDFDocument.create();
  // Compress image first
  let imgBuf = await sharp(imageBuffer).jpeg({ quality: 60 }).toBuffer();
  // If still large, reduce quality iteratively
  let quality = 60;
  while (imgBuf.length > 220 * 1024 && quality > 20) {
    quality -= 10;
    imgBuf = await sharp(imageBuffer).jpeg({ quality }).resize({ width: 1200, withoutEnlargement: true }).toBuffer();
  }
  const jpgImage = await pdf.embedJpg(imgBuf);
  const page = pdf.addPage([jpgImage.width, jpgImage.height]);
  page.drawImage(jpgImage, { x: 0, y: 0, width: jpgImage.width, height: jpgImage.height });
  const pdfBytes = await pdf.save();
  let out = Buffer.from(pdfBytes);
  // If still >300KB aggressively recompress - fallback to lower quality pdf
  if (out.length > 300 * 1024) {
    // re-embed at lower quality
    const pdf2 = await PDFDocument.create();
    const lowBuf = await sharp(imageBuffer).jpeg({ quality: 30 }).resize({ width: 800 }).toBuffer();
    const img2 = await pdf2.embedJpg(lowBuf);
    const p2 = pdf2.addPage([img2.width, img2.height]);
    p2.drawImage(img2, { x: 0, y: 0, width: img2.width, height: img2.height });
    out = Buffer.from(await pdf2.save());
  }
  return out;
}

export async function photoToJpgCompressed(input: Buffer): Promise<Buffer> {
  // Target <50KB
  let quality = 60;
  let buf = await sharp(input).jpeg({ quality }).resize({ width: 600, withoutEnlargement: true }).toBuffer();
  while (buf.length > 50 * 1024 && quality > 15) {
    quality -= 8;
    buf = await sharp(input).jpeg({ quality }).resize({ width: 500 }).toBuffer();
  }
  return buf;
}
