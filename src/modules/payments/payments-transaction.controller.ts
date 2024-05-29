import {
    Body,
    Controller,
    Headers,
    HttpException,
    HttpStatus,
    Post,
    Res,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { CommentsService } from '../comments/comments.service';
import { MembershipsService } from '../memberships/memberships.service';
import { OrderItemsService } from '../order-items/order-items.service';
import { OrdersUtil } from '../orders/orders.util';
import { ProductsService } from '../products/products.service';
import { SubscribesUtil } from '../subscribes/subscribes.util';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionsUtil } from '../transactions/transactions.util';
import { UsersService } from '../users/users.service';
import { WalletsService } from '../wallets/wallets.service';
import { CreateSubscribePaymentsDto } from './payments.dto';
import { PaymentsUtil } from './payments.util';

@Controller('payments')
export class PaymentsTransactionController {
    constructor(
        private readonly paymentsUtil: PaymentsUtil,
        private readonly productsService: ProductsService,
        private readonly walletsService: WalletsService,
        private readonly transactionsUtil: TransactionsUtil,
        private readonly subscribesUtil: SubscribesUtil,
        private readonly usersService: UsersService,
        private readonly commentsService: CommentsService,
        private readonly ordersUtil: OrdersUtil,
        private readonly orderItemsService: OrderItemsService,
        private readonly membershipsService: MembershipsService,
        private readonly transactionsService: TransactionsService
    ) {}

    /** Get subscribe */
    // @Get(`/stripe/client-secret`)
    // async createOneClientSecretStripe(
    //     @Res() res,
    //     @Query() query: CreateClientSecretStripeDto
    // ) {
    //     const { amount, currency, reference } = query;
    //     const { value: amountValueConvert } =
    //         await this.transactionsUtil.convertedValue({
    //             currency: currency,
    //             value: amount,
    //         });

    //     const paymentIntent = await stripePrivate.paymentIntents.create({
    //         amount: amountValueConvert * 100,
    //         currency: 'USD',
    //         metadata: { reference },
    //     });
    //     if (!paymentIntent.client_secret) {
    //         throw new HttpException(
    //             `Stripe failed to create payment intent`,
    //             HttpStatus.NOT_FOUND
    //         );
    //     }

    //     return reply({ res, results: paymentIntent });
    // }
    /** Create subscribe */
    @Post(`/paypal/subscribe`)
    async createOnePaypalSubscribe(
        @Res() res,
        @Headers('origin') origin: string,
        @Body() body: CreateSubscribePaymentsDto
    ) {
        const {
            amount,
            membershipId,
            reference,
            userAddress,
            organizationBuyerId,
            organizationSellerId,
        } = body;

        const findOneMembership = await this.membershipsService.findOneBy({
            membershipId: membershipId,
            organizationId: organizationSellerId,
        });
        if (!findOneMembership) {
            throw new HttpException(
                `This membership ${membershipId} dons't exist`,
                HttpStatus.NOT_FOUND
            );
        }

        const {
            taxes,
            value: amountValueConvert,
            valueAfterExecuteTaxes,
        } = await this.transactionsUtil.convertedValue({
            taxes: amount?.taxes,
            value: amount?.value,
            currency: amount?.currency,
        });

        const { transaction } =
            await this.subscribesUtil.createOrUpdateOneSubscribe({
                userAddress,
                organizationBuyerId,
                organizationSellerId,
                amount: {
                    taxes,
                    currency: amount?.currency.toUpperCase(),
                    value: amount?.value * 100,
                    month: amount?.month,
                },
                membershipId,
                type: 'PAYPAL',
                token: reference,
                model: 'MEMBERSHIP',
                description: `Subscription ${amount?.month} month`,
                amountValueConvert: amountValueConvert * 100,
            });

        if (transaction?.token) {
            await this.walletsService.incrementOne({
                amount: transaction?.amountConvert,
                organizationId: transaction?.organizationId,
            });
        }

        return reply({ res, results: reference });
    }

    /** Create subscribe */
    @Post(`/stripe/subscribe`)
    async createOneStripeSubscribe(
        @Res() res,
        @Headers('origin') origin: string,
        @Body() body: CreateSubscribePaymentsDto
    ) {
        const {
            amount,
            membershipId,
            reference,
            card,
            userAddress,
            organizationBuyerId,
            organizationSellerId,
        } = body;
        const findOneMembership = await this.membershipsService.findOneBy({
            membershipId: membershipId,
            organizationId: organizationSellerId,
        });
        if (!findOneMembership) {
            throw new HttpException(
                `This membership ${membershipId} dons't exist`,
                HttpStatus.NOT_FOUND
            );
        }

        await this.paymentsUtil.paymentsTransactionStripe({
            userAddress,
            organizationBuyerId,
            organizationSellerId,
            amount,
            reference,
            card,
            urlOrigin: origin,
            membershipId,
        });

        return reply({ res, results: reference });
    }

