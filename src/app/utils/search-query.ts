import {
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUUID,
    MaxLength,
    MinLength,
    NotEquals,
    ValidateIf,
} from 'class-validator';
export class SearchQueryDto {
    @IsString()
    @IsOptional()
    @NotEquals(null)
    @NotEquals('')
    @ValidateIf((object, value) => value !== undefined)
    search?: string;

    @IsOptional()
    @IsString()
    @IsUUID()
    organizationId: string;

    @IsOptional()
    @IsString()
    @IsUUID()
    userId: string;
}
export class PasswordBodyDto {
    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    @MinLength(8)
    password: string;
}

export type FilterQueryType =
    | 'AFFILIATION'
    | 'ORGANIZATION'
    | 'MESSAGE'
    | 'DONATION'
    | 'PRODUCT'
    | 'COMMISSION'
    | 'MEMBERSHIP'
    | 'CONTACT'
    | 'POST'
    | 'GALLERY'
    | 'PROFILE'
    | 'COMMENT';

export const filterQueryTypeArrays = [
    'AFFILIATION',
    'DONATION',
    'MESSAGE',
    'PRODUCT',
    'COMMISSION',
    'MEMBERSHIP',
    'CONTACT',
    'POST',
    'GALLERY',
    'PROFILE',
    'COMMENT',
];

export type WhoCanSeeType = 'PUBLIC' | 'MEMBERSHIP' | 'SUPPORTER';

export const whoCanSeeTypeArrays = [
    'PUBLIC',
    'MEMBERSHIP',
    'SUPPORTER',
] as WhoCanSeeType[];

export const visibilityArrays = ['VISIBLE', 'INVISIBLE'];
