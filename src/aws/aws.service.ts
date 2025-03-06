import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
  private readonly AWS_S3_BUCKET = 'ewsj12';
  private readonly s3Client: S3Client;

  constructor() {
    this.s3Client = new S3Client({
      region: 'ap-south-1', // Specify your region explicitly
      credentials: {
        accessKeyId: process.env.ACCESS_KEY || '',
        secretAccessKey: process.env.SECRET_ACCESS_KEY || '',
      },
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<{ Location: string }> {
    
    const { buffer, mimetype } = file;
    const extension = file.originalname.split('.').pop() || file.mimetype.split('/')[1];

    const filename = `ewsj-image-${new Date().toISOString().replace(/[:.]/g, '-')}.${extension}`;

   
    

    return await this.s3Upload(buffer, this.AWS_S3_BUCKET, filename, mimetype);
  }

  private async s3Upload(
    fileBuffer: Buffer,
    bucket: string,
    key: string,
    mimetype: string,
  ): Promise<{ Location: string }> {
    const params = {
      Bucket: bucket,
      Key: key,
      Body: fileBuffer,
      ContentType: mimetype,
      ACL: 'public-read' as const, // TypeScript const assertion for ACL
      ContentDisposition: 'inline' as const,
    };

    try {
      const command = new PutObjectCommand(params);
     
      
      await this.s3Client.send(command);

      // Construct the file URL manually since v3 doesn't return it directly
      const fileUrl = `https://${bucket}.s3.ap-south-1.amazonaws.com/${key}`;
      return { Location: fileUrl };
    } catch (error) {
      console.error('Error uploading to S3:', error);
      throw error; // Re-throw for controller to handle
    }
  }
}