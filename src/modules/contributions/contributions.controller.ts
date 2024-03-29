import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  PaginationDto,
  PaginationType,
  addPagination,
} from '../../app/utils/pagination';
import { reply } from '../../app/utils/reply';
import { SearchQueryDto } from '../../app/utils/search-query';
import { UserAuthGuard } from '../users/middleware';
import {
  CreateOneContributionDonationDto,
  SearchContributionDto,
} from './contributions.dto';
import { ContributionsService } from './contributions.service';

@Controller('contributions')
export class ContributionsController {
  constructor(private readonly contributionsService: ContributionsService) {}

  @Get(`/`)
  @UseGuards(UserAuthGuard)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() paginationDto: PaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: SearchContributionDto,
  ) {
    const { user } = req;
    const { userId } = query;
    const { search } = searchQuery;

    const { take, page, sort } = paginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contributions = await this.contributionsService.findAll({
      search,
      pagination,
      userId,
      organizationId: user?.organizationId,
    });

    return reply({ res, results: contributions });
  }

  /** Create donation */
  @Post(`/donation`)
  async createOneByDonation(
    @Res() res,
    @Req() req,
    @Body() body: CreateOneContributionDonationDto,
  ) {
    const {
      amount,
      currency,
      userBuyerId,
      meanOfPayment,
      infoPaymentMethod,
      organizationId,
    } = body;

    // const findOneUser = await this.usersService.findOneBy({
    //   organizationId,
    // });
    // if (!findOneUser)
    //   throw new HttpException(
    //     `User ${organizationId} don't exists please change`,
    //     HttpStatus.NOT_FOUND,
    //   );

    // const findOneCurrency = await this.currenciesService.findOneBy({
    //   code: currency,
    // });
    // const { amountConvert } = validationAmount({
    //   amount: amount,
    //   currency: findOneCurrency,
    // });

    // /** Create payment stripe */
    // meanOfPayment === 'CARD' && infoPaymentMethod?.id
    //   ? await this.bullingService.stripeMethod({
    //       amount: amountConvert * 100,
    //       currency: 'EUR',
    //       fullName: 'Inconnu',
    //       email: 'email@inconnu.com',
    //       description: `Donation ${amount} ${currency}`,
    //       infoPaymentMethod: infoPaymentMethod,
    //     })
    //   : null;

    // /** Create contribution */
    // const contribution = await this.contributionsService.createOne({
    //   amount: amount * 100,
    //   userId: findOneUser?.id,
    //   amountConvert: amountConvert * 100,
    //   currencyId: findOneCurrency?.id,
    //   type: 'DONATION',
    // });

    // /** Create transaction */
    // await this.transactionsService.createOne({
    //   contributionId: contribution?.id,
    //   description: `Donation ${amount} ${currency}`,
    //   amount: contribution?.amount,
    //   organizationId: organizationId,
    //   userBuyerId: userBuyerId ?? null,
    //   type: meanOfPayment,
    // });

    // /** Update wallet */
    // await this.walletsService.incrementOne({
    //   organizationId: organizationId,
    //   amount: contribution?.amountConvert,
    // });

    return reply({ res, results: 'contribution save successfully' });
  }
}
