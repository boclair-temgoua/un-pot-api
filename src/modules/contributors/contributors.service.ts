import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { withPagination } from '../../app/utils/pagination';
import { useCatch } from '../../app/utils/use-catch';
import { Contributor } from '../../models/Contributor';
import {
  CreateContributorOptions,
  DeleteContributorSelections,
  GetContributorsSelections,
  GetOneContributorSelections,
  UpdateContributorOptions,
  UpdateContributorSelections,
} from './contributors.type';

@Injectable()
export class ContributorsService {
  constructor(
    @InjectRepository(Contributor)
    private driver: Repository<Contributor>,
  ) {}

  async findAll(
    selections: GetContributorsSelections,
  ): Promise<GetContributorsSelections | any> {
    const { userId, search, organizationId, pagination } = selections;

    let query = this.driver
      .createQueryBuilder('contributor')
      .select('contributor.id', 'id')
      .addSelect('contributor.userCreatedId', 'userCreatedId')
      .addSelect('contributor.confirmedAt', 'confirmedAt')
      .addSelect('contributor.userId', 'userId')
      .addSelect('contributor.type', 'type')
      .addSelect('contributor.status', 'status')
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'username', "user"."username",
          'fullName', "profile"."fullName",
          'firstName', "profile"."firstName",
          'lastName', "profile"."lastName",
          'image', "profile"."image",
          'color', "profile"."color",
          'userId', "user"."id",
          'email', "user"."email"
          ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'name', "organization"."name",
          'firstAddress', "organization"."firstAddress",
          'image', "organization"."image",
          'color', "organization"."color"
          ) AS "organization"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'name', "contributor"."role"
      ) AS "role"`,
      )
      .addSelect('contributor.createdAt', 'createdAt')
      .where('contributor.deletedAt IS NULL')
      .leftJoin('contributor.user', 'user')
      .leftJoin('user.profile', 'profile')
      .leftJoin('contributor.organization', 'organization');

    if (userId) {
      query = query.andWhere('contributor.userId = :userId', { userId });
    }

    if (organizationId) {
      query = query.andWhere('contributor.organizationId = :organizationId', {
        organizationId,
      });
    }

    if (search) {
      query = query.andWhere(
        new Brackets((qb) => {
          qb.where(
            '(profile.fullName ::text ILIKE :search OR profile.phone ::text ILIKE :search)',
            {
              search: `%${search}%`,
            },
          )
            .orWhere(
              '(user.email ::text ILIKE :search OR user.username ::text ILIKE :search)',
              {
                search: `%${search}%`,
              },
            )
            .orWhere(
              '(organization.name ::text ILIKE :search OR organization.firstAddress ::text ILIKE :search)',
              {
                search: `%${search}%`,
              },
            );
        }),
      );
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, users] = await useCatch(
      query
        .orderBy('contributor.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: users,
    });
  }

  async findOneBy(selections: GetOneContributorSelections): Promise<any> {
    const { type, userId, contributorId, organizationId } = selections;

    let query = this.driver
      .createQueryBuilder('contributor')
      .select('contributor.id', 'id')
      .addSelect('contributor.userCreatedId', 'userCreatedId')
      .addSelect('contributor.userId', 'userId')
      .addSelect('contributor.type', 'type')
      .addSelect('contributor.status', 'status')
      .addSelect('contributor.organizationId', 'organizationId')
      .addSelect('contributor.confirmedAt', 'confirmedAt')
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'fullName', "profile"."fullName",
              'image', "profile"."image",
              'color', "profile"."color",
              'userId', "user"."id",
              'email', "user"."email"
          ) AS "profile"`,
      )
      .addSelect(
        /*sql*/ `jsonb_build_object(
          'name', "contributor"."role"
      ) AS "role"`,
      )
      .where('contributor.deletedAt IS NULL')
      .leftJoin('contributor.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (type) {
      query = query.andWhere('contributor.type = :type', { type });
    }

    if (userId) {
      query = query.andWhere('contributor.userId = :userId', { userId });
    }

    if (contributorId) {
      query = query.andWhere('contributor.id = :id', { id: contributorId });
    }

    if (organizationId) {
      query = query.andWhere('contributor.organizationId = :organizationId', {
        organizationId,
      });
    }

    const contributor = await query.getRawOne();

    return contributor;
  }

  /** Create one Contributor to the database. */
  async createOne(options: CreateContributorOptions): Promise<Contributor> {
    const {
      userId,
      confirmedAt,
      status,
      role,
      userCreatedId,
      organizationId,
      type,
    } = options;

    const contributor = new Contributor();
    contributor.userId = userId;
    contributor.type = type;
    contributor.role = role;
    contributor.status = status;
    contributor.confirmedAt = confirmedAt;
    contributor.organizationId = organizationId;
    contributor.userCreatedId = userCreatedId;

    const query = this.driver.save(contributor);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Contributor to the database. */
  async updateOne(
    selections: UpdateContributorSelections,
    options: UpdateContributorOptions,
  ): Promise<Contributor> {
    const { role, confirmedAt, deletedAt } = options;
    const { contributorId } = selections;

    let findQuery = this.driver.createQueryBuilder('contributor');

    if (contributorId) {
      findQuery = findQuery.where('contributor.id = :id', {
        id: contributorId,
      });
    }

    const [errorFind, contributor] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    contributor.role = role;
    contributor.confirmedAt = confirmedAt;
    contributor.deletedAt = deletedAt;

    const query = this.driver.save(contributor);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }

  /** Update one Contributor to the database. */
  async deleteOne(selections: DeleteContributorSelections): Promise<any> {
    const { contributorId } = selections;

    let query = this.driver
      .createQueryBuilder('contributor')
      .delete()
      .from(Contributor);

    if (contributorId) {
      query = query.where('id = :id', { id: contributorId });
    }

    const [errorUp, result] = await useCatch(query.execute());
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }

  async getAuthorizationToContributor({
    userId,
    organizationId,
  }: {
    userId: string;
    organizationId: string;
  }): Promise<any> {
    if (userId) {
      const contributor = await this.findOneBy({
        userId,
        organizationId,
        type: 'ORGANIZATION',
      });
      return { contributor };
    }

    return null;
  }

  /** Permission. project */
  async canCheckPermissionContributor(options: {
    userId: string;
  }): Promise<any> {
    const { userId } = options;

    const findOneContributor = await this.findOneBy({
      userId: userId,
      type: 'ORGANIZATION',
    });

    if (!findOneContributor)
      throw new HttpException(
        `This contributor dons't exists please change`,
        HttpStatus.NOT_FOUND,
      );
    /** This condition check if user is ADMIN */
    if (!['ADMIN', 'MODERATOR'].includes(findOneContributor?.role?.name))
      throw new UnauthorizedException('Not authorized! Change permission');

    return findOneContributor;
  }
}
