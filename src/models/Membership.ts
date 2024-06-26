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
import {
  FilterQueryType,
  filterQueryTypeArrays,
} from '../app/utils/search-query';
import {
  Contribution,
  Currency,
  OrderItem,
  Organization,
  Subscribe,
  Upload,
  User,
} from './index';

@Entity('membership')
export class Membership extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  title: string;

  @Column({ default: 'ACTIVE' })
  status?: ProductStatus;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'float', nullable: true })
  price: number;

  @Column({ type: 'bigint', nullable: true })
  month: number;

  @Column({ type: 'text', nullable: true })
  messageWelcome: string;

  @Column({ type: 'enum', enum: filterQueryTypeArrays, default: 'MEMBERSHIP' })
  model?: FilterQueryType;

  @Column({ type: 'boolean', default: true })
  enableVisibility: boolean;

  @Column({ type: 'uuid', nullable: true })
  organizationId?: string;
  @ManyToOne(() => Organization, (organization) => organization.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  organization?: Organization;

  @Column({ type: 'uuid', nullable: true })
  currencyId?: string;
  @ManyToOne(() => Currency, (currency) => currency.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  currency?: Relation<Currency>;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;
  @ManyToOne(() => User, (user) => user.memberships, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user?: Relation<User>;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.membership)
  orderItems: OrderItem[];

  @OneToMany(() => Contribution, (contribution) => contribution.membership, {
    onDelete: 'CASCADE',
  })
  contributions?: Contribution[];

  @OneToMany(() => Subscribe, (subscribe) => subscribe.membership)
  subscribes?: Subscribe[];

  @OneToMany(() => Upload, (upload) => upload.membership, {
    onDelete: 'CASCADE',
  })
  uploads?: Upload;
}
