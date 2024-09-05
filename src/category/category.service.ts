import { HttpException, Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { ValidationService } from '../common/validation.service';
import {
  CategoryResponse,
  StoreCategoryRequest,
  UpdateCategoryRequest,
} from '../model/category.model';
import { Logger } from 'winston';
import { CategoryValidation } from './category.validation';

@Injectable()
export class CategoryService {
  constructor(
    private validationService: ValidationService,
    private prismaService: PrismaService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async getAll(): Promise<CategoryResponse[]> {
    this.logger.debug('Category.GetAll');

    const categories = await this.prismaService.postCategories.findMany();

    return categories.map((category) => {
      return {
        name: category.name,
        slug: category.slug,
      };
    });
  }

  async getBySlug(slug: string): Promise<CategoryResponse> {
    this.logger.debug(`Category.GetBySlug: ${slug}`);

    const category = await this.prismaService.postCategories.findFirst({
      where: {
        slug,
      },
    });

    if (!category) {
      throw new HttpException('Category not found', 404);
    }

    return {
      name: category.name,
      slug: category.slug,
    };
  }

  async store(request: StoreCategoryRequest): Promise<CategoryResponse> {
    this.logger.debug(`Category.Store: ${JSON.stringify(request)}`);

    const storeRequest: StoreCategoryRequest = this.validationService.validate(
      CategoryValidation.STORE,
      request,
    );

    const totalCategoryWithSameName =
      await this.prismaService.postCategories.count({
        where: {
          name: storeRequest.name,
        },
      });

    if (totalCategoryWithSameName > 0) {
      throw new HttpException('Category already exists', 400);
    }

    if (!storeRequest.slug) {
      storeRequest.slug = storeRequest.name.toLowerCase().replace(/ /g, '-');
    }

    const category = await this.prismaService.postCategories.create({
      data: storeRequest,
    });

    return {
      name: category.name,
      slug: category.slug,
    };
  }

  async update(
    slug: string,
    request: StoreCategoryRequest,
  ): Promise<CategoryResponse> {
    this.logger.debug(`Category.Update: ${slug}, ${JSON.stringify(request)}`);

    const updateRequest: UpdateCategoryRequest =
      this.validationService.validate(CategoryValidation.UPDATE, request);

    if (!slug) {
      throw new HttpException('Missing category slug', 400);
    }

    const category = await this.prismaService.postCategories.findFirst({
      where: {
        slug,
      },
    });

    if (!category) {
      throw new HttpException('Category not found', 404);
    }

    if (updateRequest.name !== category.name) {
      const totalCategoryWithSameName =
        await this.prismaService.postCategories.count({
          where: {
            name: updateRequest.name,
          },
        });

      if (totalCategoryWithSameName > 0) {
        throw new HttpException('Category already exists', 400);
      }
    }

    // Ensure slug is present and formatted correctly
    if (!updateRequest.slug) {
      updateRequest.slug = updateRequest.name.toLowerCase().replace(/ /g, '-');
    }

    const result = await this.prismaService.postCategories.update({
      where: {
        id: category.id, // Use both slug and id for more accurate updates
        slug,
      },
      data: updateRequest,
    });

    return {
      name: result.name,
      slug: result.slug,
    };
  }

  async delete(slug: string): Promise<CategoryResponse> {
    this.logger.debug(`Category.Delete: ${slug}`);

    const category = await this.prismaService.postCategories.findFirst({
      where: {
        slug,
      },
    });

    if (!category) {
      throw new HttpException('Category not found', 404);
    }

    await this.prismaService.postCategories.delete({
      where: {
        id: category.id,
      },
    });

    return {
      name: category.name,
      slug: category.slug,
    };
  }
}
