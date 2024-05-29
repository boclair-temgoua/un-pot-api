import { Type } from 'class-transformer';
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

export type StatusProduct = 'ACTIVE' | 'PENDING';

export type ProductType = 'DIGITAL' | 'PHYSICAL';

export const productTypeArrays = ['DIGITAL', 'PHYSICAL'];

export type ProductTab = 'AUDIO' | 'MEDIA' | 'OTHER';

export const productTabArrays = ['AUDIO', 'MEDIA', 'OTHER'];

export class CreateOrUpdateProductsDto {
    @IsNotEmpty()
    @IsString()
    @IsIn(filterQueryTypeArrays)
    model?: FilterQueryType;

    @IsNotEmpty()
    @IsString()
    @IsIn(productTypeArrays)
    productType: ProductType;

    @IsNotEmpty()
    @IsString()
    @IsIn(productTabArrays)
    tab: ProductTab;

    @IsNotEmpty()
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    discountId: string;

    @IsOptional()
    @IsString()
    price: string;

    @IsOptional()
    @IsString()
    urlRedirect: string;

    @IsOptional()
    @IsString()
    enableVisibility: string;

    @IsOptional()
    @IsString()
    enableUrlRedirect: string;

    @IsOptional()
    @IsString()
    limitSlot: string;

    @IsOptional()
    @IsString()
    enableLimitSlot: string;

    @IsOptional()
    @IsString()
    enableDiscount: string;

    @IsOptional()
    @IsString()
    urlMedia: string;

    @IsOptional()
    @IsString()
    enableChooseQuantity: string;

    @IsOptional()
    @IsString()
    messageAfterPayment: string;

    @IsOptional()
    @IsString()
    description: string;
}

export class GetOneProductDto {
    @IsOptional()
    @IsString()
    @IsIn(['TRUE', 'FALSE'])
    @Type(() => String)
    enableVisibility: string;

    @IsOptional()
    @IsString()
    @IsUUID()
    productId: string;

    @IsOptional()
    @IsString()
    @IsUUID()
    organizationId: string;

    @IsOptional()
    @IsString()
    @IsUUID()
    buyerId: string;

    @IsOptional()
    @IsString()
    productSlug: string;
}

export class GetProductsDto {
    @IsNotEmpty()
    @IsString()
    modelIds: FilterQueryType[];

    @IsOptional()
    @IsString()
    @IsUUID()
    organizationBuyerId: string;

    @IsOptional()
    @IsString()
    @IsIn(['TRUE', 'FALSE'])
    @Type(() => String)
    enableVisibility: string;

    @IsOptional()
    @IsString()
    @IsUUID()
    organizationId: string;

    @IsOptional()
    @IsString()
    typeIds: string;

    @IsOptional()
    @IsString()
    status: string;
}
