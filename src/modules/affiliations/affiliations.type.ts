import { PaginationType } from '../../app/utils/pagination';
import { Affiliation } from '../../models';

export type GetAffiliationsSelections = {
    search?: string;
    productId?: string;
    pagination?: PaginationType;
    userReceivedId?: Affiliation['userReceivedId'];
    organizationSellerId?: Affiliation['organizationSellerId'];
    organizationReceivedId?: Affiliation['organizationReceivedId'];
};

export type GetOneAffiliationsSelections = {
    code?: Affiliation['code'];
    affiliationId?: Affiliation['id'];
    productId?: Affiliation['productId'];
    userReceivedId?: Affiliation['userReceivedId'];
    organizationSellerId?: Affiliation['organizationSellerId'];
    organizationReceivedId?: Affiliation['organizationReceivedId'];
};

export type UpdateAffiliationsSelections = {
    affiliationId: Affiliation['id'];
};

export type CreateAffiliationsOptions = Partial<Affiliation>;

export type UpdateAffiliationsOptions = Partial<Affiliation>;
