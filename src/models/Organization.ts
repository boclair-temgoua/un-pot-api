import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { User } from './User';
import { BaseDeleteEntity } from '../app/databases/common/BaseDeleteEntity';
import { Contributor } from './Contributor';
import { Product } from './Product';
import { Transaction } from './Transaction';
import { Discount } from './Discount';
import { Donation } from './Donation';
import { Investment } from './Investment';

@Entity('organization')
export class Organization extends BaseDeleteEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  name?: string;

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  firstAddress?: string;

  @Column({ nullable: true })
  secondAddress?: string;

  @Column({ default: false })
  requiresPayment?: boolean;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @ManyToOne(() => User, (user) => user.organizations, { onDelete: 'CASCADE' })
  @JoinColumn()
  user?: User;

  @OneToMany(() => User, (user) => user.organizationInUtilization, {
    onDelete: 'CASCADE',
  })
  users?: User[];

  @OneToMany(() => Contributor, (contributor) => contributor.organization, {
    onDelete: 'CASCADE',
  })
  contributors?: Contributor[];

  @OneToMany(() => Product, (product) => product.organization, {
    onDelete: 'CASCADE',
  })
  products?: Product[];

  @OneToMany(() => Transaction, (transaction) => transaction.organization, {
    onDelete: 'CASCADE',
  })
  transactions?: Transaction[];

  @OneToMany(() => Discount, (discount) => discount.organization, {
    onDelete: 'CASCADE',
  })
  discounts: Discount[];

  @OneToMany(() => Donation, (donation) => donation.organization, {
    onDelete: 'CASCADE',
  })
  donations?: Donation[];

  @OneToMany(() => Investment, (investment) => investment.organization, {
    onDelete: 'CASCADE',
  })
  investments?: Investment[];
}