    /** Create Donation */
    @Post(`/paypal/donation`)
    async createOnePaypalDonation(
        @Res() res,
        @Headers('origin') origin: string,
        @Body() body: CreateSubscribePaymentsDto
    ) {
        const { amount, organizationSellerId, reference } = body;

        const {
            taxes,
            value: amountValueConvert,
            valueAfterExecuteTaxes,
        } = await this.transactionsUtil.convertedValue({
            taxes: amount?.taxes,
            value: amount?.value,
            currency: amount?.currency,
        });

        const transaction = await this.transactionsService.createOne({
            amount: amount?.value * 100,
            currency: amount?.currency.toUpperCase(),
            organizationSellerId,
            type: 'PAYPAL',
            token: reference,
            model: 'DONATION',
            fullName: 'Somebody',
            description: amount?.description || 'bought un pot',
            amountConvert: amountValueConvert * 100,
        });

        if (transaction?.token) {
            await this.walletsService.incrementOne({
                amount: transaction?.amountConvert,
                organizationId: transaction?.organizationSellerId,
            });

            await this.commentsService.createOne({
                model: transaction?.model,
                color: transaction?.color,
                email: transaction?.email,
                fullName: transaction?.fullName,
                description: transaction?.description,
                organizationId: transaction?.organizationSellerId,
            });
        }

        return reply({ res, results: reference });
    }

    /** Create Donation */
    @Post(`/stripe/donation`)
    async createOneStripeDonation(
        @Res() res,
        @Headers('origin') origin: string,
        @Body() body: CreateSubscribePaymentsDto
    ) {
        const {
            amount,
            organizationSellerId,
            organizationBuyerId,
            reference,
            card,
        } = body;

        const {
            taxes,
            value: amountValueConvert,
            valueAfterExecuteTaxes,
        } = await this.transactionsUtil.convertedValue({
            taxes: amount?.taxes,
            value: amount?.value,
            currency: amount?.currency,
        });

        const { paymentIntents } = await this.paymentsUtil.stripeMethod({
            card,
            currency: amount?.currency.toUpperCase(),
            amountDetail: amount,
            token: reference,
            organizationBuyerId,
            urlOrigin: origin,
            description: amount?.description || 'bought un pot',
        });
        if (!paymentIntents) {
            throw new HttpException(
                `Transaction not found please try again`,
                HttpStatus.NOT_FOUND
            );
        }

        if (paymentIntents) {
            const transaction = await this.transactionsService.createOne({
                amount: amount?.value * 100,
                currency: paymentIntents?.currency.toUpperCase(),
                organizationSellerId,
                type: 'CARD',
                token: reference,
                model: 'DONATION',
                email: card?.email,
                fullName: card?.fullName ?? 'Somebody',
                description: paymentIntents?.description,
                amountConvert: amountValueConvert * 100,
            });

            if (transaction?.token) {
                await this.walletsService.incrementOne({
                    amount: transaction?.amountConvert,
                    organizationId: transaction?.organizationSellerId,
                });

                await this.commentsService.createOne({
                    model: transaction?.model,
                    color: transaction?.color,
                    email: transaction?.email,
                    fullName: transaction?.fullName,
                    description: transaction?.description,
                    organizationId: transaction?.organizationSellerId,
                });
            }
        }

        return reply({ res, results: reference });
    }

    /** Create Shop */
    @Post(`/paypal/shop`)
    async createOnePaypalShop(
        @Res() res,
        @Body() body: CreateSubscribePaymentsDto
    ) {
        const {
            amount,
            organizationSellerId,
            organizationBuyerId,
            reference,
            cartOrderId,
            userAddress,
        } = body;
        const findOneUser = await this.usersService.findOneBy({
            userId: '',
        });
        if (!findOneUser) {
            throw new HttpException(
                `This user dons't exist please change`,
                HttpStatus.NOT_FOUND
            );
        }

        const {
            taxes,
            value: amountValueConvert,
            valueAfterExecuteTaxes,
        } = await this.transactionsUtil.convertedValue({
            taxes: amount?.taxes,
            value: amount?.value,
            currency: amount?.currency,
        });
        const { order } = await this.ordersUtil.orderShopCreate({
            organizationBuyerId,
            cartOrderId,
            organizationSellerId,
            userAddress,
        });

        const transaction = await this.transactionsService.createOne({
            amount: amount?.value * 100,
            currency: amount?.currency.toUpperCase(),
            organizationSellerId,
            orderId: order?.id,
            type: 'PAYPAL',
            token: reference,
            model: 'PRODUCT',
            email: findOneUser?.email,
            description: `Product shop userId: ${findOneUser?.id}`,
            amountConvert: amountValueConvert * 100,
        });

        if (transaction?.token) {
            await this.walletsService.incrementOne({
                amount: transaction?.amountConvert,
                organizationId: transaction?.organizationSellerId,
            });
        }

        return reply({ res, results: reference });
    }

