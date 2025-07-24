import { PaginationDto, SortDto } from '@/base/dto/pagination.dto';
import {
  PRODUCT_QUERY_ALIAS,
  VARIANT_PRODUCT_QUERY_ALIAS,
} from '@/lib/const/product.const';
import {
  CreateVariantProductDto,
  VariantProductListRepsonseDto,
} from '@/modules/product/dto/variant/variant.dto';
import { CreateProductDto } from '@/product/dto/product.dto';
import { Product } from '@/product/entities/product.entity';
import { Variant } from '@/product/entities/variant.entity';
import { ProductSearchCriteria } from '@/product/type/product.type';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';

import { UUID } from 'crypto';
import { EntityManager, EntityNotFoundError } from 'typeorm';

@Injectable()
export class VariantProductService {
  constructor(
    @InjectEntityManager()
    private readonly productRepository: EntityManager,
  ) {}

  async create(productData: CreateVariantProductDto[]): Promise<Variant[]> {
    const parentProductIds = productData.flatMap((p) => p.parentProductIds);
    const names = productData.flatMap((p) => p.name);
    const skus = productData.flatMap((p) => p.sku);
    const urlKeys = productData.flatMap((p) => p.urlKey);

    await this.conflictCheck({ names, skus, urlKeys });
    await this.findParentProductByIds(parentProductIds);

    const product = this.productRepository.create(Variant, productData);
    return this.productRepository.save(Variant, product);
  }

