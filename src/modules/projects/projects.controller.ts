import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { reply } from '../../app/utils/reply';
import { CookieAuthGuard } from '../users/middleware';

import { RequestPaginationDto } from '../../app/utils/pagination/request-pagination.dto';
import {
  addPagination,
  PaginationType,
} from '../../app/utils/pagination/with-pagination';
import { SearchQueryDto } from '../../app/utils/search-query/search-query.dto';
import { CreateOrUpdateProjectsDto } from './projects.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  /** Get all Projects */
  @Get(`/`)
  async findAllProjects(
    @Res() res,
    @Query() requestPaginationDto: RequestPaginationDto,
    @Query() searchQuery: SearchQueryDto,
  ) {
    const { search } = searchQuery;

    const { take, page, sort } = requestPaginationDto;
    const pagination: PaginationType = addPagination({ page, take, sort });

    const projects = await this.projectsService.findAll({ search, pagination });

    return reply({ res, results: projects });
  }

  /** Get one Project */
  @Get(`/show/:projectId`)
  @UseGuards(CookieAuthGuard)
  async getOneByUUIDProject(
    @Res() res,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    const Project = await this.projectsService.findOneBy({ projectId });

    return reply({ res, results: Project });
  }

  /** Create Project */
  @Post(`/`)
  @UseGuards(CookieAuthGuard)
  async createOneProject(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateProjectsDto,
  ) {
    const { user } = req;
    const { title, description } = body;

    const project = await this.projectsService.createOne({
      title,
      userId: user?.id,
      userCreatedId: user?.id,
      description,
    });

    return reply({ res, results: project });
  }

  /** Update Project */
  @Put(`/:projectId`)
  @UseGuards(CookieAuthGuard)
  async updateOneProject(
    @Res() res,
    @Req() req,
    @Body() body: CreateOrUpdateProjectsDto,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    const { title, description } = body;

    const findOneProject = await this.projectsService.findOneBy({ projectId });
    if (!findOneProject)
      throw new HttpException(
        `This Project ${projectId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.projectsService.updateOne(
      { projectId: findOneProject?.id },
      { title, description },
    );

    return reply({ res, results: 'Project updated successfully' });
  }

  /** Delete Project */
  @Delete(`/:projectId`)
  @UseGuards(CookieAuthGuard)
  async deleteOneProject(
    @Res() res,
    @Req() req,
    @Param('projectId', ParseUUIDPipe) projectId: string,
  ) {
    const findOneProject = await this.projectsService.findOneBy({ projectId });
    if (!findOneProject)
      throw new HttpException(
        `This Project ${projectId} dons't exist please change`,
        HttpStatus.NOT_FOUND,
      );

    await this.projectsService.updateOne(
      { projectId: findOneProject?.id },
      { deletedAt: new Date() },
    );

    return reply({ res, results: 'Project deleted successfully' });
  }
}