    /** Create Shop */
    @Post(`/stripe/shop`)
    async createOneStripeShop(
        @Res() res,
        @Headers('origin') origin: string,
        @Body() body: CreateSubscribePaymentsDto
    ) {
        const {
            affiliation,
            amount,
            organizationSellerId,
            organizationBuyerId,
            reference,
            cartOrderId,
            productId,
            card,
            userAddress,
        } = body;

        const findOneProduct = await this.productsService.findOneBy({
            productId: productId,
            organizationId: organizationSellerId,
        });
        if (!findOneProduct) {
            throw new HttpException(
                `This product ${productId} dons't exist please change`,
                HttpStatus.NOT_FOUND
            );
        }

        const {
            taxes,
            value: amountConvert,
            valueAfterExecuteTaxes: amountValueConvertAfterExecuteTaxes,
        } = await this.transactionsUtil.convertedValue({
            taxes: amount?.taxes,
            value: amount?.value,
            currency: amount?.currency,
        });

        const { order, transaction } = await this.ordersUtil.orderEventCreate({
            taxes,
            amount,
            reference,
            type: 'CARD',
            userAddress,
            affiliation,
            organizationBuyerId,
            organizationSellerId,
            model: findOneProduct?.model,
            productId: findOneProduct?.id,
            amountConvert: amountConvert,
            description: 'description test',
            currency: amount?.currency?.toUpperCase(),
            amountConvertAfterExecuteTaxes: amountValueConvertAfterExecuteTaxes,
        });

        await this.paymentsUtil.createOrderItemMethod({
            order,
            amount,
            transaction,
            userAddress,
            urlOrigin: origin,
            product: findOneProduct,
        });

        // await this.orderItemsService.createOne({
        //     // orderId: order?.id,
        //     // status: 'DELIVERED',
        //     // organizationBuyerId,
        //     // model: transaction.model,
        //     // currency: order?.currency,
        //     // quantity: amount?.quantity,
        //     // price: Number(amount?.value),
        //     // productId: findOneProduct?.id,
        //     // organizationSellerId: findOneProduct?.organizationId,
        //     // uploadsImages: findOneProduct?.uploadsImages,
        //     // uploadsFiles: findOneProduct?.uploadsFiles,

        //     model: 'PRODUCT',
        //     productId: findOneProduct?.id,
        //     quantity: amount.quantity,
        //     currency: order?.currency,
        //     orderId: order?.id,
        //     status: 'ACCEPTED',
        //     affiliationId: transaction.affiliationId,
        //     price: oneValue * 100,
        //     priceDiscount: oneValue * 100,
        //     expiredAt: product?.expiredAt,
        //     organizationBuyerId: order?.organizationBuyerId,
        //     organizationSellerId: order?.organizationSellerId,
        //     uploadsImages: uploadsImages,
        // });

        // if (transaction?.token) {
        //     await this.walletsService.incrementOne({
        //         amount: transaction?.amountConvertInTaxes,
        //         organizationId: transaction?.organizationSellerId,
        //     });
        // }

        // const { paymentIntents } = await this.paymentsUtil.stripeMethod({
        //     card,
        //     currency: amount?.currency.toUpperCase(),
        //     amountDetail: amount,
        //     token: reference,
        //     urlOrigin: origin,
        //     organizationBuyerId: organizationBuyerId,
        //     description: `Product shop organizationId ${organizationBuyerId}`,
        // });
        // if (!paymentIntents) {
        //     throw new HttpException(
        //         `Transaction not found please try again`,
        //         HttpStatus.NOT_FOUND
        //     );
        // }

        // if (paymentIntents) {
        //     const { order, transaction } =
        //         await this.ordersUtil.orderEventCreate({
        //             taxes,
        //             amount,
        //             reference,
        //             type: 'CARD',
        //             userAddress,
        //             model: 'PRODUCT',
        //             affiliation,
        //             organizationBuyerId,
        //             organizationSellerId,
        //             productId: findOneProduct?.id,
        //             amountConvert: amountConvert,
        //             description: paymentIntents?.description,
        //             currency: amount?.currency?.toUpperCase(),
        //             amountConvertAfterExecuteTaxes:
        //                 amountValueConvertAfterExecuteTaxes,
        //         });

        //     await this.orderItemsService.createOne({
        //         userId: order?.userId,
        //         currency: order?.currency,
        //         quantity: amount?.quantity,
        //         price: Number(amount?.value),
        //         organizationBuyerId: organizationBuyerId,
        //         organizationSellerId: organizationSellerId,
        //         model: transaction.model,
        //         productId: productId,
        //         orderId: order?.id,
        //         status: 'DELIVERED',
        //         uploadsImages: [...findOneProduct?.uploadsImages],
        //         uploadsFiles: [...findOneProduct?.uploadsFiles],
        //     });

        //     if (transaction?.token) {
        //         await this.walletsService.incrementOne({
        //             amount: transaction?.amountConvertInTaxes,
        //             organizationId: transaction?.organizationSellerId,
        //         });
        //     }
        // }

        return reply({ res, results: reference });
    }

