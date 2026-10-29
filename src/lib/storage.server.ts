import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

/**
 * Neon Object Storage (compatible S3), bucket privé « assets » déclaré dans neon.ts.
 * Identifiants, endpoint et région viennent des variables AWS_* injectées par Neon
 * (`neon deploy` / `neon env pull`) ; le SDK AWS les lit automatiquement.
 */
export const STORAGE_BUCKET = "assets";

export function isStorageConfigured() {
  return Boolean(
    process.env.AWS_ACCESS_KEY_ID &&
    process.env.AWS_SECRET_ACCESS_KEY &&
    process.env.AWS_ENDPOINT_URL_S3,
  );
}

let client: S3Client | undefined;

function s3() {
  // forcePathStyle obligatoire : Neon n'accepte que l'adressage par chemin.
  client ??= new S3Client({ forcePathStyle: true });
  return client;
}

export async function putObject(key: string, body: Uint8Array, contentType: string) {
  await s3().send(
    new PutObjectCommand({
      Bucket: STORAGE_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}

export async function deleteObject(key: string) {
  await s3().send(new DeleteObjectCommand({ Bucket: STORAGE_BUCKET, Key: key }));
}

/** Lien de lecture temporaire (bucket privé) : aucune clé exposée au navigateur. */
export function signedReadUrl(key: string, fileName: string, expiresIn = 15 * 60) {
  return getSignedUrl(
    s3(),
    new GetObjectCommand({
      Bucket: STORAGE_BUCKET,
      Key: key,
      ResponseContentDisposition: `inline; filename="${encodeURIComponent(fileName)}"`,
    }),
    { expiresIn },
  );
}
