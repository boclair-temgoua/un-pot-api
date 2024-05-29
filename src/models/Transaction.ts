import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToOne,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common';
import { FilterQueryType } from '../app/utils/search-query';
import {
    TransactionStatus,
    TransactionType,
    transactionStatusArrays,
} from '../modules/transactions/transactions.type';
import { Affiliation, Order, Organization, Subscribe } from './index';

@Entity('transaction')
export class Transaction extends BaseDeleteEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ type: 'float', nullable: true })
    amount: number;

    @Column({ type: 'float', nullable: true })
    amountConvert: number;

    @Column({ type: 'float', nullable: true })
    taxes: number;

    @Column({ type: 'float', nullable: true })
    amountInTaxes: number;

    @Column({ type: 'float', nullable: true })
    amountConvertInTaxes: number;

    @Column({ nullable: true })
    title: string;

    @Column({ nullable: true })
    description: string;

    @Column({ nullable: true })
    fullName: string;

    @Column({ nullable: true })
    email: string;

    @Column({ nullable: true })
    color: string;

    @Column({ nullable: true })
    token: string;

    @Column({ nullable: true })
    currency: string;

    @Column({ default: 'MEMBERSHIP' })
    model?: FilterQueryType;

    @Column({ type: 'enum', enum: transactionStatusArrays, default: 'IN' })
    status?: TransactionStatus;

    @Column({ default: 'CARD' })
    type?: TransactionType;

    @Column({ type: 'uuid', nullable: true })
    subscribeId?: string;
    @ManyToOne(() => Subscribe, (subscribe) => subscribe.transactions, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    subscribe?: Relation<Subscribe>;

    @Column({ type: 'uuid', nullable: true })
    orderId?: string;
    @OneToOne(() => Order, (order) => order.transaction, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    order?: Relation<Order>;

    @Column({ type: 'uuid', nullable: true })
    affiliationId?: string;
    @ManyToOne(() => Affiliation, (affiliation) => affiliation.transactions, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    affiliation?: Affiliation;

    @Column({ type: 'uuid', nullable: true })
    organizationBuyerId?: string;
    @ManyToOne(
        () => Organization,
        (organization) => organization.transactions,
        {
            onDelete: 'CASCADE',
        }
    )
    @JoinColumn([{ name: 'organizationBuyerId', referencedColumnName: 'id' }])
    organizationBuyer?: Organization;

    @Column({ type: 'uuid', nullable: true })
    organizationSellerId?: string;
    @ManyToOne(
        () => Organization,
        (organization) => organization.transactions,
        {
            onDelete: 'CASCADE',
        }
    )
    @JoinColumn([{ name: 'organizationSellerId', referencedColumnName: 'id' }])
    organizationSeller?: Organization;
}
