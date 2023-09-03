import {
  withPagination,
  WithPaginationResponse,
} from './../../app/utils/pagination/with-pagination';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as Slug from 'slug';
import { InjectRepository } from '@nestjs/typeorm';
import { Faq } from '../../models/Faq';
import { Repository } from 'typeorm';
import {
  CreateFaqOptions,
  GetFaqsSelections,
  GetOneFaqSelections,
  UpdateFaqOptions,
  UpdateFaqSelections,
} from './faqs.type';
import { useCatch } from '../../app/utils/use-catch';
import { generateNumber } from '../../app/utils/commons/generate-random';

@Injectable()
export class FaqsService {
  constructor(
    @InjectRepository(Faq)
    private driver: Repository<Faq>,
  ) {}

  async findAll(
    selections: GetFaqsSelections,
  ): Promise<WithPaginationResponse | null> {
    const { search, pagination, option1 } = selections;

    let query = this.driver
      .createQueryBuilder('faq')
      .select('faq.title', 'title')
      .addSelect('faq.status', 'status')
      .addSelect('faq.id', 'id')
      .addSelect('faq.type', 'type')
      .addSelect('faq.slug', 'slug')
      .addSelect('faq.description', 'description')
      .where('faq.status IS TRUE')
      .andWhere('faq.deletedAt IS NULL');

    if (option1) {
      const { userId } = option1;
      query = query.andWhere('faq.userId = :userId', { userId });
    }

    if (search) {
      query = query.andWhere('faq.title ::text ILIKE :search', {
        search: `%${search}%`,
      });
    }

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, faqs] = await useCatch(
      query
        .orderBy('faq.createdAt', pagination?.sort)
        .take(pagination.take)
        .skip(pagination.skip)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: faqs,
    });
  }

  async findOneBy(selections: GetOneFaqSelections): Promise<Faq> {
    const { faqId } = selections;
    let query = this.driver
      .createQueryBuilder('faq')
      .select('faq.title', 'title')
      .addSelect('faq.id', 'id')
      .addSelect('faq.status', 'status')
      .addSelect('faq.type', 'type')
      .addSelect('faq.slug', 'slug')
      .addSelect('faq.description', 'description')
      .where('faq.deletedAt IS NULL');

    if (faqId) {
      query = query.andWhere('faq.id = :id', {
        id: faqId,
      });
    }
    const [error, result] = await useCatch(query.getRawOne());
    if (error) throw new HttpException('Faq not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Faq to the database. */
  async createOne(options: CreateFaqOptions): Promise<Faq> {
    const { userId, userCreatedId, title, description, type } = options;

    const faq = new Faq();
    faq.userId = userId;
    faq.title = title;
    faq.slug = `${Slug(title)}-${generateNumber(4)}`;
    faq.type = type;
    faq.userCreatedId = userCreatedId;
    faq.description = description;

    const query = this.driver.save(faq);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Faq to the database. */
  async updateOne(
    selections: UpdateFaqSelections,
    options: UpdateFaqOptions,
  ): Promise<Faq> {
    const { faqId } = selections;
    const { title, description, type, status, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('faq');

    if (faqId) {
      findQuery = findQuery.where('faq.id = :id', { id: faqId });
    }

    const [errorFind, faq] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    faq.title = title;
    faq.description = description;
    faq.status = status;
    faq.type = type;
    faq.deletedAt = deletedAt;

    const query = this.driver.save(faq);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
