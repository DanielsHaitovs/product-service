import { MecBaseEntity } from '@/base/mec.entity';

import { UUID } from 'crypto';
import { Entity, ManyToOne, Unique } from 'typeorm';

import { Product } from './product.entity';

@Entity('variants')
@Unique('UQ_PRODUCT_VARIANTS', ['name', 'sku', 'urlKey'], {
  deferrable: 'INITIALLY IMMEDIATE',
})
export class Variant extends MecBaseEntity {
  @ManyToOne(() => Product, { nullable: false })
  parentProduct: Product;

  constructor(
    id: UUID,
    createdAt: Date,
    updatedAt: Date,
    name: string,
    sku: string,
    description: string,
    urlKey: string,
    metaTitle: string,
    metaDescription: string,
    isActive: boolean,
    inStock: boolean,
    isVisible: boolean,
    parentProduct: Product,
  ) {
    super(
      id,
      name,
      sku,
      description,
      urlKey,
      metaTitle,
      metaDescription,
      isActive,
      inStock,
      isVisible,
      createdAt,
      updatedAt,
    );
    this.parentProduct = parentProduct;
  }
}
