import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { config } from '../../app/config/index';
import { Order, Transaction, UserAddress } from '../../models';
import { OrderItemsService } from '../order-items/order-items.service';
import { SubscribesUtil } from '../subscribes/subscribes.util';
import { TransactionsUtil } from '../transactions/transactions.util';
import { WalletsService } from '../wallets/wallets.service';
import { AmountModel, CardModel } from '../wallets/wallets.type';
import { PaymentsService } from './payments.service';

const apiVersion = '2024-04-10';
export const stripePrivate = new Stripe(
    String(config.implementations.stripe.privateKey),
    { apiVersion }
);

const stripePublic = new Stripe(
    String(config.implementations.stripe.publicKey),
    { apiVersion }
);

@Injectable()
export class PaymentsUtil {
    constructor(
        private readonly paymentsService: PaymentsService,
        private readonly subscribesUtil: SubscribesUtil,
        private readonly walletsService: WalletsService,
        private readonly orderItemsService: OrderItemsService,
        private readonly transactionsUtil: TransactionsUtil
    ) {}

    /** Stripe billing */
    async stripeTokenCheck(options: {
        name: string;
        email?: string;
        cardNumber?: string;
        cardExpMonth?: number;
        cardExpYear?: number;
        cardCvc?: string;
        token?: string;
    }): Promise<any> {
        const { name, email, cardNumber, cardExpMonth, cardExpYear, cardCvc } =
            options;
        const billingDetails: Stripe.CustomerCreateParams = {
            name: name,
            email: email,
        };
        const paymentMethod = await stripePublic.paymentMethods.create({
            type: 'card',
            card: {
                number: cardNumber.split(' ').join(''),
                exp_month: Number(cardExpMonth),
                exp_year: Number(cardExpYear),
                cvc: cardCvc,
            },
            billing_details: billingDetails,
        });
        if (!paymentMethod) {
            throw new HttpException(`Invalid card`, HttpStatus.NOT_ACCEPTABLE);
        }

        const customer: Stripe.Customer =
            await stripePrivate.customers.create(billingDetails);
        if (!customer) {
            throw new HttpException(
                `Transaction not found please try again`,
                HttpStatus.NOT_FOUND
            );
        }
        return { paymentMethod, customer };
    }

    /** Stripe billing */
    async stripeMethod(options: {
        description?: string;
        amountDetail: AmountModel;
        token: string;
        currency: string;
        card: CardModel;
        organizationBuyerId: string;
        urlOrigin: string;
    }): Promise<any> {
        const {
            token,
            organizationBuyerId,
            description,
            amountDetail,
            currency,
            card,
            urlOrigin,
        } = options;
        const {
            cardNumber,
            cardExpMonth,
            isSaveCard,
            cardExpYear,
            cardCvc,
            email,
            fullName,
        } = card;

        const { paymentMethod } = await this.stripeTokenCheck({
            cardNumber,
            cardExpMonth,
            cardExpYear,
            cardCvc,
            email,
            name: fullName,
        });

        const paymentIntents = await stripePrivate.paymentIntents.create({
            amount: Number(amountDetail?.value) * 100, // 25
            currency: currency,
            description: description,
            payment_method: paymentMethod?.id,
            payment_method_types: [paymentMethod?.type],
            confirm: true,
            confirmation_method: 'manual', // For 3D Security
            return_url: `${urlOrigin}/transactions/success?token=${token}`,
        });
        if (!paymentIntents) {
            throw new HttpException(
                `Transaction not found please try again`,
                HttpStatus.NOT_FOUND
            );
        }

        const findOnePayment = await this.paymentsService.findOneBy({
            cardCvc,
            cardNumber,
            cardExpYear,
            cardExpMonth,
            status: 'ACTIVE',
            organizationId: organizationBuyerId,
        });
        if (!findOnePayment && isSaveCard) {
            await this.paymentsService.createOne({
                // email,
                // fullName,
                cardNumber,
                cardExpMonth,
                cardExpYear,
                cardCvc,
                type: 'CARD',
                action: 'PAYMENT',
                status: 'ACTIVE',
                brand: paymentMethod?.card?.display_brand,
                organizationId: organizationBuyerId,
            });
        }

        return { paymentIntents: '' };
    }

    /** Stripe billing */
    async paymentsTransactionStripe(options: {
        amount: AmountModel;
        reference: string;
        card: CardModel;
        membershipId: string;
        userAddress: any;
        urlOrigin: string;
        organizationBuyerId: string;
        organizationSellerId: string;
    }): Promise<any> {
        const {
            urlOrigin,
            amount,
            reference,
            card,
            membershipId,
            userAddress,
            organizationBuyerId,
            organizationSellerId,
        } = options;

        const {
            taxes,
            value: amountValueConvert,
            valueAfterExecuteTaxes,
        } = await this.transactionsUtil.convertedValue({
            taxes: amount?.taxes,
            value: amount?.value,
            currency: amount?.currency,
        });

        const { paymentIntents } = await this.stripeMethod({
            urlOrigin,
            card,
            currency: amount?.currency.toUpperCase(),
            amountDetail: amount,
            token: reference,
            organizationBuyerId,
            description: `Subscription ${amount?.month} month`,
        });

        if (!paymentIntents) {
            throw new HttpException(
                `Transaction not found please try again`,
                HttpStatus.NOT_FOUND
            );
        }

        if (paymentIntents) {
            const { transaction } =
                await this.subscribesUtil.createOrUpdateOneSubscribe({
                    userAddress,
                    organizationBuyerId,
                    organizationSellerId,
                    amount: {
                        taxes,
                        currency: paymentIntents?.currency.toUpperCase(),
                        value: amount?.value * 100,
                        month: amount?.month,
                    }, // Pas besoin de multiplier pas 100 stipe le fais deja
                    membershipId,
                    type: 'CARD',
                    token: reference,
                    model: 'MEMBERSHIP',
                    description: paymentIntents?.description,
                    amountValueConvert: amountValueConvert * 100,
                });

            if (transaction?.token) {
                await this.walletsService.incrementOne({
                    amount: transaction?.amountConvert,
                    organizationId: transaction?.organizationId,
                });
            }
        }

        return { paymentIntents };
    }

    /** Create OrderItem and generate pdf */
    async createOrderItemMethod(options: {
        amount: AmountModel;
        order: Order;
        transaction: Transaction;
        product: any;
        urlOrigin: string;
        userAddress: UserAddress;
    }): Promise<any> {
        const { amount, order, transaction, product, userAddress } = options;

        await this.orderItemsService.createOne({
            model: product?.model,
            status: 'ACCEPTED',
            quantity: 1,
            orderId: order?.id,
            productId: product?.id,
            currency: order?.currency,
            affiliationId: transaction.affiliationId,
            price: Number(amount?.oneValue) * 100,
            priceDiscount: Number(amount?.oneValue) * 100,
            organizationBuyerId: order?.organizationBuyerId,
            organizationSellerId: order?.organizationSellerId,
            uploadsImages: product.uploadsImages,
            uploadsFiles: product.uploadsFiles,
        });

        return 'ok';
    }
}
