import {
    HttpException,
    HttpStatus,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import {
    WithPaginationResponse,
    withPagination,
} from '../../app/utils/pagination';
import { useCatch } from '../../app/utils/use-catch';
import { Subscribe } from '../../models/Subscribe';
import {
    CreateSubscribeOptions,
    GetOneSubscribeSelections,
    GetSubscribesSelections,
    UpdateSubscribeOptions,
    UpdateSubscribeSelections,
} from './subscribes.type';

@Injectable()
export class SubscribesService {
    constructor(
        @InjectRepository(Subscribe)
        private driver: Repository<Subscribe>
    ) {}

    async findAll(
        selections: GetSubscribesSelections
    ): Promise<WithPaginationResponse | null> {
        const { search, pagination, subscriberId } = selections;

        let query = this.driver
            .createQueryBuilder('subscribe')
            .select('subscribe.id', 'id')
            .addSelect('subscribe.expiredAt', 'expiredAt')
            .addSelect('subscribe.createdAt', 'createdAt')
            .where('subscribe.deletedAt IS NULL')
            .leftJoin('subscribe.subscriber', 'subscriber')
            .leftJoin('subscriber.profile', 'profileSubscribing')
            .leftJoin('subscribe.user', 'user')
            .leftJoin('user.profile', 'profileSubscriber');

        //     if (userId) {
        //         query = query
        //             .addSelect(
        //                 /*sql*/ `jsonb_build_object(
        //     'firstName', "profileSubscribing"."firstName",
        //     'lastName', "profileSubscribing"."lastName",
        //     'fullName', "profileSubscribing"."fullName",
        //     'image', "profileSubscribing"."image",
        //     'color', "profileSubscribing"."color",
        //     'userId', "subscriber"."id",
        //     'username', "subscriber"."username"
        // ) AS "profile"`
        //             )
        //             .andWhere('subscribe.userId = :userId', { userId });
        //     }

        if (subscriberId) {
            query = query
                .addSelect(
                    /*sql*/ `jsonb_build_object(
        'firstName', "profileSubscriber"."firstName",
        'lastName', "profileSubscriber"."lastName",
        'fullName', "profileSubscriber"."fullName",
        'image', "profileSubscriber"."image",
        'color', "profileSubscriber"."color",
        'username', "user"."username"
    ) AS "profile"`
                )
                .andWhere('subscribe.subscriberId = :subscriberId', {
                    subscriberId,
                });
        }

        if (search) {
            query = query.andWhere(
                new Brackets((qb) => {
                    qb.where('subscriber.email ::text ILIKE :search', {
                        search: `%${search}%`,
                    })
                        .orWhere('profile.firstName ::text ILIKE :search', {
                            search: `%${search}%`,
                        })
                        .orWhere('profile.lastName ::text ILIKE :search', {
                            search: `%${search}%`,
                        })
                        .orWhere('profile.fullName ::text ILIKE :search', {
                            search: `%${search}%`,
                        });
                })
            );
        }

        const [errorRowCount, rowCount] = await useCatch(query.getCount());
        if (errorRowCount) throw new NotFoundException(errorRowCount);

        const [error, follows] = await useCatch(
            query
                .orderBy('subscribe.createdAt', pagination?.sort)
                .limit(pagination.limit)
                .offset(pagination.offset)
                .getRawMany()
        );
        if (error) throw new NotFoundException(error);

        return withPagination({
            pagination,
            rowCount,
            value: follows,
        });
    }

    async findAllNotPaginate(
        selections: GetSubscribesSelections
    ): Promise<any> {
        const { organizationId, subscriberId } = selections;

        let query = this.driver
            .createQueryBuilder('subscribe')
            .select('subscribe.subscriberId', 'subscriberId')
            .addSelect('subscribe.expiredAt', 'expiredAt')
            .where('subscribe.deletedAt IS NULL');

        if (organizationId) {
            query = query.andWhere(
                'subscribe.organizationId = :organizationId',
                { organizationId }
            );
        }

        if (subscriberId) {
            query = query.andWhere('subscribe.subscriberId = :subscriberId', {
                subscriberId,
            });
        }

        const [error, follows] = await useCatch(query.getRawMany());
        if (error) throw new NotFoundException(error);

        return follows;
    }

    async findOneBy(selections: GetOneSubscribeSelections): Promise<Subscribe> {
        const { subscribeId, subscriberId, organizationId } = selections;
        let query = this.driver
            .createQueryBuilder('subscribe')
            .where('subscribe.deletedAt IS NULL');

        if (organizationId) {
            query = query.andWhere(
                'subscribe.organizationId = :organizationId',
                {
                    organizationId,
                }
            );
        }

        if (subscriberId) {
            query = query.andWhere('subscribe.subscriberId = :subscriberId', {
                subscriberId,
            });
        }

        if (subscribeId) {
            query = query.andWhere('Subscribe.id = :id', {
                id: subscribeId,
            });
        }

        const [error, result] = await useCatch(query.getOne());
        if (error)
            throw new HttpException(
                'Subscribe not found',
                HttpStatus.NOT_FOUND
            );

        return result;
    }

    /** Create one Subscribe to the database. */
    async createOne(options: CreateSubscribeOptions): Promise<Subscribe> {
        const { organizationId, subscriberId, expiredAt, membershipId } =
            options;

        const subscribe = new Subscribe();
        subscribe.expiredAt = expiredAt;
        subscribe.subscriberId = subscriberId;
        subscribe.membershipId = membershipId;
        subscribe.organizationId = organizationId;

        const query = this.driver.save(subscribe);

        const [error, result] = await useCatch(query);
        if (error) throw new NotFoundException(error);

        return result;
    }

    /** Update one Subscribe to the database. */
    async updateOne(
        selections: UpdateSubscribeSelections,
        options: UpdateSubscribeOptions
    ): Promise<Subscribe> {
        const { subscribeId } = selections;
        const { deletedAt, subscriberId, expiredAt, membershipId } = options;

        let findQuery = this.driver.createQueryBuilder('subscribe');

        if (subscribeId) {
            findQuery = findQuery.where('subscribe.id = :id', {
                id: subscribeId,
            });
        }

        const [errorFind, subscribe] = await useCatch(findQuery.getOne());
        if (errorFind) throw new NotFoundException(errorFind);

        subscribe.expiredAt = expiredAt;
        subscribe.subscriberId = subscriberId;
        subscribe.membershipId = membershipId;
        subscribe.deletedAt = deletedAt;

        const query = this.driver.save(subscribe);

        const [errorUp, result] = await useCatch(query);
        if (errorUp) throw new NotFoundException(errorUp);

        return result;
    }
}
