import mime from 'mime-types';
import {
  S3Client,
  PutObjectCommandInput,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { S3 } from 'aws-sdk';
import { config } from '../../../app/config';

const awsClient = new S3({
  region: config.implementations.aws.region,
  accessKeyId: config.implementations.aws.accessKey,
  secretAccessKey: config.implementations.aws.secretKey,
});

export const awsS3ServiceAdapter = async (data: {
  file: PutObjectCommandInput['Body'];
  name: string;
  mimeType: string;
  folder: string;
}): Promise<any> => {
  const { file, name, mimeType, folder } = data;

  const params = {
    Bucket: `${config.implementations.aws.bucket}/${folder}`,
    Key: name,
    Body: file,
    ACL: 'public-read',
    ContentType: mimeType,
    ContentDisposition: 'inline',
    CreateBucketConfiguration: {
      LocationConstraint: config.implementations.aws.region,
    },
  };

  const responseAws = file ? await awsClient.upload(params).promise() : '';
  const response = { ...responseAws };
  return response;
};

export const getFile = async (key: string, folder: string) => {
  const awsClient = new S3Client({
    credentials: {
      accessKeyId: config.implementations.aws.accessKey,
      secretAccessKey: config.implementations.aws.secretKey,
    },
    region: config.implementations.aws.region,
  });

  const command = new GetObjectCommand({
    Bucket: config.implementations.aws.bucket,
    Key: key,
  });
  const response = await awsClient.send(command);
  return response.Body;
};
