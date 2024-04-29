import { config } from '../../config/index';

export type Env = 'local' | 'prod' | 'test';
export const cookieSettings = (env: Env) =>
    env in settingsMap
        ? settingsMap[(env as Env) ?? 'local']
        : settingsMap.local;

const settingsMap: {
    [Key in Env]: {
        httpOnly: boolean;
        secure: boolean;
        domain?: string;
        sameSite: 'none' | 'lax' | 'strict';
    };
} = {
    local: {
        httpOnly: false,
        secure: true,
        sameSite: 'none',
    },
    prod: {
        httpOnly: false,
        secure: true,
        domain: config.cookie_access.domain,
        sameSite: 'strict',
    },
    test: {
        httpOnly: false,
        secure: true,
        domain: config.cookie_access.domain,
        sameSite: 'strict',
    },
};
