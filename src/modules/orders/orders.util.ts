import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { FilterQueryType } from '../../app/utils/search-query';
import { UserAddress } from '../../models';
import { CartOrdersService } from '../cart-orders/cart-orders.service';
import { CartsService } from '../cats/cats.service';
import { MembershipsService } from '../memberships/memberships.service';
import { OrderItemsService } from '../order-items/order-items.service';
import { ProductsService } from '../products/products.service';
import { TransactionsService } from '../transactions/transactions.service';
import { TransactionType } from '../transactions/transactions.type';
import { AffiliationModel, AmountModel } from '../wallets/wallets.type';
import { OrdersService } from './orders.service';

@Injectable()
export class OrdersUtil {
    constructor(
        private readonly ordersService: OrdersService,
        private readonly cartsService: CartsService,
        private readonly membershipsService: MembershipsService,
        private readonly productsService: ProductsService,
        private readonly transactionsService: TransactionsService,
        private readonly cartOrdersService: CartOrdersService,
        private readonly orderItemsService: OrderItemsService
    ) {}

    /** Create shop */
    async orderShopCreate(options: {
        cartOrderId: string;
        organizationBuyerId: string;
        organizationSellerId: string;
        userAddress?: any;
    }): Promise<any> {
        const {
            userAddress,
            organizationBuyerId,
            organizationSellerId,
            cartOrderId,
        } = options;

        const findOneCartOrder = await this.cartOrdersService.findOneBy({
            cartOrderId,
            organizationBuyerId,
            organizationSellerId,
        });
        if (!findOneCartOrder) {
            throw new HttpException(
                `This order ${cartOrderId} dons't exist please change`,
                HttpStatus.NOT_FOUND
            );
        }

        const carts = await this.cartsService.findAll({
            status: 'ADDED',
            organizationSellerId,
            organizationBuyerId,
            cartOrderId: findOneCartOrder?.id,
        });
        if (!carts?.summary?.organizationBuyerId) {
            throw new HttpException(
                `Carts dons't exist please try again`,
                HttpStatus.NOT_FOUND
            );
        }

        const order = await this.ordersService.createOne({
            address: userAddress,
            organizationBuyerId: carts?.summary?.organizationBuyerId,
            currency: carts?.summary?.currency,
            totalPriceDiscount:
                Number(carts?.summary?.totalPriceDiscount) * 100,
            totalPriceNoDiscount:
                Number(carts?.summary?.totalPriceNoDiscount) * 100,
        });

        for (const cart of carts?.cartItems) {
            const findOneProduct = await this.productsService.findOneBy({
                productId: cart.productId,
            });
            if (!findOneProduct) {
                false;
            }

            const orderItemCreate = await this.orderItemsService.createOne({
                currency: order?.currency,
                quantity: Number(cart?.quantity),
                percentDiscount: cart?.product?.discount?.percent,
                price:
                    Number(cart?.product?.price) * Number(cart?.quantity) * 100,
                priceDiscount:
                    Number(cart?.product?.priceDiscount) *
                    Number(cart?.quantity) *
                    100,
                organizationBuyerId: organizationBuyerId,
                organizationSellerId: cart?.product?.organizationId,
                model: cart?.model,
                productId: cart?.productId,
                orderId: order?.id,
                uploadsFiles: [...findOneProduct?.uploadsFiles],
                uploadsImages: [...findOneProduct?.uploadsImages],
                status:
                    findOneProduct?.productType === 'DIGITAL'
                        ? 'DELIVERED'
                        : 'PENDING',
            });

            if (orderItemCreate) {
                await this.cartsService.updateOne(
                    { cartId: cart?.id },
                    {
                        status: 'COMPLETED',
                        deletedAt: new Date(),
                    }
                );
            }
        }

        return { order };
    }

    /** Create commission */
    async orderCommissionOrMembershipCreate(options: {
        model: FilterQueryType;
        amount: AmountModel;
        productId?: string;
        membershipId?: string;
        organizationBuyerId: string;
        organizationSellerId: string;
        userAddress?: any;
    }): Promise<any> {
        const {
            model,
            amount,
            productId,
            membershipId,
            userAddress,
            organizationBuyerId,
            organizationSellerId,
        } = options;

        const findOneMembership = await this.membershipsService.findOneBy({
            membershipId,
        });
        if (!findOneMembership) {
            false;
        }

        const findOneProduct = await this.productsService.findOneBy({
            productId,
        });
        if (!findOneProduct) {
            false;
        }

        const order = await this.ordersService.createOne({
            address: userAddress,
            currency: amount?.currency,
            organizationBuyerId,
            organizationSellerId,
            totalPriceDiscount: Number(amount?.value),
            totalPriceNoDiscount: Number(amount?.value),
        });
        const orderItem = await this.orderItemsService.createOne({
            currency: order?.currency,
            quantity: 1,
            price: Number(amount?.value),
            organizationBuyerId: organizationBuyerId,
            organizationSellerId: organizationSellerId,
            model: model,
            productId: productId,
            membershipId: membershipId,
            orderId: order?.id,
            status: 'DELIVERED',
            uploadsImages: membershipId
                ? [...findOneMembership?.uploadsImages]
                : [...findOneProduct?.uploadsImages],
        });

        return { order, orderItem };
    }

    /** Create event */
    async orderEventCreate(options: {
        model: FilterQueryType;
        amount: AmountModel;
        affiliation: AffiliationModel;
        productId?: string;
        reference: string;
        description: string;
        taxes: number;
        amountConvert: number;
        amountConvertAfterExecuteTaxes: number;
        organizationBuyerId: string;
        organizationSellerId: string;
        currency: string;
        userAddress?: UserAddress;
        type: TransactionType;
    }): Promise<any> {
        const {
            taxes,
            type,
            model,
            amount,
            reference,
            userAddress,
            description,
            currency,
            amountConvert,
            affiliation,
            organizationBuyerId,
            organizationSellerId,
            amountConvertAfterExecuteTaxes,
        } = options;

        const amountNonConvertAfterTaxes =
            Number(amount?.value) - Number(amount?.value * taxes) / 100;

        const order = await this.ordersService.createOne({
            country: amount?.country,
            organizationBuyerId,
            organizationSellerId,
            address: userAddress,
            currency: amount?.currency,
            totalPriceDiscount: Number(amount?.value) * 100,
            totalPriceNoDiscount: Number(amount?.value) * 100,
        });

        const transaction = await this.transactionsService.createOne({
            type,
            model: model,
            token: reference,
            orderId: order?.id,
            organizationBuyerId,
            organizationSellerId,
            description,
            affiliationId: affiliation?.id,
            fullName: `${userAddress?.firstName} ${userAddress?.lastName}`,
            amountConvert: amountConvert * 100,
            amount: amount?.value * 100,
            amountInTaxes: amountNonConvertAfterTaxes * 100,
            amountConvertInTaxes: amountConvertAfterExecuteTaxes * 100,
            taxes: taxes,
            currency,
        });

        return { order, transaction: '' };
    }
}