    /** Create Commission */
    @Post(`/stripe/commission`)
    async createOneCommission(
        @Res() res,
        @Headers('origin') origin: string,
        @Body() body: CreateSubscribePaymentsDto
    ) {
        const {
            amount,
            organizationSellerId,
            organizationBuyerId,
            userAddress,
            productId,
            reference,
            card,
        } = body;

        const findOneProduct = await this.productsService.findOneBy({
            productId: productId,
            organizationId: organizationSellerId,
        });
        if (!findOneProduct) {
            throw new HttpException(
                `This product ${productId} dons't exist please change`,
                HttpStatus.NOT_FOUND
            );
        }

        const {
            taxes,
            value: amountValueConvert,
            valueAfterExecuteTaxes,
        } = await this.transactionsUtil.convertedValue({
            taxes: amount?.taxes,
            value: amount?.value,
            currency: amount?.currency,
        });

        const { paymentIntents } = await this.paymentsUtil.stripeMethod({
            card,
            currency: amount?.currency.toUpperCase(),
            amountDetail: amount,
            token: reference,
            organizationBuyerId,
            urlOrigin: origin,
            description: `Commission ${findOneProduct?.title}`,
        });
        if (!paymentIntents) {
            throw new HttpException(
                `Transaction not found please try again`,
                HttpStatus.NOT_FOUND
            );
        }

        if (paymentIntents) {
            const { order } =
                await this.ordersUtil.orderCommissionOrMembershipCreate({
                    amount,
                    userAddress,
                    model: 'COMMISSION',
                    organizationBuyerId,
                    organizationSellerId,
                    productId: findOneProduct?.id,
                });
            const transaction = await this.transactionsService.createOne({
                amount: Number(paymentIntents?.amount_received),
                currency: paymentIntents?.currency?.toUpperCase(),
                organizationSellerId,
                orderId: order?.id,
                type: 'CARD',
                token: reference,
                model: 'COMMISSION',
                description: paymentIntents?.description,
                amountConvert: amountValueConvert * 100,
            });

            if (transaction?.token) {
                await this.walletsService.incrementOne({
                    amount: transaction?.amountConvert,
                    organizationId: transaction?.organizationSellerId,
                });
            }
        }

        // send email to buyer
        // await orderCommissionJob({ email: findOneUser?.email, token: '' });

        return reply({ res, results: reference });
    }

    @Post(`/paypal/commission`)
    async createOnePayPalCommission(
        @Res() res,
        @Body() body: CreateSubscribePaymentsDto
    ) {
        const {
            amount,
            organizationSellerId,
            organizationBuyerId,
            userAddress,
            productId,
            reference,
        } = body;
        const findOneProduct = await this.productsService.findOneBy({
            productId: productId,
            organizationId: organizationSellerId,
        });
        if (!findOneProduct) {
            throw new HttpException(
                `This product ${productId} dons't exist please change`,
                HttpStatus.NOT_FOUND
            );
        }

        const {
            taxes,
            value: amountValueConvert,
            valueAfterExecuteTaxes,
        } = await this.transactionsUtil.convertedValue({
            taxes: amount?.taxes,
            value: amount?.value,
            currency: amount?.currency,
        });

        const { order } =
            await this.ordersUtil.orderCommissionOrMembershipCreate({
                amount,
                userAddress,
                model: 'COMMISSION',
                organizationBuyerId,
                organizationSellerId,
                productId: findOneProduct?.id,
            });

        const transaction = await this.transactionsService.createOne({
            currency: amount?.currency.toUpperCase(),
            amount: Number(amount?.value) * 100,
            organizationSellerId,
            orderId: order?.id,
            type: 'PAYPAL',
            token: reference,
            model: 'COMMISSION',
            description: `Commission ${findOneProduct?.title}`,
            amountConvert: amountValueConvert * 100,
        });

        if (transaction?.token) {
            await this.walletsService.incrementOne({
                amount: transaction?.amountConvert,
                organizationId: transaction?.organizationSellerId,
            });
        }

        return reply({ res, results: reference });
    }
}
