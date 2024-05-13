import {
    IsIn,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator';

import {
    FilterQueryType,
    filterQueryTypeArrays,
} from '../../app/utils/search-query';
import {
    OrderItemStatus,
    orderItemStatusArrays,
} from '../order-items/order-items.type';
export type StatusOderProduct = 'ORDERED' | 'DELIVERING';

export class GetOrderItemDto {
    // @IsOptional()
    // @IsString()
    // @IsIn(filterQueryTypeArrays)
    // model: FilterQueryType;

    @IsNotEmpty()
    @IsString()
    modelIds: FilterQueryType[];

    @IsOptional()
    @IsString()
    @IsUUID()
    organizationBuyerId: string;

    @IsOptional()
    @IsString()
    @IsUUID()
    organizationSellerId: string;

    @IsOptional()
    @IsString()
    @IsUUID()
    orderId: string;
}

export class UpdateOrderItemDto {
    @IsOptional()
    @IsString()
    @IsIn(filterQueryTypeArrays)
    model: FilterQueryType;

    @IsOptional()
    @IsString()
    @IsIn(orderItemStatusArrays)
    status: OrderItemStatus;
}
