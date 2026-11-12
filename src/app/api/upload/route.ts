import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { r2Client, uploadToR2 } from '@/lib/r2';

// Strict security invariants for image uploads
const ALLOWED_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.gif']);
const ALLOWED_MIME_TYPES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

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
        { error: 'File size exceeds maximum allowed limit of 10MB' },
        { status: 413 }
      );
    }

    // 2. MIME Type Verification
    const mimeType = file.type.toLowerCase();
    if (!ALLOWED_MIME_TYPES.has(mimeType)) {
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

    // 5. Unique, unguessable filename
    const randomSuffix = Math.random().toString(36).substring(2, 10);
    const uniqueFilename = `diecast_${Date.now()}_${randomSuffix}${ext}`;

    // 6. Primary Destination: Cloudflare R2 Object Storage
    if (r2Client) {
      try {
        const r2Result = await uploadToR2(buffer, uniqueFilename, mimeType);
        return NextResponse.json({
          success: true,
          url: r2Result.url,
          filename: uniqueFilename,
          storage: 'cloudflare-r2',
        });
      } catch (r2Error: any) {
        console.error('Cloudflare R2 upload error, falling back:', r2Error?.message);
      }
    }

    // 7. Secondary / Local Fallback (Development or offline mode)
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
        storage: 'local-filesystem',
      });
    } catch (fsError: any) {
      console.warn('Filesystem write unavailable, using base64 data URI fallback:', fsError?.message);
      const base64Data = buffer.toString('base64');
      const dataUri = `data:${mimeType};base64,${base64Data}`;

      return NextResponse.json({
        success: true,
        url: dataUri,
        filename: uniqueFilename,
        storage: 'inline-data-uri',
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
