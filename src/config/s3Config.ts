export const s3Config = {
  access_key_id: process.env.AWS_S3_ACCESS_KEY_ID,
  secret_access_key: process.env.AWS_S3_SECRET_ACCESS_KEY,
  buket_region: process.env.AWS_S3_BUCKET_REGION,
  bucket: process.env.AWS_S3_BUCKET,
}