  async findByIds({
    ids,
    pagination,
  }: {
    ids: UUID[];
    pagination: PaginationDto;
  }): Promise<Variant[]> {
    if (pagination.page < 1 || pagination.limit < 1) {
      throw new BadRequestException(
        'Pagination parameters must be greater than 0',
      );
    }

    const { page, limit } = pagination;

    return await this.productRepository
      .createQueryBuilder(Variant, VARIANT_PRODUCT_QUERY_ALIAS)
      .whereInIds(ids)
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async findBySkus({
    skus,
    pagination,
  }: {
    skus: string[];
    pagination: PaginationDto;
  }): Promise<Variant[]> {
    if (pagination.page < 1 || pagination.limit < 1) {
      throw new BadRequestException(
        'Pagination parameters must be greater than 0',
      );
    }

    const { page, limit } = pagination;

    return await this.productRepository
      .createQueryBuilder(Variant, VARIANT_PRODUCT_QUERY_ALIAS)
      .whereInIds(skus)
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async search({
    value,
    pagination,
    sort,
    searchCriteria,
  }: {
    value: string;
    pagination: PaginationDto;
    sort: SortDto;
    searchCriteria: ProductSearchCriteria;
  }): Promise<VariantProductListRepsonseDto> {
    if (pagination.page < 1 || pagination.limit < 1) {
      throw new BadRequestException(
        'Pagination parameters must be greater than 0',
      );
    }

    const { page, limit } = pagination;
    const {
      name,
      sku,
      description,
      urlKey,
      metaTitle,
      metaDescription,
      createdByUserId,
      isActive,
      inStock,
      isVisible,
    } = searchCriteria;
    const { sortField, sortOrder } = sort;

    const query = this.productRepository
      .createQueryBuilder(Variant, VARIANT_PRODUCT_QUERY_ALIAS)
      .where(`${VARIANT_PRODUCT_QUERY_ALIAS}.id::text ILIKE :value`, {
        value: `%${value}%`,
      });

    if (name === true) {
      query.orWhere(`${VARIANT_PRODUCT_QUERY_ALIAS}.name ILIKE :value`, {
        value: `%${value}%`,
      });
    }
    if (sku === true) {
      query.orWhere(`${VARIANT_PRODUCT_QUERY_ALIAS}.sku ILIKE :value`, {
        value: `%${value}%`,
      });
    }
    if (description === true) {
      query.orWhere(`${VARIANT_PRODUCT_QUERY_ALIAS}.description ILIKE :value`, {
        value: `%${value}%`,
      });
    }
    if (urlKey === true) {
      query.orWhere(`${VARIANT_PRODUCT_QUERY_ALIAS}.urlKey ILIKE :value`, {
        value: `%${value}%`,
      });
    }
    if (metaTitle === true) {
      query.orWhere(`${VARIANT_PRODUCT_QUERY_ALIAS}.metaTitle ILIKE :value`, {
        value: `%${value}%`,
      });
    }
    if (metaDescription === true) {
      query.orWhere(
        `${VARIANT_PRODUCT_QUERY_ALIAS}.metaDescription ILIKE :value`,
        {
          value: `%${value}%`,
        },
      );
    }
    if (createdByUserId === true) {
      query.orWhere(
        `${VARIANT_PRODUCT_QUERY_ALIAS}.createdByUserId ILIKE :value`,
        {
          value: `%${value}%`,
        },
      );
    }
    if (isActive === true) {
      query.orWhere(`${VARIANT_PRODUCT_QUERY_ALIAS}.isActive = :isActive`, {
        value: `%${value}%`,
      });
    }
    if (inStock === true) {
      query.orWhere(`${VARIANT_PRODUCT_QUERY_ALIAS}.inStock = :inStock`, {
        value: `%${value}%`,
      });
    }
    if (isVisible === true) {
      query.orWhere(`${VARIANT_PRODUCT_QUERY_ALIAS}.isVisible = :isVisible`, {
        value: `%${value}%`,
      });
    }

    if (sortField) {
      query.orderBy(`${VARIANT_PRODUCT_QUERY_ALIAS}.${sortField}`, sortOrder);
    }

    const variants = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalCount = variants[1];

    return {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      variants: variants[0],
    };
  }

  async update(id: UUID, productData: CreateProductDto): Promise<Variant> {
    const { name, sku, urlKey } = productData;
    await this.conflictCheck({
      names: [name],
      skus: [sku],
      urlKeys: [urlKey],
      id,
    });

    await this.productRepository
      .createQueryBuilder(Variant, VARIANT_PRODUCT_QUERY_ALIAS)
      .update(Product)
      .set(productData)
      .where(`${VARIANT_PRODUCT_QUERY_ALIAS}.id = :id`, { id })
      .execute();

    return await this.productRepository
      .createQueryBuilder(Variant, VARIANT_PRODUCT_QUERY_ALIAS)
      .where(`${VARIANT_PRODUCT_QUERY_ALIAS}.id = :id`, { id })
      .getOneOrFail();
  }

  async delete(ids: UUID[]): Promise<{ deleted: number }> {
    const result = await this.productRepository
      .createQueryBuilder(Variant, VARIANT_PRODUCT_QUERY_ALIAS)
      .delete()
      .whereInIds(ids)
      .execute();

    if (result.affected === 0) {
      throw new ConflictException('No products found to delete');
    }

    return { deleted: result.affected ?? 0 };
  }

  private async conflictCheck({
    names,
    skus,
    urlKeys,
    id,
  }: {
    names: string[];
    skus: string[];
    urlKeys: string[];
    id?: UUID;
  }): Promise<void> {
    const query = this.productRepository
      .createQueryBuilder(Variant, VARIANT_PRODUCT_QUERY_ALIAS)
      .where(`${VARIANT_PRODUCT_QUERY_ALIAS}.name IN (:...names)`, { names })
      .orWhere(`${VARIANT_PRODUCT_QUERY_ALIAS}.sku IN (:...skus)`, { skus })
      .orWhere(`${VARIANT_PRODUCT_QUERY_ALIAS}.urlKey IN (:...urlKeys)`, {
        urlKeys,
      });

    if (id !== undefined) {
      query.andWhere(`${VARIANT_PRODUCT_QUERY_ALIAS}.id != :id`, { id });
    }

    const variants = await query
      .select([
        `${VARIANT_PRODUCT_QUERY_ALIAS}.name`,
        `${VARIANT_PRODUCT_QUERY_ALIAS}.sku`,
        `${VARIANT_PRODUCT_QUERY_ALIAS}.urlKey`,
      ])
      .getMany();

    const conflictNames = variants.filter((product) =>
      names.includes(product.name),
    );
    const conflictSkus = variants.filter((product) =>
      skus.includes(product.sku),
    );
    const conflictUrlKeys = variants.filter((product) =>
      urlKeys.includes(product.urlKey),
    );

    if (variants.length > 0) {
      throw new ConflictException(`
        Product with the same ${conflictNames.length > 0 ? `name: ${conflictNames.flatMap((p) => p.name).join(', ')}` : ''}
        ${conflictSkus.length > 0 ? `SKU: ${conflictSkus.flatMap((p) => p.sku).join(', ')}` : ''}
        ${conflictUrlKeys.length > 0 ? `URL key: ${conflictUrlKeys.flatMap((p) => p.urlKey).join(', ')}` : ''} already exists.
      `);
    }
  }

  private async findParentProductByIds(ids: UUID[]): Promise<Product[]> {
    if (ids.length === 0) {
      return [];
    }

    const products = await this.productRepository
      .createQueryBuilder(Product, PRODUCT_QUERY_ALIAS)
      .where(`${PRODUCT_QUERY_ALIAS}.id IN (:...ids)`, { ids })
      .getMany();

    if (products.length !== ids.length) {
      throw new EntityNotFoundError(
        'Product',
        `Products with IDs [${ids.filter((id) => products.some((p) => id === p.id)).join(', ')}] not found`,
      );
    }

    return products;
  }
}
