import { generateLongUUID } from '../../app/utils/commons/generate-random';
import { formateNowDateYYMMDD } from '../../app/utils/commons/formate-date';
import { Injectable } from '@nestjs/common';
import { GetCommissionsSelections } from '../commissions/commissions.type';
import { awsS3ServiceAdapter } from '../integrations/aws/aws-s3-service-adapter';
import * as mime from 'mime-types';
import { UploadsService } from './uploads.service';
import { FilterQueryType } from '../../app/utils/search-query';

@Injectable()
export class UploadsUtil {
  constructor(private readonly uploadsService: UploadsService) {} // private driver: Repository<Commission>, // @InjectRepository(Commission)

  async saveOrUpdateAws(options: {
    userId?: string;
    model: FilterQueryType;
    uploadableId: string;
    organizationId: string;
    folder: 'products' | 'commissions' | 'posts' | 'memberships';
    files: Array<Express.Multer.File>;
  }): Promise<any> {
    const { files, userId, organizationId, model, uploadableId, folder } =
      options;

    for (const file of files) {
      const extension = mime.extension(file.mimetype);
      const nameFile = `${userId}-${formateNowDateYYMMDD(
        new Date(),
      )}${generateLongUUID(8)}`;
      const fileName = `${`${nameFile}.${
        extension === 'mpga' ? 'mp3' : extension
      }`}`;

      const urlAWS = await awsS3ServiceAdapter({
        fileName: fileName,
        mimeType: file?.mimetype,
        folder: folder,
        file: file.buffer,
      });

      if (file?.fieldname === 'attachmentImages') {
        await this.uploadsService.createOne({
          name: file?.originalname,
          path: fileName,
          status: 'success',
          url: urlAWS.Location,
          uploadType: 'IMAGE',
          model: model,
          userId: userId,
          organizationId: organizationId,
          uploadableId: uploadableId,
        });
      }

      if (file?.fieldname === 'attachmentFiles') {
        await this.uploadsService.createOne({
          name: file?.originalname,
          path: fileName,
          status: 'success',
          url: urlAWS.Location,
          uploadType: 'FILE',
          model: model,
          userId: userId,
          organizationId: organizationId,
          uploadableId: uploadableId,
        });
      }
    }

    return 'ok';
  }
}
