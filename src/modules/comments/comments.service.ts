import { withPagination } from '../../app/utils/pagination/with-pagination';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as Slug from 'slug';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from '../../models/Comment';
import { Repository } from 'typeorm';
import {
  CreateCommentOptions,
  GetCommentsSelections,
  GetOneCommentSelections,
  UpdateCommentOptions,
  UpdateCommentSelections,
} from './comments.type';
import { useCatch } from '../../app/utils/use-catch';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private driver: Repository<Comment>,
  ) {}

  async findAll(selections: GetCommentsSelections): Promise<any> {
    const { search, pagination, postId, parentId, userId, likeUserId } =
      selections;

    let query = this.driver
      .createQueryBuilder('comment')
      .select('comment.id', 'id')
      .addSelect('comment.createdAt', 'createdAt')
      .addSelect('comment.description', 'description')
      .addSelect('comment.postId', 'postId')
      .addSelect('comment.userId', 'userId')
      .addSelect('comment.parentId', 'parentId')
      .addSelect(
        /*sql*/ `jsonb_build_object(
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
        /*sql*/ `(
        SELECT
            CAST(COUNT(DISTINCT lik) AS INT)
        FROM "like" "lik"
        WHERE ("lik"."likeableId" = "comment"."id"
         AND "lik"."type" IN ('COMMENT')
         AND "lik"."deletedAt" IS NULL)
         GROUP BY "lik"."likeableId", "lik"."type", "comment"."id"
        ) AS "totalLike"`,
      )
      .where('comment.deletedAt IS NULL');

    if (likeUserId) {
      query = query.addSelect(/*sql*/ `(
                SELECT
                    CAST(COUNT(DISTINCT lk) AS INT)
                FROM "like" "lk"
                WHERE ("lk"."type" IN ('COMMENT')
                 AND "lk"."deletedAt" IS NULL
                 AND "lk"."likeableId" = "comment"."id"
                 AND "lk"."userId" IN ('${likeUserId}'))
                 GROUP BY "lk"."likeableId", "comment"."id"
                ) AS "isLike"`);
    }

    if (postId) {
      query = query.andWhere('comment.postId = :postId', { postId });
    }

    if (parentId) {
      query = query
        .andWhere('comment.parentId IS NOT NULL')
        .andWhere('comment.parentId = :parentId', { parentId });
    } else {
      query = query.andWhere('comment.parentId IS NULL');
    }

    if (search) {
      query = query.andWhere('comment.title ::text ILIKE :search', {
        search: `%${search}%`,
      });
    }

    query = query
      .leftJoin('comment.post', 'post')
      .leftJoin('comment.user', 'user')
      .leftJoin('user.profile', 'profile');

    const [errorRowCount, rowCount] = await useCatch(query.getCount());
    if (errorRowCount) throw new NotFoundException(errorRowCount);

    const [error, comments] = await useCatch(
      query
        .orderBy('comment.createdAt', pagination?.sort)
        .limit(pagination.limit)
        .offset(pagination.offset)
        .getRawMany(),
    );
    if (error) throw new NotFoundException(error);

    return withPagination({
      pagination,
      rowCount,
      value: comments,
    });
  }

  async findOneBy(selections: GetOneCommentSelections): Promise<Comment> {
    const { commentId, userId } = selections;
    let query = this.driver
      .createQueryBuilder('comment')
      .where('comment.deletedAt IS NULL');

    if (commentId) {
      query = query.andWhere('comment.id = :id', {
        id: commentId,
      });
    }

    if (userId) {
      query = query.andWhere('comment.userId = :userId', { userId });
    }
    const [error, result] = await useCatch(query.getOne());
    if (error)
      throw new HttpException('comment not found', HttpStatus.NOT_FOUND);

    return result;
  }

  /** Create one Comment to the database. */
  async createOne(options: CreateCommentOptions): Promise<Comment> {
    const { description, postId, parentId, userId } = options;

    const comment = new Comment();
    comment.postId = postId;
    comment.userId = userId;
    comment.parentId = parentId;
    comment.description = description;

    const query = this.driver.save(comment);

    const [error, result] = await useCatch(query);
    if (error) throw new NotFoundException(error);

    return result;
  }

  /** Update one Comment to the database. */
  async updateOne(
    selections: UpdateCommentSelections,
    options: UpdateCommentOptions,
  ): Promise<Comment> {
    const { commentId } = selections;
    const { description, deletedAt } = options;

    let findQuery = this.driver.createQueryBuilder('comment');

    if (commentId) {
      findQuery = findQuery.where('comment.id = :id', {
        id: commentId,
      });
    }

    const [errorFind, findItem] = await useCatch(findQuery.getOne());
    if (errorFind) throw new NotFoundException(errorFind);

    findItem.description = description;
    findItem.deletedAt = deletedAt;

    const query = this.driver.save(findItem);

    const [errorUp, result] = await useCatch(query);
    if (errorUp) throw new NotFoundException(errorUp);

    return result;
  }
}
