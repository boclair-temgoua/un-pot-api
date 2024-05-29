import { CartOrder } from '../../models';

export type GetOneCartOrderSelections = {
    cartOrderId?: CartOrder['id'];
    organizationBuyerId?: CartOrder['organizationBuyerId'];
    organizationSellerId?: CartOrder['organizationSellerId'];
};

export type GetOneCartsSelections = {
    cartOrderId?: CartOrder['id'];
    organizationBuyerId?: CartOrder['organizationBuyerId'];
};

export type UpdateCartOrdersSelections = {
    cartOrderId: CartOrder['id'];
};

export type CreateCartOrderOptions = Partial<CartOrder>;

export type UpdateCartOrderOptions = Partial<CartOrder>;
