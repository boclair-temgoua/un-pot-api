import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation,
} from 'typeorm';
import { BaseDeleteEntity } from '../app/databases/common/index';
import { Organization } from './index';

@Entity('follow')
export class Follow extends BaseDeleteEntity {
    @PrimaryGeneratedColumn('uuid')
    id?: string;

    @Column({ type: 'uuid', nullable: true })
    followerId?: string;
    @ManyToOne(() => Organization, (organization) => organization.follows, {
        onDelete: 'CASCADE',
    })
    @JoinColumn([{ name: 'followerId', referencedColumnName: 'id' }])
    follower?: Relation<Organization>;

    @Column({ type: 'uuid', nullable: true })
    organizationId?: string;
    @ManyToOne(() => Organization, (organization) => organization.follows, {
        onDelete: 'CASCADE',
    })
    @JoinColumn()
    organization?: Organization;
}
