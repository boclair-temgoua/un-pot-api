import { PaginationType } from '../../app/utils/pagination';
import { Follow } from '../../models/Follow';

export type GetFollowsSelections = {
    search?: string;
    followerId?: Follow['followerId'];
    organizationId?: Follow['organizationId'];
    pagination?: PaginationType;
};

export type GetOneFollowSelections = {
    followId?: Follow['id'];
    followerId?: Follow['followerId'];
    organizationId?: Follow['organizationId'];
};

export type UpdateFollowSelections = {
    followId: Follow['id'];
};

export type CreateFollowOptions = Partial<Follow>;

export type UpdateFollowOptions = Partial<Follow>;
