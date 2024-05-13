import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import { OrderItem, Organization, Transaction, User } from './index';

@Entity('order')
export class Order extends BaseDeleteEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ nullable: true })
    orderNumber: string;

    @Column({ type: 'float', nullable: true })
    totalPriceDiscount: number;

    @Column({ type: 'float', nullable: true })
    totalPriceNoDiscount: number;

    @Column({ nullable: true })
    currency: string;

    @Column({ type: 'jsonb', array: false, nullable: true })
    address?: {};

    @Column({ type: 'uuid', nullable: true })
    userId?: string;
    @ManyToOne(() => User, (user) => user.orders, { onDelete: 'CASCADE' })
    @JoinColumn()
    user?: User;

    @OneToOne(() => Transaction, (transaction) => transaction.order, {
        onDelete: 'CASCADE',
    })
    transaction?: Transaction;

    @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
    orderItems: OrderItem[];

    @Column({ type: 'uuid', nullable: true })
    organizationBuyerId?: string;
    @ManyToOne(() => Organization, (organization) => organization.orders, {
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'organizationBuyerId', referencedColumnName: 'id' }])
    organizationBuyer?: Organization;

    @Column({ type: 'uuid', nullable: true })
    organizationSellerId?: string;
    @ManyToOne(() => Organization, (organization) => organization.orders, {
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'organizationSellerId', referencedColumnName: 'id' }])
    organizationSeller?: Organization;
}
