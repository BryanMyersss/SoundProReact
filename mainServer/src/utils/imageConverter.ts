import sharp from 'sharp';

// Takes a buffer and converts it to a webp buffer
export const FileToWebp = async (buffer: Buffer): Promise<Buffer> => {
  return await sharp(buffer).webp().toBuffer();
}