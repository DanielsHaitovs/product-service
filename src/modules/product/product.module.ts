import { Product } from '@/product/entities/product.entity';
import { Variant } from '@/product/entities/variant.entity';
import { ProductController } from '@/product/product.controller';
import { ProductService } from '@/product/services/product.service';
import { VariantProductService } from '@/product/services/variant/variant.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Variant])],
  controllers: [ProductController],
  providers: [ProductService, VariantProductService],
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class ProductModule {}
