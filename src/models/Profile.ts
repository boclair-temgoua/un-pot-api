import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  ManyToOne,
  Generated,
} from 'typeorm';

import { User } from './User';
import { BaseDeleteEntity } from '../app/databases/common';
@Entity('profile')
export class Profile extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  firstAddress?: string;

  @Column({ nullable: true })
  secondAddress?: string;

  @Column({ nullable: true })
  birthday?: Date;

  @Column({ type: 'uuid', nullable: true })
  currencyId?: string;

  @Column({ type: 'uuid', nullable: true })
  countryId?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ type: 'boolean', default: false })
  enableCommission: boolean;

  @Column({ type: 'boolean', default: false })
  enableShop: boolean;

  @Column({ type: 'boolean', default: false })
  enableGallery: boolean;

  @Column({ nullable: true })
  url?: string;

  @OneToOne(() => User, (user) => user.profile, {
    onDelete: 'CASCADE',
  })
  user?: User;
}
