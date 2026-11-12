import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || 'wortelemes-media';
const publicUrl = process.env.R2_PUBLIC_URL || 'https://media.wortelemes.com';

// Singleton S3 client configured for Cloudflare R2
export const r2Client =
  accountId && accessKeyId && secretAccessKey
    ? new S3Client({
        region: 'auto',
        endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      })
    : null;

export async function uploadToR2(
  fileBuffer: Buffer,
  filename: string,
  contentType: string
): Promise<{ success: boolean; url: string; key: string }> {
  if (!r2Client) {
    throw new Error('R2 client credentials not configured in environment');
  }

  const key = `uploads/${filename}`;

  await r2Client.send(
    new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: contentType,
      // Public read cache-control for fast CDN delivery
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );

  const finalUrl = `${publicUrl.replace(/\/+$/, '')}/${key}`;

  return {
    success: true,
    url: finalUrl,
    key,
  };
}
