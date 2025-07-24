import {
  EXAMPLE_CREATED_BY_USER_ID,
  EXAMPLE_PRODUCT_DESCRIPTION,
  EXAMPLE_PRODUCT_ID,
  EXAMPLE_PRODUCT_META_DESCRIPTION,
  EXAMPLE_PRODUCT_META_TITLE,
  EXAMPLE_PRODUCT_NAME,
  EXAMPLE_PRODUCT_NEW_FROM_DATE,
  EXAMPLE_PRODUCT_NEW_TO_DATE,
  EXAMPLE_PRODUCT_SKU,
  EXAMPLE_PRODUCT_TYPE,
  EXAMPLE_PRODUCT_URL_KEY,
  PRODUCT_CONFLICT_MSG,
  PRODUCT_NOT_FOUND_MSG,
} from '@/lib/const/product.const';
import {
  CreateProductDto,
  GetProductResponse,
} from '@/product/dto/product.dto';
import { Product } from '@/product/entities/product.entity';
import { ProductService } from '@/product/services/product.service';
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { EntityNotFoundError } from 'typeorm';

@ApiTags('Product')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new product',
    description:
      'Creates a new product with the provided information. Name, Sku and Url key must be unique.',
  })
  @ApiBody({
    type: CreateProductDto,
    description: 'Product creation data',
    examples: {
      'new-product': {
        summary: 'Create a new product',
        description:
          'Example of creating a new product with all required fields',
        value: {
          name: EXAMPLE_PRODUCT_NAME,
          sku: EXAMPLE_PRODUCT_SKU,
          description: EXAMPLE_PRODUCT_DESCRIPTION,
          urlKey: EXAMPLE_PRODUCT_URL_KEY,
          metaTitle: EXAMPLE_PRODUCT_META_TITLE,
          metaDescription: EXAMPLE_PRODUCT_META_DESCRIPTION,
          createdByUserId: EXAMPLE_CREATED_BY_USER_ID,
          type: EXAMPLE_PRODUCT_TYPE,
          // newFromData: EXAMPLE_PRODUCT_NEW_FROM_DATE,
          // newToDate: EXAMPLE_PRODUCT_NEW_TO_DATE,
          isActive: false,
          inStock: false,
          isVisible: false,
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'User successfully created',
    type: GetProductResponse,
    example: {
      id: EXAMPLE_PRODUCT_ID,
      name: EXAMPLE_PRODUCT_NAME,
      sku: EXAMPLE_PRODUCT_SKU,
      description: EXAMPLE_PRODUCT_DESCRIPTION,
      urlKey: EXAMPLE_PRODUCT_URL_KEY,
      metaTitle: EXAMPLE_PRODUCT_META_TITLE,
      metaDescription: EXAMPLE_PRODUCT_META_DESCRIPTION,
      createdByUserId: EXAMPLE_CREATED_BY_USER_ID,
      type: EXAMPLE_PRODUCT_TYPE,
      newFromData: EXAMPLE_PRODUCT_NEW_FROM_DATE,
      newToDate: EXAMPLE_PRODUCT_NEW_TO_DATE,
      isActive: false,
      inStock: false,
      isVisible: false,
    },
  })
  @ApiBadRequestResponse({
    description: 'Invalid input data provided',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'name should not be empty',
            'sku should not be empty',
            'description should not be empty',
            'urlKey should not be empty',
            'metaTitle should not be empty',
            'metaDescription should not be empty',
          ],
        },
        error: { type: 'string', example: BadRequestException.name },
      },
    },
  })
  @ApiConflictResponse({
    description: PRODUCT_CONFLICT_MSG,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: PRODUCT_CONFLICT_MSG },
        error: { type: 'string', example: ConflictException.name },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Could not find product',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: PRODUCT_NOT_FOUND_MSG },
        error: { type: 'string', example: EntityNotFoundError.name },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: InternalServerErrorException.name,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: InternalServerErrorException.name },
        error: { type: 'string', example: InternalServerErrorException.name },
      },
    },
  })
  async createProduct(
    @Body() createProduct: CreateProductDto,
  ): Promise<Product> {
    return await this.productService.create(createProduct);
  }
}
