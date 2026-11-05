import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Security invariants for file uploads
const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]);
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // 1. File Size Verification
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds maximum allowed limit of 5MB' },
        { status: 413 }
      );
    }

    // 2. MIME Type Verification
    if (!ALLOWED_MIME_TYPES.has(file.type.toLowerCase())) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PNG, JPG, JPEG, WEBP, and GIF images are permitted.' },
        { status: 415 }
      );
    }

    // 3. Extension Validation
    const ext = (path.extname(file.name) || '.png').toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: 'Invalid file extension.' },
        { status: 415 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Magic Bytes Inspection (Anti-spoofing)
    // PNG: 89 50 4E 47 | JPEG: FF D8 FF | GIF: 47 49 46 | WEBP: 52 49 46 46 (RIFF)
    const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47;
    const isJpg = buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
    const isGif = buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46;
    const isWebp =
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50;

    if (!isPng && !isJpg && !isGif && !isWebp) {
      return NextResponse.json(
        { error: 'File content does not match genuine image signatures.' },
        { status: 400 }
      );
    }

    // 5. Unique, unguessable filename (prevent path traversal / overwrites)
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const uniqueFilename = `diecast_${Date.now()}_${randomSuffix}${ext}`;

    // 6. Resilient Storage Strategy (Local disk + Vercel / Serverless fallback)
    try {
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const filePath = path.join(uploadsDir, uniqueFilename);
      fs.writeFileSync(filePath, buffer);

      return NextResponse.json({
        success: true,
        url: `/uploads/${uniqueFilename}`,
        filename: uniqueFilename,
      });
    } catch (fsError: any) {
      // If filesystem is read-only (such as Vercel serverless environment),
      // encode as safe Base64 Data URL so uploads never fail!
      console.warn('Filesystem write not available, using base64 data URI fallback:', fsError?.message);
      const mime = file.type || 'image/png';
      const base64Data = buffer.toString('base64');
      const dataUri = `data:${mime};base64,${base64Data}`;

      return NextResponse.json({
        success: true,
        url: dataUri,
        filename: uniqueFilename,
      });
    }
  } catch (error: any) {
    console.error('Error handling upload:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process image' },
      { status: 500 }
    );
  }
}
