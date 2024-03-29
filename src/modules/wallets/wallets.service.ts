import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { formateNowDateYYMMDD, generateNumber } from '../../app/utils/commons';
import { useCatch } from '../../app/utils/use-catch';
import { Wallet } from '../../models/Wallet';
import {
  CreateWalletOptions,
  GetOneWalletSelections,
  UpdateWalletOptions,
  UpdateWalletSelections,
} from './wallets.type';

@Injectable()
export class WalletsService {
  constructor(
    @InjectRepository(Wallet)
    private driver: Repository<Wallet>,
  ) {}

  async findOneBy(selections: GetOneWalletSelections): Promise<Wallet> {
    const { walletId, organizationId } = selections;
    let query = this.driver.createQueryBuilder('wallet');

    if (walletId) {
      query = query.where('wallet.id = :id', { id: walletId });
    }

    if (organizationId) {
      query = query.where('wallet.organizationId = :organizationId', {
        organizationId,
      });
    }

    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Wallet to the database. */
  async createOne(options: CreateWalletOptions): Promise<Wallet> {
    const { organizationId, amount } = options;

    const wallet = new Wallet();
    wallet.accountId = `${formateNowDateYYMMDD(new Date())}${generateNumber(
      10,
    )}`;
    wallet.amount = amount;
    wallet.organizationId = organizationId;

    const query = this.driver.save(wallet);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Wallet to the database. */
  async updateOne(
    selections: UpdateWalletSelections,
    options: UpdateWalletOptions,
  ): Promise<Wallet> {
    const { walletId, organizationId } = selections;
    const { amount } = options;

    let findQuery = this.driver.createQueryBuilder('wallet');

    if (walletId) {
      findQuery = findQuery.where('wallet.id = :id', {
        id: walletId,
      });
    }

    if (organizationId) {
      findQuery = findQuery.where('wallet.organizationId = :organizationId', {
        organizationId,
      });
    }

    const [errorFind, wallet] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    wallet.amount = amount;

    const query = this.driver.save(wallet);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }

  /** IncrementOne one Wallet to the database. */
  async incrementOne(options: {
    organizationId: string;
    amount: number;
  }): Promise<Wallet> {
    const { organizationId, amount } = options;

    const findOneWallet = await this.findOneBy({
      organizationId,
    });
    if (!findOneWallet)
      throw new HttpException('Wallet not found', HttpStatus.NOT_FOUND);

    const wallet = await this.updateOne(
      { organizationId: findOneWallet?.organizationId },
      { amount: findOneWallet?.amount + amount },
    );

    return wallet;
  }
}
