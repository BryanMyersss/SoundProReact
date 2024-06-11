import crypto from 'crypto';

// S3
import { S3Client, PutObjectCommand, PutObjectCommandOutput } from "@aws-sdk/client-s3";
import config from 'config';

// Generate a random image name
const randomImageName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex');

const s3 = new S3Client({
  credentials: {
    accessKeyId: config.get<string>('awsAccessKey'),
    secretAccessKey: config.get<string>('awsSecretKey')
  },
  region: config.get<string>('awsRegion')
})

interface uploadImageProps {
  /**
   * Input webp buffer.
   */
  buffer: Buffer,
  /**
   * Upload path relative to the bucket. Example: 'public/product-images/' => 's3://bucket-name/public/product-images/file-name'
   */
  uploadPath: string,
  /**
   * Content type of the image. Example: 'image/webp', 'image/png', 'image/jpeg'
   */
  ContentType: string
}

/**
 * This function uploads an image to an S3 bucket.
 * 
 * Returns { response, url } or throws an error.
 * @returns {Promise<{ response: PutObjectCommandOutput; url: string; }>}
 */

export const uploadImage = async ({ buffer, uploadPath, ContentType }: uploadImageProps): Promise<{ response: PutObjectCommandOutput; url: string; }> => {
  // Validate the upload path
  const uploadPathPattern = /^[a-zA-Z][-a-zA-Z/]*\/$/;
  if (!uploadPathPattern.test(uploadPath)) throw new Error('Invalid uploadPath. It should start with a letter, end with a slash (/)');

  // Validate the content type
  const contentTypePattern = /^image\/(webp|png|jpeg)$/;
  if (!contentTypePattern.test(ContentType)) throw new Error('Invalid content type. It should be either image/webp, image/png or image/jpeg');

  const fileExtension = ContentType.split('/')[1];

  const params = {
    Bucket: config.get<string>('awsBucketName'),
    Key: `${uploadPath}${randomImageName()}.${fileExtension}`,
    Body: buffer,
    ContentType,
  }

  const command = new PutObjectCommand(params);

  const url = `https://${config.get<string>('awsBucketName')}.s3.${config.get<string>('awsRegion')}.amazonaws.com/${params.Key}`

  try {
    const response = await s3.send(command) 
    return {response, url}
  } catch (error: any) {
    throw new Error(error.message)
  }
}
