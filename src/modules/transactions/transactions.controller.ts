import {
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { UserAuthGuard } from '../users/middleware';

import {
  PaginationDto,
  PaginationType,
  addPagination,
} from '../../app/utils/pagination';
import { SearchQueryDto } from '../../app/utils/search-query';
import { FilterTransactionsDto } from './transactions.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  /** Get all Transactions */
  @Get(`/`)
  @UseGuards(UserAuthGuard)
  async findAll(
    @Res() res,
    @Req() req,
    @Query() paginationDto: PaginationDto,
    @Query() searchQuery: SearchQueryDto,
    @Query() query: FilterTransactionsDto,
  ) {
    const { user } = req;
    const { model, userBuyerId, organizationId, days } = query;
    const { search } = searchQuery;

    const { take, page, sort } = paginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const transactions = await this.transactionsService.findAll({
      search,
      days: Number(days) > 0 ? Number(days) : null,
      model: model?.toLocaleUpperCase(),
      userBuyerId,
      pagination,
      organizationId: organizationId ?? user.organizationId,
    });

    return reply({ res, results: transactions });
  }

  /** Get Transaction statistic */
  @Get(`/statistics`)
  @UseGuards(UserAuthGuard)
  async findGroupOrganization(
    @Res() res,
    @Req() req,
    @Query() query: FilterTransactionsDto,
  ) {
    const { user } = req;
    const { days, organizationId } = query;

    const transactions = await this.transactionsService.findGroupOrganization({
      organizationId: organizationId ?? user.organizationId,
      days: Number(days) > 0 ? Number(days) : null,
    });

    return reply({ res, results: transactions });
  }

  /** Get one Transaction */
  @Get(`/show/:transactionId`)
  @UseGuards(UserAuthGuard)
  async getOneByUUID(
    @Res() res,
    @Param('transactionId', ParseUUIDPipe) transactionId: string,
  ) {
    const transaction = await this.transactionsService.findOneBy({
      transactionId,
    });

    return reply({ res, results: transaction });
  }
}
