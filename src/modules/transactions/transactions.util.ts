import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { config } from '../../app/config';
import { CurrenciesService } from '../currencies/currencies.service';
import { AmountModel } from '../wallets/wallets.type';

@Injectable()
export class TransactionsUtil {
    constructor(private readonly currenciesService: CurrenciesService) {}

    async convertedValue(options: AmountModel): Promise<{
        currency: string;
        value: number;
        taxes: number;
        valueAfterExecuteTaxes: number;
    }> {
        const { currency, value, taxes } = options;

        const findOnCurrency = await this.currenciesService.findOneBy({
            code: currency,
        });
        const newValue = Number(value) / Number(findOnCurrency?.amount);

        if (!newValue) {
            throw new HttpException(
                `Value ${newValue} not convert please try again`,
                HttpStatus.NOT_FOUND
            );
        }

        const newTaxes = taxes ? Number(taxes) : Number(config.datasite.taxes);
        const valueAfterExecuteTaxes =
            Number(newValue) - Number(newValue * newTaxes) / 100;

        return {
            currency,
            taxes: newTaxes,
            value: Number(newValue.toFixed(2)),
            valueAfterExecuteTaxes: Number(valueAfterExecuteTaxes.toFixed(2)),
        };
    }
}
