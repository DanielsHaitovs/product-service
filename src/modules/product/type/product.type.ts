export interface ProductSearchCriteria {
  name?: boolean;
  sku?: boolean;
  description?: boolean;
  urlKey?: boolean;
  metaTitle?: boolean;
  metaDescription?: boolean;
  createdByUserId?: boolean;
  isActive?: boolean;
  inStock?: boolean;
  isVisible?: boolean;
  type?: boolean;
  newFromDate?: boolean;
  newToDate?: boolean;
}
