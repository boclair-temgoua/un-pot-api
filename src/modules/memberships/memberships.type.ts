import { PaginationType } from '../../app/utils/pagination';
import { Membership } from '../../models/Membership';

export type GetMembershipsSelections = {
    search?: string;
    pagination?: PaginationType;
    enableVisibility?: Membership['enableVisibility'];
    organizationId?: Membership['organizationId'];
};

export type GetOneMembershipsSelections = {
    membershipId: Membership['id'];
    enableVisibility?: Membership['enableVisibility'];
    organizationId?: Membership['organizationId'];
};

export type UpdateMembershipsSelections = {
    membershipId: Membership['id'];
};

export type CreateMembershipsOptions = Partial<Membership>;

export type UpdateMembershipsOptions = Partial<Membership>;
