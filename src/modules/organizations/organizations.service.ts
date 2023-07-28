import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from '../../models/Organization';
import { getRandomElement } from '../../app/utils/array/get-random-element';
import { Repository } from 'typeorm';
import {
  CreateOrganizationOptions,
  GetOneOrganizationSelections,
  UpdateOrganizationOptions,
  UpdateOrganizationSelections,
} from './organizations.type';
import { useCatch } from '../../app/utils/use-catch';
import { colorsArrays } from '../../app/utils/commons';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private driver: Repository<Organization>,
  ) {}

  async findOneBy(
    selections: GetOneOrganizationSelections,
  ): Promise<Organization> {
    const { organizationId } = selections;
    let query = this.driver
      .createQueryBuilder('organization')
      .select('organization.name', 'name')
      .addSelect('organization.id', 'id')
      .addSelect('organization.color', 'color')
      .addSelect('organization.email', 'email')
      .addSelect('organization.phone', 'phone')
      .addSelect('organization.firstAddress', 'firstAddress')
      .addSelect('organization.secondAddress', 'secondAddress')
      .addSelect('organization.image', 'image')
      .addSelect('organization.userId', 'userId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
              'userId', "user"."id",
              'email', "user"."email",
              'profileId', "user"."profileId",
              'fullName', "profile"."fullName",
              'color', "profile"."color",
              'image', "profile"."image"
          ) AS "profileOwner"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT prod) AS INT)
      FROM "product" "prod"
      WHERE ("prod"."organizationId" = "organization"."id"
      AND "prod"."deletedAt" IS NULL)
      GROUP BY "prod"."organizationId", "organization"."id"
      ) AS "productTotal"`,
      )
      .addSelect(
        /*sql*/ `(
      SELECT
          CAST(COUNT(DISTINCT con) AS INT)
      FROM "contributor" "con"
      WHERE ("con"."organizationId" = "organization"."id"
      AND "con"."deletedAt" IS NULL
      AND "con"."type" IN ('ORGANIZATION'))
      GROUP BY "con"."organizationId", "con"."type", "organization"."id"
      ) AS "contributorTotal"`,
      )
      .where('organization.deletedAt IS NULL')
      .leftJoin('organization.user', 'user')
      .leftJoin('user.profile', 'profile');

    if (organizationId) {
      query = query.andWhere('organization.id = :id', { id: organizationId });
    }

    const [error, result] = await useCatch(query.getRawOne());
    if (error)
      throw new HttpException('organization not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Organization to the database. */
  async createOne(options: CreateOrganizationOptions): Promise<Organization> {
    const { userId, name, phone, firstAddress, secondAddress, email } = options;

    const organization = new Organization();
    organization.userId = userId;
    organization.phone = phone;
    organization.email = email;
    organization.firstAddress = firstAddress;
    organization.secondAddress = secondAddress;
    organization.name = name;
    organization.color = getRandomElement(colorsArrays);

    const query = this.driver.save(organization);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Organization to the database. */
  async updateOne(
    selections: UpdateOrganizationSelections,
    options: UpdateOrganizationOptions,
  ): Promise<Organization> {
    const { organizationId } = selections;
    const {
      userId,
      name,
      requiresPayment,
      image,
      phone,
      firstAddress,
      secondAddress,
      email,
      deletedAt,
    } = options;

    let findQuery = this.driver.createQueryBuilder('organization');

    if (organizationId) {
      findQuery = findQuery.where('organization.id = :id', {
        id: organizationId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.userId = userId;
    findItem.name = name;
    findItem.image = image;
    findItem.phone = phone;
    findItem.email = email;
    findItem.firstAddress = firstAddress;
    findItem.secondAddress = secondAddress;
    findItem.requiresPayment = requiresPayment;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);
    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
