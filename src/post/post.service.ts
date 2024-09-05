import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from 'src/common/prisma.service';
import { ValidationService } from 'src/common/validation.service';
import {
  PostResponse,
  StorePostRequest,
  UpdatePostRequest,
} from 'src/model/post.model';
import { Logger } from 'winston';
import { PostValidation } from './post.validation';
import { User } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(
    private prismaService: PrismaService,
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async getAll() {
    this.logger.debug(`Post.GetAll`);
    return await this.prismaService.post.findMany();
  }

  async getBySlug(slug: string) {
    this.logger.debug(`Post.GetBySlug: ${slug}`);
    const post = await this.prismaService.post.findFirst({
      where: { slug },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    return post;
  }

  async store(user: User, request: StorePostRequest): Promise<PostResponse> {
    this.logger.debug(`Post.Store: ${JSON.stringify(request)}`);
    const storeRequest = this.validationService.validate(
      PostValidation.STORE,
      request,
    );

    if (!storeRequest.slug) {
      storeRequest.slug = storeRequest.title.toLowerCase().replace(/ /g, '-');
    }

    storeRequest.authorUsername = user.username;
    storeRequest.publishedAt = new Date();

    const result = await this.prismaService.post.create({
      data: storeRequest,
    });

    return {
      id: result.id,
      title: result.title,
      content: result.content,
      slug: result.slug,
      publishedAt: result.publishedAt,
    };
  }

  async update(
    slug: string,
    request: UpdatePostRequest,
  ): Promise<PostResponse> {
    this.logger.debug(`Post.Update: ${slug}, ${JSON.stringify(request)}`);
    const updateRequest = this.validationService.validate(
      PostValidation.UPDATE,
      request,
    );

    const post = await this.prismaService.post.findFirst({
      where: { slug },
    });

    if (!post) {
      throw new HttpException('Post not found', 404);
    }

    updateRequest.slug = updateRequest.title.toLowerCase().replace(/ /g, '-');

    const result = await this.prismaService.post.update({
      where: { id: post.id },
      data: updateRequest,
    });

    return {
      id: result.id,
      title: result.title,
      content: result.content,
      slug: result.slug,
      publishedAt: result.publishedAt,
    };
  }

  async delete(slug: string) {
    this.logger.debug(`Post.Delete: ${slug}`);
    const post = await this.prismaService.post.findFirst({
      where: { slug },
    });

    if (!post) {
      throw new Error('Post not found');
    }

    await this.prismaService.post.delete({
      where: { id: post.id },
    });
  }
}
