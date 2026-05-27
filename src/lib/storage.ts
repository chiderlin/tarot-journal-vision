/**
 * ⚠️  S3Client with credentials must NOT be used client-side.
 *     VITE_ env vars are bundled into the JS and visible to all users.
 *     For upload/delete operations, call a Supabase Edge Function instead.
 *
 * Client-side code only needs getPublicUrl() / cardAssetUrl() below —
 * no credentials required for reading files in a public bucket.
 */

/**
 * Build a public URL for a file in a Supabase Storage public bucket.
 *
 * @param bucket  Bucket name, e.g. 'card-assets'
 * @param path    File path inside the bucket, e.g. 'tarot/major_arcana/fool.png'
 */
export function getPublicUrl(bucket: string, path: string): string {
  const base = import.meta.env.VITE_SUPABASE_URL as string;
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

/** Default card-assets bucket name */
export const CARD_BUCKET =
  (import.meta.env.VITE_S3_BUCKET as string) ?? 'card-assets';

/** Shorthand: get public URL for a card-assets file */
export function cardAssetUrl(path: string): string {
  return getPublicUrl(CARD_BUCKET, path);
}
