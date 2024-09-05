import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CategoryResponse,
  StoreCategoryRequest,
  UpdateCategoryRequest,
} from '../model/category.model';
import { WebResponse } from '../model/web.model';
import { Auth } from 'src/common/auth.decorator';
import { User } from '@prisma/client';

@Controller('/api/categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get()
  async getAll(): Promise<WebResponse<CategoryResponse[]>> {
    const result = await this.categoryService.getAll();
    return {
      data: result,
    };
  }

  @Get('/:slug')
  async getBySlug(slug: string): Promise<WebResponse<CategoryResponse>> {
    const result = await this.categoryService.getBySlug(slug);
    return {
      data: result,
    };
  }

  @Post('/')
  async store(
    @Auth() user: User,
    @Body() request: StoreCategoryRequest,
  ): Promise<WebResponse<CategoryResponse>> {
    const result = await this.categoryService.store(request);
    return {
      data: result,
    };
  }

  @Patch('/:slug')
  async update(
    @Auth() user: User,
    @Param('slug') slug: string,
    @Body() request: UpdateCategoryRequest,
  ): Promise<WebResponse<CategoryResponse>> {
    const result = await this.categoryService.update(slug, request);
    return {
      data: result,
    };
  }

  @Delete('/:slug')
  async delete(
    @Auth() user: User,
    @Param('slug') slug: string,
  ): Promise<WebResponse<boolean>> {
    await this.categoryService.delete(slug);
    return {
      data: true,
    };
  }
}
