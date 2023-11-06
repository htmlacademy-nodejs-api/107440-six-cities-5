import { NextFunction, Request, Response } from 'express';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import * as crypto from 'node:crypto';
import { Middleware } from './middleware.interface.js';

export class UploadMutlipleFilesMiddleware implements Middleware {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
    private limit: number
  ) {}

  public async execute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        const fileExtention = extension(file.mimetype);
        const filename = crypto.randomUUID();
        callback(null, `${filename}.${fileExtention}`);
      }
    });

    const uploadMultipleFilesMiddleware = multer({ storage }).array(
      this.fieldName,
      this.limit
    );

    uploadMultipleFilesMiddleware(req, res, (error): void => {
      if (error) {
        // Handle the error here and send an appropriate response
        console.error('File upload error:', error);
        res.status(500).json({ error: 'File upload error' });
      }

      // No error occurred, continue to the next middleware
      next();
    });
  }
}
