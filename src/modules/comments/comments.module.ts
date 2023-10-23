import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment, Post } from '../../models';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [TypeOrmModule.forFeature([Comment])],
  controllers: [CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
