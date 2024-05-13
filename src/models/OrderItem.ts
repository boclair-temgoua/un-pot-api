import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { BaseDeleteEntity } from '../app/databases/common';
import {
    FilterQueryType,
    filterQueryTypeArrays,
} from '../app/utils/search-query';
import {
    OrderItemStatus,
    orderItemStatusArrays,
} from '../modules/order-items/order-items.type';
import { Membership, Order, Organization, Product, User } from './index';

@Entity('order_item')
export class OrderItem extends BaseDeleteEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ nullable: true })
    orderNumber: string;

    @Column({ type: 'bigint', nullable: true })
    quantity: number;

    @Column({ type: 'bigint', nullable: true })
    percentDiscount: number;

    @Column({ type: 'bigint', nullable: true })
    price: number;

    @Column({ type: 'bigint', nullable: true })
    priceDiscount: number;

    @Column({ type: 'jsonb', array: false, nullable: true })
    uploadsFiles?: any[];

    @Column({ type: 'jsonb', array: false, nullable: true })
    uploadsImages?: any[];

    @Column({ type: 'enum', enum: filterQueryTypeArrays, default: 'PRODUCT' })
    model?: FilterQueryType;

    @Column({ type: 'enum', enum: orderItemStatusArrays, default: 'PENDING' })
    status?: OrderItemStatus;

    @Column({ nullable: true })
    currency: string;

    @Column({ type: 'uuid', nullable: true })
    productId?: string;
    @ManyToOne(() => Product, (product) => product.orderItems, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    product?: Product;

    @Column({ type: 'uuid', nullable: true })
    membershipId?: string;
    @ManyToOne(() => Membership, (membership) => membership.orderItems, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    membership?: Membership;

    @Column({ type: 'uuid', nullable: true })
    orderId?: string;
    @ManyToOne(() => Order, (order) => order.orderItems, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    order?: Order;

    @Column({ type: 'uuid', nullable: true })
    userId?: string;
    @ManyToOne(() => User, (user) => user.orderItems, { onDelete: 'CASCADE' })
    @JoinColumn()
    user?: User;

    @Column({ type: 'uuid', nullable: true })
    organizationSellerId?: string;
    @ManyToOne(() => Organization, (organization) => organization.orderItems, {
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'organizationSellerId', referencedColumnName: 'id' }])
    organizationSeller?: Organization;

    @Column({ type: 'uuid', nullable: true })
    organizationBuyerId?: string;
    @ManyToOne(() => Organization, (organization) => organization.orderItems, {
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'organizationBuyerId', referencedColumnName: 'id' }])
    organizationBuyer?: Organization;
}
