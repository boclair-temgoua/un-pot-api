import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import {
  TransactionType,
  transactionTypeArrays,
} from '../transactions/transactions.type';
import { AmountModel, CardModel } from '../wallets/wallets.type';

export type StatusPayment = 'ACTIVE' | 'PENDING' | 'INVALID';

export const statusPaymentArray = ['ACTIVE', 'PENDING', 'INVALID'];

export type ActionPayment = 'PAYMENT' | 'WITHDRAWING';

export const actionPaymentArray = ['PAYMENT', 'WITHDRAWING'];

export class CreateOnePaymentDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(transactionTypeArrays)
  type: TransactionType;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  fullName: string;

  @IsOptional()
  @IsString()
  cardName: string;

  @IsOptional()
  @IsString()
  cardNumber: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(12)
  cardExpMonth: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Min(2020)
  cardExpYear: number;

  @IsOptional()
  @IsString()
  cardCvc: string;

  @IsOptional()
  @IsString()
  description: string;
}

export class CreateSubscribePaymentsDto {
  @IsOptional()
  @IsString()
  membershipId: string;

  @IsOptional()
  @IsString()
  cartOrderId: string;

  @IsOptional()
  @IsString()
  @IsUUID()
  userReceiveId: string;

  @IsOptional()
  @IsString()
  userSendId: string;

  @IsNotEmpty()
  @IsString()
  @IsUUID()
  organizationId: string;

  @IsOptional()
  @IsString()
  reference: string;

  @IsOptional()
  card: CardModel;

  @IsOptional()
  amount: AmountModel;
}

export class SendCodeVerifyPaymentsDto {
  @IsNotEmpty()
  @IsString()
  phone: string;
}

export class CodeVerifyPaymentsDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  code: string;
}
