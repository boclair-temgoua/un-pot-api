import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from './Product';
import { BaseEntity } from '../app/databases/common';
import { Gift } from './Gift';
import { Contribution } from './Contribution';
import { Membership } from './Membership';

@Entity('currency')
export class Currency extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  code: string;

  @Column({ nullable: true })
  symbol: string;

  @Column({ type: 'float', default: 0 })
  amount: number;

  @Column({ default: true, type: 'boolean' })
  isActive: boolean;

  @OneToMany(() => Product, (product) => product.currency)
  products: Product[];

  @OneToMany(() => Gift, (gift) => gift.currency)
  gifts?: Gift[];

  @OneToMany(() => Contribution, (contribution) => contribution.currency)
  contributions?: Contribution[];

  @OneToMany(() => Membership, (membership) => membership.currency)
  memberships?: Membership[];
}
