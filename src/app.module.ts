import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [CommonModule, UserModule, CategoryModule, PostModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
