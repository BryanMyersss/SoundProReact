import { Express, Request, Response } from 'express';
const router = require('express').Router();
import config from 'config';


// S3
import { S3Client, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import catchAsync from '../utils/catchAsync';


const s3 = new S3Client({
  credentials: {
    accessKeyId: config.get<string>('awsAccessKey'),
    secretAccessKey: config.get<string>('awsSecretKey')
  },
  region: config.get<string>('awsRegion')
})


function imageRoutes(app: Express) {

  app.use('/image', router);

  router.route('/:key')
    .get(catchAsync(async (req: Request, res: Response) => {
      console.log(req.params)
      const key = req.params.key

      const getObjectParams = {
        Bucket: config.get<string>('awsBucketName'),
        Key: `public/product-images/${key}`
      }
      const command = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 }); // expires in 1 hour

      res.send(url)
    }))
    .delete(catchAsync(async (req: Request, res: Response) => {
      const key = req.params.key

      const deleteObjectParams = {
        Bucket: config.get<string>('awsBucketName'),
        Key: `public/product-images/${key}`
      }
      const command = new DeleteObjectCommand(deleteObjectParams);
      await s3.send(command);

      res.sendStatus(200);
    }))
};

export default imageRoutes;