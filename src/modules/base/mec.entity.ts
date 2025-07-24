import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { UUID } from 'crypto';
import {
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class MecBaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: UUID;

  @Column({ length: 100 })
  @IsNotEmpty()
  @IsString()
  name: string;

  @Column({ length: 100 })
  @IsNotEmpty()
  @IsString()
  sku: string;

  @Column({ length: 255 })
  @IsNotEmpty()
  @IsString()
  description: string;

  @Column({ length: 255 })
  @IsNotEmpty()
  @IsString()
  urlKey: string;

  @Column({ length: 255 })
  @IsNotEmpty()
  @IsString()
  metaTitle: string;

  @Column({ length: 255 })
  @IsNotEmpty()
  @IsString()
  metaDescription: string;

  @Column({ default: false })
  @IsBoolean()
  isActive: boolean;

  @Column({ default: false })
  @IsBoolean()
  inStock: boolean;

  @Column({ default: false })
  @IsBoolean()
  isVisible: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor(
    id: UUID,
    name: string,
    sku: string,
    description: string,
    urlKey: string,
    metaTitle: string,
    metaDescription: string,
    isActive: boolean,
    inStock: boolean,
    isVisible: boolean,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.name = name;
    this.sku = sku;
    this.description = description;
    this.urlKey = urlKey;
    this.metaTitle = metaTitle;
    this.metaDescription = metaDescription;
    this.isActive = isActive;
    this.inStock = inStock;
    this.isVisible = isVisible;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
