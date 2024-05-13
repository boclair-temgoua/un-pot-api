import { PaginationType } from '../../app/utils/pagination';
import { UserAddress } from '../../models';

export type GetUserAddressSelections = {
    search?: string;
    organizationId?: UserAddress['organizationId'];
    pagination?: PaginationType;
};

export type GetOneUserAddressSelections = {
    userAddressId?: UserAddress['id'];
    organizationId?: UserAddress['organizationId'];
};

export type UpdateUserAddressSelections = {
    userAddressId: UserAddress['id'];
};

export type CreateUserAddressOptions = Partial<UserAddress>;

export type UpdateUserAddressOptions = Partial<UserAddress>;
