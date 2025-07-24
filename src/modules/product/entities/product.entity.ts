import { MecBaseEntity } from '@/base/mec.entity';
import { ProductType } from '@/lib/enum/product.enum';

import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { UUID } from 'crypto';
import { Column, Entity, OneToMany, Unique } from 'typeorm';

import { Variant } from './variant.entity';

@Entity('products')
@Unique('UQ_PRODUCT', ['name', 'sku', 'urlKey'], {
  deferrable: 'INITIALLY IMMEDIATE',
})
export class Product extends MecBaseEntity {
  @Column({ length: 255 })
  @IsNotEmpty()
  @IsUUID()
  createdByUserId: UUID;

  @Column({ default: ProductType.Simple })
  @IsNotEmpty()
  @IsEnum(ProductType)
  type: ProductType;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDate()
  newFromDate: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  @IsOptional()
  @IsDate()
  newToDate: Date | null;

  @OneToMany(() => Variant, (variant) => variant.parentProduct)
  variants: Variant[];

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
    type: ProductType,
    createdByUserId: UUID,
    variants: Variant[],
    newFromDate?: Date,
    newToDate?: Date,
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
    this.variants = variants;
    this.type = type;
    this.createdByUserId = createdByUserId;
    this.newFromDate = newFromDate ?? null;
    this.newToDate = newToDate ?? null;
  }
}
