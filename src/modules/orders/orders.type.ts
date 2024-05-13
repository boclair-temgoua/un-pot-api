import { PaginationType } from '../../app/utils/pagination';
import { Order } from '../../models';

export type GetOrdersSelections = {
    search?: string;
    pagination?: PaginationType;
    orderNumber?: Order['orderNumber'];
    organizationBuyerId?: Order['organizationBuyerId'];
    organizationSellerId?: Order['organizationSellerId'];
};

export type GetOneOrderSelections = {
    orderId: Order['id'];
    orderNumber?: Order['orderNumber'];
    organizationBuyerId?: Order['organizationBuyerId'];
    organizationSellerId?: Order['organizationSellerId'];
};

export type UpdateOrderSelections = {
    orderId: Order['id'];
};

export type CreateOrderOptions = Partial<Order>;

export type UpdateOrderOptions = Partial<Order>;
