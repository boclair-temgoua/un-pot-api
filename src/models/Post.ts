import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Relation,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common';
import { ProductStatus } from '../app/utils/pagination';
import { WhoCanSeeType, whoCanSeeTypeArrays } from '../app/utils/search-query';
import { PostType, postTypeArrays } from '../modules/posts/posts.type';
import { User } from './User';
import { Album, Category, Comment, Organization } from './index';

@Entity('post')
export class Post extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  slug?: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ type: 'boolean', default: false })
  enableUrlMedia: boolean;

  @Column({ nullable: true })
  urlMedia?: string;

  @Column({ type: 'enum', enum: whoCanSeeTypeArrays, default: 'PUBLIC' })
  whoCanSee?: WhoCanSeeType;

  @Column({ type: 'enum', enum: postTypeArrays, default: 'ARTICLE' })
  type?: PostType;

  @Column({ default: 'ACTIVE' })
  status?: ProductStatus;

  @Column({ default: false })
  allowDownload?: boolean;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string;
  @ManyToOne(() => Category, (category) => category.posts)
  @JoinColumn()
  category: Relation<Category>;

  @Column({ type: 'uuid', nullable: true })
  albumId?: string;
  @ManyToOne(() => Album, (album) => album.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  album?: Relation<Album>;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Relation<Organization>;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments?: Comment[];
}
