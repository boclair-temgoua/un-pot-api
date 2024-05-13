import { Injectable } from '@nestjs/common';
import {
    addMonthsFormateDDMMYYDate,
    dateTimeNowUtc,
    formateNowDateUnixInteger,
} from '../../app/utils/formate-date';
import { FilterQueryType } from '../../app/utils/search-query';
import { FollowsService } from '../follows/follows.service';
import { MembershipsService } from '../memberships/memberships.service';
import { OrdersUtil } from '../orders/orders.util';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionType } from '../transactions/transactions.type';
import { AmountModel } from '../wallets/wallets.type';
import { SubscribesService } from './subscribes.service';

@Injectable()
export class SubscribesUtil {
    constructor(
        private readonly ordersUtil: OrdersUtil,
        private readonly followsService: FollowsService,
        private readonly subscribesService: SubscribesService,
        private readonly membershipsService: MembershipsService,
        private readonly transactionsService: TransactionsService
    ) {}

    async createOrUpdateOneSubscribe(options: {
        amount: AmountModel;
        type?: TransactionType;
        model: FilterQueryType;
        membershipId: string;
        description: string;
        token: string;
        amountValueConvert: number;
        organizationBuyerId: string;
        organizationSellerId: string;
        userAddress: any;
    }): Promise<any> {
        const {
            membershipId,
            amountValueConvert,
            description,
            type,
            amount,
            model,
            token,
            userAddress,
            organizationBuyerId,
            organizationSellerId,
        } = options;

        const findOneMembership = await this.membershipsService.findOneBy({
            membershipId,
            organizationId: organizationSellerId,
        });

        const findOneFollow = await this.followsService.findOneBy({
            organizationId: organizationBuyerId,
            followerId: findOneMembership?.organizationId,
        });
        if (!findOneFollow) {
            await this.followsService.createOne({
                organizationId: organizationBuyerId,
                followerId: findOneMembership?.organizationId,
            });
        }

        const findOneSubscribe = await this.subscribesService.findOneBy({
            organizationId: organizationBuyerId,
            subscriberId: findOneMembership?.organizationId,
        });
        if (!findOneSubscribe) {
            const subscribe = await this.subscribesService.createOne({
                membershipId,
                organizationId: organizationBuyerId,
                subscriberId: findOneMembership?.organizationId,
                expiredAt: addMonthsFormateDDMMYYDate({
                    date: dateTimeNowUtc(),
                    monthNumber: amount?.month,
                }),
            });

            const { transaction } = await this.createTransactionAndOrder({
                amount,
                type,
                model: model,
                membershipId,
                description,
                token: token,
                amountValueConvert,
                subscribeId: subscribe?.id,
                userAddress,
                organizationBuyerId,
                organizationSellerId,
            });

            return { transaction };
        } else {
            const dateExpired = formateNowDateUnixInteger(
                findOneSubscribe?.expiredAt
            );
            const dateNow = formateNowDateUnixInteger(dateTimeNowUtc());
            await this.subscribesService.updateOne(
                { subscribeId: findOneSubscribe?.id },
                {
                    membershipId,
                    organizationId: organizationBuyerId,
                    subscriberId: findOneMembership?.organizationId,
                    expiredAt:
                        dateExpired > dateNow
                            ? addMonthsFormateDDMMYYDate({
                                  date: findOneSubscribe?.expiredAt,
                                  monthNumber: amount?.month,
                              })
                            : addMonthsFormateDDMMYYDate({
                                  date: dateTimeNowUtc(),
                                  monthNumber: amount?.month,
                              }),
                }
            );
            const { transaction } = await this.createTransactionAndOrder({
                amount,
                type,
                model: model,
                membershipId: findOneMembership?.id,
                description,
                token: token,
                amountValueConvert,
                subscribeId: findOneSubscribe?.id,
                userAddress,
                organizationBuyerId,
                organizationSellerId,
            });
            return { transaction };
        }
    }

    async createTransactionAndOrder(options: {
        amount: AmountModel;
        type?: TransactionType;
        model: FilterQueryType;
        membershipId: string;
        description: string;
        token: string;
        amountValueConvert: number;
        subscribeId: string;
        organizationBuyerId: string;
        organizationSellerId: string;
        userAddress: any;
    }): Promise<any> {
        const {
            membershipId,
            description,
            type,
            amount,
            model,
            token,
            userAddress,
            subscribeId,
            amountValueConvert,
            organizationBuyerId,
            organizationSellerId,
        } = options;

        const { order } =
            await this.ordersUtil.orderCommissionOrMembershipCreate({
                amount,
                userAddress,
                model: 'MEMBERSHIP',
                organizationBuyerId,
                organizationSellerId,
                membershipId,
            });

        const transaction = await this.transactionsService.createOne({
            type,
            model,
            token,
            currency: amount?.currency,
            subscribeId,
            orderId: order?.id,
            amount: amount?.value,
            amountConvert: amountValueConvert,
            description,
            organizationBuyerId,
            organizationSellerId,
        });

        return { transaction, order };
    }
}
