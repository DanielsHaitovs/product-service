import { PaginationDto, SortDto } from '@/base/dto/pagination.dto';
import { PRODUCT_QUERY_ALIAS } from '@/lib/const/product.const';
import {
  CreateProductDto,
  ProductListRepsonseDto,
} from '@/product/dto/product.dto';
import { Product } from '@/product/entities/product.entity';
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UUID } from 'crypto';
import { Repository } from 'typeorm';

import { ProductSearchCriteria } from '../type/product.type';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * Creates a new product in the database.
   * Checks for conflicts with existing products based on name, SKU, and URL key.
   * Throws a ConflictException if a product with the same name, SKU, or URL key already exists.
   *
   * @param productData - The data for the new product to be created.
   * @returns The created product entity.
   */
  async create(productData: CreateProductDto): Promise<Product> {
    const { name, sku, urlKey } = productData;
    await this.conflictCheck({ name, sku, urlKey });

    const product = this.productRepository.create(productData);
    return this.productRepository.save(product);
  }

  /**
   * Finds a product by its IDs.
   * Throws an EntityNotFoundError if the product is not found.
   *
   * @param ids - The IDs of the products to find.
   * @returns The found product entities.
   */
  async findByIds({
    ids,
    pagination,
  }: {
    ids: UUID[];
    pagination: PaginationDto;
  }): Promise<Product[]> {
    if (pagination.page < 1 || pagination.limit < 1) {
      throw new ConflictException(
        'Pagination parameters must be greater than 0',
      );
    }

    const { page, limit } = pagination;

    return await this.productRepository
      .createQueryBuilder(PRODUCT_QUERY_ALIAS)
      .whereInIds(ids)
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  /**
   * Finds a product by its SKU.
   * Throws an EntityNotFoundError if the product is not found.
   *
   * @param sku - The SKU of the product to find.
   * @returns The found product entity.
   */
  async findBySku({
    skus,
    pagination,
  }: {
    skus: string[];
    pagination: PaginationDto;
  }): Promise<Product[]> {
    if (pagination.page < 1 || pagination.limit < 1) {
      throw new ConflictException(
        'Pagination parameters must be greater than 0',
      );
    }

    const { page, limit } = pagination;

    return await this.productRepository
      .createQueryBuilder(PRODUCT_QUERY_ALIAS)
      .whereInIds(skus)
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  /**
   * Searches for products based on various criteria.
   * Supports pagination and sorting.
   *
   * @param value - The search value to filter products by.
   * @param pagination - Pagination parameters (page and limit).
   * @param sort - Sorting parameters (sort field and order).
   * @param searchCriteria - Additional search criteria.
   * @returns A paginated response containing the found products.
   */
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
  }): Promise<ProductListRepsonseDto> {
    if (pagination.page < 1 || pagination.limit < 1) {
      throw new ConflictException(
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
      type,
      newFromDate,
      newToDate,
    } = searchCriteria;
    const { sortField, sortOrder } = sort;

    const query = this.productRepository
      .createQueryBuilder(PRODUCT_QUERY_ALIAS)
      .where(`${PRODUCT_QUERY_ALIAS}.id::text ILIKE :value`, {
        value: `%${value}%`,
      });

    if (name === true) {
      query.orWhere(`${PRODUCT_QUERY_ALIAS}.name ILIKE :value`, {
        value: `%${value}%`,
      });
    }
    if (sku === true) {
      query.orWhere(`${PRODUCT_QUERY_ALIAS}.sku ILIKE :value`, {
        value: `%${value}%`,
      });
    }
    if (description === true) {
      query.orWhere(`${PRODUCT_QUERY_ALIAS}.description ILIKE :value`, {
        value: `%${value}%`,
      });
    }
    if (urlKey === true) {
      query.orWhere(`${PRODUCT_QUERY_ALIAS}.urlKey ILIKE :value`, {
        value: `%${value}%`,
      });
    }
    if (metaTitle === true) {
      query.orWhere(`${PRODUCT_QUERY_ALIAS}.metaTitle ILIKE :value`, {
        value: `%${value}%`,
      });
    }
    if (metaDescription === true) {
      query.orWhere(`${PRODUCT_QUERY_ALIAS}.metaDescription ILIKE :value`, {
        value: `%${value}%`,
      });
    }
    if (createdByUserId === true) {
      query.orWhere(`${PRODUCT_QUERY_ALIAS}.createdByUserId ILIKE :value`, {
        value: `%${value}%`,
      });
    }
    if (isActive === true) {
      query.orWhere(`${PRODUCT_QUERY_ALIAS}.isActive = :isActive`, {
        value: `%${value}%`,
      });
    }
    if (inStock === true) {
      query.orWhere(`${PRODUCT_QUERY_ALIAS}.inStock = :inStock`, {
        value: `%${value}%`,
      });
    }
    if (isVisible === true) {
      query.orWhere(`${PRODUCT_QUERY_ALIAS}.isVisible = :isVisible`, {
        value: `%${value}%`,
      });
    }
    if (type === true) {
      query.orWhere(`${PRODUCT_QUERY_ALIAS}.type = :type`, {
        value: `%${value}%`,
      });
    }
    if (newFromDate === true) {
      query.orWhere(`${PRODUCT_QUERY_ALIAS}.newFromDate >= :newFromDate`, {
        value: `%${value}%`,
      });
    }
    if (newToDate === true) {
      query.orWhere(`${PRODUCT_QUERY_ALIAS}.newToDate <= :newToDate`, {
        value: `%${value}%`,
      });
    }

    if (sortField) {
      query.orderBy(`${PRODUCT_QUERY_ALIAS}.${sortField}`, sortOrder);
    }

    const products = await query
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const totalCount = products[1];

    return {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      products: products[0],
    };
  }

  /**
   * Updates a product by its ID.
   * Throws an EntityNotFoundError if the product is not found.
   *
   * @param id - The ID of the product to update.
   * @param productData - The data to update the product with.
   * @returns The updated product entity.
   */
  async update(id: UUID, productData: CreateProductDto): Promise<Product> {
    const { name, sku, urlKey } = productData;
    await this.conflictCheck({ name, sku, urlKey });

    await this.productRepository
      .createQueryBuilder('product')
      .update(Product)
      .set(productData)
      .where('product.id = :id', { id })
      .execute();

    return await this.productRepository
      .createQueryBuilder('product')
      .where('product.id = :id', { id })
      .getOneOrFail();
  }

  /**
   * Deletes a product by its ID.
   * Throws an EntityNotFoundError if the product is not found.
   *
   * @param id - The ID of the product to delete.
   * @returns The deleted product entity.
   */
  async delete(ids: UUID[]): Promise<{ deleted: number }> {
    const result = await this.productRepository
      .createQueryBuilder(PRODUCT_QUERY_ALIAS)
      .delete()
      .whereInIds(ids)
      .execute();

    if (result.affected === 0) {
      throw new ConflictException('No products found to delete');
    }

    return { deleted: result.affected ?? 0 };
  }

  /**
   * Checks for conflicts with existing products based on name, SKU, and URL key.
   * Throws a ConflictException if a product with the same name, SKU, or URL key already exists.
   *
   * @param name - The name of the product to check.
   * @param sku - The SKU of the product to check.
   * @param urlKey - The URL key of the product to check.
   * @param id - Optional ID to exclude from conflict check (for updates).
   */
  private async conflictCheck({
    name,
    sku,
    urlKey,
    id,
  }: {
    name: string;
    sku: string;
    urlKey: string;
    id?: UUID;
  }): Promise<void> {
    const query = this.productRepository
      .createQueryBuilder('products')
      .where(`products.name = :name`, { name })
      .orWhere(`${PRODUCT_QUERY_ALIAS}.sku = :sku`, { sku })
      .orWhere(`${PRODUCT_QUERY_ALIAS}.urlKey = :urlKey`, {
        urlKey,
      });

    if (id !== undefined) {
      query.andWhere(`${PRODUCT_QUERY_ALIAS}.id != :id`, { id });
    }

    const products = await query
      .select([
        `${PRODUCT_QUERY_ALIAS}.name`,
        `${PRODUCT_QUERY_ALIAS}.sku`,
        `${PRODUCT_QUERY_ALIAS}.urlKey`,
      ])
      .getMany();

    const conflictName = products.filter((product) => product.name === name);
    const conflictSku = products.filter((product) => product.sku === sku);
    const conflictUrlKey = products.filter(
      (product) => product.urlKey === urlKey,
    );

    if (products.length > 0) {
      throw new ConflictException(`
        Product with the same ${conflictName.length > 0 ? `name: ${name}` : ''}
        ${conflictSku.length > 0 ? `SKU: ${sku}` : ''}
        ${conflictUrlKey.length > 0 ? `URL key: ${urlKey}` : ''} already exists.
      `);
    }
  }
}
