import { PaginationType } from '../../app/utils/pagination';
import { Subscribe } from '../../models/Subscribe';

export type GetSubscribesSelections = {
    search?: string;
    subscriberId?: Subscribe['subscriberId'];
    organizationId?: Subscribe['organizationId'];
    pagination?: PaginationType;
};

export type GetOneSubscribeSelections = {
    subscribeId?: Subscribe['id'];
    subscriberId?: Subscribe['subscriberId'];
    organizationId?: Subscribe['organizationId'];
};

export type UpdateSubscribeSelections = {
    subscribeId: Subscribe['id'];
};

export type CreateSubscribeOptions = Partial<Subscribe>;

export type UpdateSubscribeOptions = Partial<Subscribe>;
