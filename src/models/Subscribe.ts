import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { Organization, Transaction } from '.';
import { BaseDeleteEntity } from '../app/databases/common/index';
import { Membership } from './Membership';

@Entity('subscribe')
export class Subscribe extends BaseDeleteEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ nullable: true, type: 'timestamptz' })
    expiredAt: Date;

    @Column({ type: 'uuid', nullable: true })
    membershipId?: string;
    @ManyToOne(() => Membership, (membership) => membership.subscribes, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    membership?: Relation<Membership>;

    @Column({ type: 'uuid', nullable: true })
    subscriberId?: string;
    @ManyToOne(() => Organization, (organization) => organization.subscribes, {
        onUpdate: 'CASCADE',
    })
    @JoinColumn([{ name: 'subscriberId', referencedColumnName: 'id' }])
    subscriber?: Relation<Organization>;

    @Column({ type: 'uuid', nullable: true })
    organizationId?: string;
    @ManyToOne(() => Organization, (organization) => organization.subscribes, {
        onDelete: 'CASCADE',
    })
    organization?: Organization;

    @OneToMany(() => Transaction, (transaction) => transaction.subscribe, {
        onDelete: 'CASCADE',
    })
    transactions?: Transaction[];
}
