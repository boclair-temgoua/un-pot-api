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
  | 'ORGANIZATION'
  | 'DONATION'
  | 'PRODUCT'
  | 'COMMISSION'
  | 'MEMBERSHIP'
  | 'HELP'
  | 'POST'
  | 'GALLERY'
  | 'PROFILE'
  | 'PROFILE'
  | 'COMMENT';

export const filterQueryTypeArrays = [
  'DONATION',
  'MEMBERSHIP',
  'COMMISSION',
  'PRODUCT',
  'HELP',
  'POST',
  'PROFILE',
  'GALLERY',
  'COMMENT',
];

export type WhoCanSeeType = 'PUBLIC' | 'MEMBERSHIP' | 'SUPPORTER';

export const whoCanSeeTypeArrays = [
  'PUBLIC',
  'MEMBERSHIP',
  'SUPPORTER',
] as WhoCanSeeType[];

export const visibilityArrays = ['VISIBLE', 'INVISIBLE'];
