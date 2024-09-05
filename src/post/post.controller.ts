import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PostService } from './post.service';
import { PostResponse, StorePostRequest } from 'src/model/post.model';
import { WebResponse } from 'src/model/web.model';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';

@Controller('api/posts')
export class PostController {
  constructor(private postService: PostService) {}

  @Get()
  @HttpCode(200)
  async getAll(): Promise<WebResponse<PostResponse[]>> {
    const result = await this.postService.getAll();
    return {
      data: result,
    };
  }

  @Get('/:slug')
  @HttpCode(200)
  async getBySlug(slug: string): Promise<WebResponse<PostResponse>> {
    const result = await this.postService.getBySlug(slug);
    return {
      data: result,
    };
  }

  @Post('/')
  @HttpCode(201)
  async store(
    @Auth() user: User,
    @Body() request: StorePostRequest,
  ): Promise<WebResponse<PostResponse>> {
    const result = await this.postService.store(user, request);
    return {
      data: result,
    };
  }

  @Patch('/:slug')
  @HttpCode(200)
  async update(
    @Auth() user: User,
    @Body() request: StorePostRequest,
    @Param('slug') slug: string,
  ): Promise<WebResponse<PostResponse>> {
    const result = await this.postService.update(slug, request);
    return {
      data: result,
    };
  }

  @Delete('/:slug')
  @HttpCode(204)
  async delete(@Auth() user: User, @Param('slug') slug: string) {
    await this.postService.delete(slug);
    return {
      data: true,
    };
  }
}
