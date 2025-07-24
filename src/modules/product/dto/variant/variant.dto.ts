import {
  EXAMPLE_PRODUCT_DESCRIPTION,
  EXAMPLE_PRODUCT_ID,
  EXAMPLE_PRODUCT_META_DESCRIPTION,
  EXAMPLE_PRODUCT_META_TITLE,
  EXAMPLE_PRODUCT_NAME,
  EXAMPLE_PRODUCT_SKU,
  EXAMPLE_PRODUCT_URL_KEY,
} from '@/lib/const/product.const';
import { ApiProperty, PartialType } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UUID } from 'crypto';

import { PaginatedResponseDto } from '../../../base/dto/pagination.dto';

export class VariantProductBaseDto {
  @ApiProperty({
    description: 'The name of the product',
    type: String,
    example: EXAMPLE_PRODUCT_NAME,
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The SKU (Stock Keeping Unit) of the product',
    type: String,
    example: EXAMPLE_PRODUCT_SKU,
  })
  @IsString()
  @IsNotEmpty()
  sku: string;

  @ApiProperty({
    description: 'The description of the product',
    type: String,
    example: EXAMPLE_PRODUCT_DESCRIPTION,
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({
    description: 'The meta title of the product',
    type: String,
    example: EXAMPLE_PRODUCT_META_TITLE,
  })
  @IsString()
  @IsNotEmpty()
  metaTitle: string;

  @ApiProperty({
    description: 'The meta description of the product',
    type: String,
    example: EXAMPLE_PRODUCT_META_DESCRIPTION,
  })
  @IsString()
  @IsNotEmpty()
  metaDescription: string;

  @ApiProperty({
    description: 'The URL key of the product',
    type: String,
    example: EXAMPLE_PRODUCT_URL_KEY,
  })
  @IsString()
  @IsNotEmpty()
  urlKey: string;

  @ApiProperty({
    description: 'Indicates if the product is active',
    type: Boolean,
    default: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    description: 'Indicates if the product is in stock',
    type: Boolean,
    default: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  inStock: boolean;

  @ApiProperty({
    description: 'Indicates if the product is visible',
    type: Boolean,
    default: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  isVisible: boolean;

  constructor(
    name: string,
    sku: string,
    description: string,
    metaTitle: string,
    metaDescription: string,
    urlKey: string,
    isActive: boolean,
    inStock: boolean,
    isVisible: boolean,
  ) {
    this.name = name;
    this.sku = sku;
    this.description = description;
    this.metaTitle = metaTitle;
    this.metaDescription = metaDescription;
    this.urlKey = urlKey;
    this.isActive = isActive;
    this.inStock = inStock;
    this.isVisible = isVisible;
  }
}

export class CreateVariantProductDto extends VariantProductBaseDto {
  @ApiProperty({
    description: 'The unique identifier of variant the product',
    type: String,
    example: EXAMPLE_PRODUCT_ID,
    required: true,
  })
  @IsUUID(4, { each: true })
  @IsNotEmpty()
  parentProductIds: UUID[];

  constructor(
    parentProductIds: UUID[],
    name: string,
    sku: string,
    description: string,
    metaTitle: string,
    metaDescription: string,
    urlKey: string,
    isActive: boolean,
    inStock: boolean,
    isVisible: boolean,
  ) {
    super(
      name,
      sku,
      description,
      metaTitle,
      metaDescription,
      urlKey,
      isActive,
      inStock,
      isVisible,
    );
    this.parentProductIds = parentProductIds;
  }
}

export class UpdateVariantProductDto extends PartialType(
  VariantProductBaseDto,
) {}

export class GetVariantProductResponse extends VariantProductBaseDto {
  @ApiProperty({
    description: 'The unique identifier of variant the product',
    type: String,
    example: EXAMPLE_PRODUCT_ID,
    required: true,
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  constructor(
    id: string,
    name: string,
    sku: string,
    description: string,
    metaTitle: string,
    metaDescription: string,
    urlKey: string,
    isActive: boolean,
    inStock: boolean,
    isVisible: boolean,
  ) {
    super(
      name,
      sku,
      description,
      metaTitle,
      metaDescription,
      urlKey,
      isActive,
      inStock,
      isVisible,
    );
    this.id = id;
  }
}

/** * DTO for paginated response of product list.
 * Extends PaginatedResponseDto to include pagination details.
 */
export class VariantProductListRepsonseDto extends PaginatedResponseDto {
  @ApiProperty({
    description: 'List of variant products',
    type: GetVariantProductResponse,
    isArray: true,
  })
  @Type(() => GetVariantProductResponse)
  @ValidateNested({ each: true })
  variants: GetVariantProductResponse[];

  constructor(
    variants: GetVariantProductResponse[],
    total: number,
    page: number,
    limit: number,
    totalPages: number,
  ) {
    super(total, page, limit, totalPages);
    this.variants = variants;
  }
}
