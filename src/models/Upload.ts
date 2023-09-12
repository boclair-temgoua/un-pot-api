import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common/index';
import { UploadType } from '../modules/uploads/uploads.dto';
import { FilterQueryType } from '../app/utils/search-query/search-query.dto';

@Entity('upload')
export class Upload extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  path?: string;

  @Column({ nullable: true })
  status?: string;

  @Column({ nullable: true })
  url?: string;

  @Column({ default: 'IMAGE' })
  uploadType?: UploadType;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'uuid', nullable: true })
  postId?: string;

  @Column({ type: 'uuid', nullable: true })
  productId?: string;

  @Column({ type: 'uuid', nullable: true })
  commissionId?: string;

  @Column({ type: 'uuid', nullable: true })
  membershipId?: string;

  @Column({ default: 'PRODUCTS' })
  type?: FilterQueryType;

  @Column({ type: 'uuid', nullable: true })
  uploadableId?: string;
}
