import {
  EXAMPLE_CREATED_BY_USER_ID,
  EXAMPLE_PRODUCT_DESCRIPTION,
  EXAMPLE_PRODUCT_ID,
  EXAMPLE_PRODUCT_META_DESCRIPTION,
  EXAMPLE_PRODUCT_META_TITLE,
  EXAMPLE_PRODUCT_NAME,
  EXAMPLE_PRODUCT_SKU,
  EXAMPLE_PRODUCT_URL_KEY,
} from '@/lib/const/product.const';
import { ProductType } from '@/lib/enum/product.enum';
import { ApiProperty, PartialType } from '@nestjs/swagger';

import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { UUID } from 'crypto';

import { PaginatedResponseDto } from '../../base/dto/pagination.dto';

export class ProductBaseDto {
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
    description: 'The meta description of the product',
    type: String,
    example: EXAMPLE_CREATED_BY_USER_ID,
  })
  @IsUUID()
  @IsNotEmpty()
  createdByUserId: UUID;

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

  @ApiProperty({
    description: 'The type of the product',
    type: String,
    enum: ProductType,
    default: ProductType.Simple,
    example: ProductType.Simple,
  })
  @IsNotEmpty()
  @IsEnum(ProductType)
  type: ProductType;

  @ApiProperty({
    description: 'The date from which the product is new',
    type: Date,
    example: new Date('2023-01-01T00:00:00Z'),
    required: false,
  })
  @IsOptional()
  @IsDate()
  newFromDate: Date | null;

  @ApiProperty({
    description: 'The date until which the product is new',
    type: Date,
    example: new Date('2023-12-31T23:59:59Z'),
    required: false,
  })
  @IsOptional()
  @IsDate()
  newToDate: Date | null;

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
    type: ProductType,
    createdByUserId: UUID,
    newFromDate?: Date,
    newToDate?: Date,
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
    this.type = type;
    this.createdByUserId = createdByUserId;
    this.newFromDate = newFromDate ?? null;
    this.newToDate = newToDate ?? null;
  }
}

export class CreateProductDto extends ProductBaseDto {}

export class UpdateProductDto extends PartialType(ProductBaseDto) {}

export class GetProductResponse extends ProductBaseDto {
  @ApiProperty({
    description: 'The unique identifier of the product',
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
    type: ProductType,
    createdByUserId: UUID,
    newFromDate?: Date,
    newToDate?: Date,
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
      type,
      createdByUserId,
      newFromDate,
      newToDate,
    );
    this.id = id;
  }
}

/** * DTO for paginated response of product list.
 * Extends PaginatedResponseDto to include pagination details.
 */
export class ProductListRepsonseDto extends PaginatedResponseDto {
  @ApiProperty({
    description: 'List of products',
    type: GetProductResponse,
    isArray: true,
  })
  @Type(() => GetProductResponse)
  @ValidateNested({ each: true })
  products: GetProductResponse[];

  constructor(
    products: GetProductResponse[],
    total: number,
    page: number,
    limit: number,
    totalPages: number,
  ) {
    super(total, page, limit, totalPages);
    this.products = products;
  }
}
