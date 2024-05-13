import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
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
import { FollowsService } from './follows.service';

@Controller('follows')
export class FollowsController {
    constructor(private readonly followsService: FollowsService) {}

    /** Get all Follows */
    @Get(`/followers`)
    @UseGuards(UserAuthGuard)
    async findFollowers(
        @Res() res,
        @Req() req,
        @Query() paginationDto: PaginationDto,
        @Query() searchQuery: SearchQueryDto
    ) {
        const { user } = req;
        const { search } = searchQuery;

        const { take, page, sort } = paginationDto;
        const pagination: PaginationType = addPagination({ page, take, sort });

        const follows = await this.followsService.findAll({
            search,
            pagination,
            followerId: user?.id,
        });

        return reply({ res, results: follows });
    }

    /** Get all Follows */
    @Get(`/followings`)
    @UseGuards(UserAuthGuard)
    async findFollowings(
        @Res() res,
        @Req() req,
        @Query() PaginationDto: PaginationDto,
        @Query() searchQuery: SearchQueryDto
    ) {
        const { user } = req;
        const { search } = searchQuery;

        const { take, page, sort } = PaginationDto;
        const pagination: PaginationType = addPagination({ page, take, sort });

        const follows = await this.followsService.findAll({
            search,
            pagination,
            organizationId: user?.organizationId,
        });

        return reply({ res, results: follows });
    }

    /** Create Follow */
    @Post(`/create/:followerId`)
    @UseGuards(UserAuthGuard)
    async createOne(
        @Res() res,
        @Req() req,
        @Param('followerId', ParseUUIDPipe) followerId: string
    ) {
        const { user } = req;

        const findOneFollow = await this.followsService.findOneBy({
            followerId,
            organizationId: user?.organizationId,
        });

        if (!findOneFollow) {
            await this.followsService.createOne({
                organizationId: user?.organizationId,
                followerId,
            });
        }

        return reply({ res, results: 'User follow successfully' });
    }

    /** Delete Follow */
    @Post(`/delete/:followerId`)
    @UseGuards(UserAuthGuard)
    async deleteOne(
        @Res() res,
        @Req() req,
        @Param('followerId', ParseUUIDPipe) followerId: string
    ) {
        const { user } = req;

        const findOneFollow = await this.followsService.findOneBy({
            followerId,
            organizationId: user?.organizationId,
        });
        if (!findOneFollow)
            throw new HttpException(
                `This follow ${followerId} dons't exist please change`,
                HttpStatus.NOT_FOUND
            );

        await this.followsService.updateOne(
            { followId: findOneFollow?.id },
            { deletedAt: new Date() }
        );

        return reply({ res, results: 'User follow deleted successfully' });
    }
}
