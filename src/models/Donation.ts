import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common';
import { Organization } from './index';

@Entity('donation')
export class Donation extends BaseDeleteEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ nullable: true })
    title: string;

    @Column({ type: 'float' })
    price: number;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'text', nullable: true })
    messageWelcome: string;

    @Column({ type: 'uuid', nullable: true })
    organizationId?: string;
    @OneToOne(() => Organization, (organization) => organization.donation, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    organization?: Relation<Organization>;
}
