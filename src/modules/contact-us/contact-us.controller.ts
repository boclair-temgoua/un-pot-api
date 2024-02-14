import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';

import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { CookieAuthGuard } from '../users/middleware';
import { CreateOrUpdateContactUsDto } from './contact-us.dto';
import { ContactUsService } from './contact-us.service';

@Controller('contact-us')
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) {}

  /** Get all ContactUs */
  @Get(`/`)
  async findAll(
    @Res() res,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const contactUs = await this.contactUsService.findAll({
      search,
      pagination,
    });

    return reply({ res, results: contactUs });
  }

  /** Post one ContactUs */
  @Post(`/`)
  async createOne(
    @Res() res,
    @Req() req,
    @Body() createOrUpdateContactUsDto: CreateOrUpdateContactUsDto,
  ) {
    const { subject, fullName, phone, email, description } =
      createOrUpdateContactUsDto;

    const contactUs = await this.contactUsService.createOne({
      subject,
      fullName,
      phone,
      email,
      description,
    });

    return reply({ res, results: contactUs });
  }

  /** Get one ContactUs */
  @Get(`/show/:contactUsId`)
  @UseGuards(CookieAuthGuard)
  async getOneByIdUser(
    @Res() res,
    @Param('contactUsId', ParseUUIDPipe) contactUsId: string,
  ) {
    const user = await this.contactUsService.findOneBy({ contactUsId });

    return reply({ res, results: user });
  }

  /** Delete one ContactUs */
  @Delete(`/delete/:contactUsId`)
  @UseGuards(CookieAuthGuard)
  async deleteOne(
    @Res() res,
    @Param('contactUsId', ParseUUIDPipe) contactUsId: string,
  ) {
    const contactUs = await this.contactUsService.updateOne(
      { contactUsId },
      { deletedAt: new Date() },
    );

    return reply({ res, results: contactUs });
  }
}
