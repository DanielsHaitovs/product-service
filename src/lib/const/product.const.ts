/**
 * Product constants for the product service.
 * These values are used for testing, documentation, and API examples.
 * They should be used consistently across tests and documentation
 */
export const EXAMPLE_PRODUCT_NAME = 'Sample Product';

export const PRODUCT_QUERY_ALIAS = 'products';
export const VARIANT_PRODUCT_QUERY_ALIAS = 'variants';

/**
 * Sample UUID v4 for product identification in tests and API documentation.
 * Format follows RFC 4122 standard for universally unique identifiers.
 */
export const EXAMPLE_PRODUCT_ID = '123e4567-e89b-12d3-a456-426614174000';
/**
 * Standard example SKU used in API documentation and test fixtures.
 * Represents a product SKU that is commonly used for testing scenarios.
 */
export const EXAMPLE_PRODUCT_SKU = 'sample-product-sku';

/**
 * Standard example description used in API documentation and test fixtures.
 * Represents a product description that is commonly used for testing scenarios.
 */
export const EXAMPLE_PRODUCT_DESCRIPTION =
  'This is a sample product description for testing purposes.';
/**
 * Standard example URL key used in API documentation and test fixtures.
 * Represents a product URL key that is commonly used for testing scenarios.
 */
export const EXAMPLE_PRODUCT_URL_KEY = 'sample-product-url-key';

/**
 * Standard example meta title used in API documentation and test fixtures.
 * Represents a product meta title that is commonly used for testing scenarios.
 */
export const EXAMPLE_PRODUCT_META_TITLE = 'Sample Product Meta Title';

/**
 * Standard example created by user ID used in API documentation and test fixtures.
 * Represents a user ID that is commonly used for testing scenarios.
 */
export const EXAMPLE_CREATED_BY_USER_ID =
  '123e4567-e89b-12d3-a456-426614174000';

/**
 * Standard example meta description used in API documentation and test fixtures.
 * Represents a product meta description that is commonly used for testing scenarios.
 */
export const EXAMPLE_PRODUCT_META_DESCRIPTION =
  'Sample product meta description for testing purposes.';

/**
 * Standard example type used in API documentation and test fixtures.
 * Represents a product type that is commonly used for testing scenarios.
 */
export const EXAMPLE_PRODUCT_TYPE = 'simple';

/**
 * Standard example new from date used in API documentation and test fixtures.
 * Represents a product new from date that is commonly used for testing scenarios.
 */
export const EXAMPLE_PRODUCT_NEW_FROM_DATE = new Date('2023-01-01T00:00:00Z');

/**
 * Standard example new to date used in API documentation and test fixtures.
 * Represents a product new to date that is commonly used for testing scenarios.
 */
export const EXAMPLE_PRODUCT_NEW_TO_DATE = new Date('2023-12-31T23:59:59Z');

/**
 * Standard example in stock status used in API documentation and test fixtures.
 * Represents a product in stock status that is commonly used for testing scenarios.
 */
export const EXAMPLE_PRODUCT_IN_STOCK = true;

/**
 * Standard example visibility status used in API documentation and test fixtures.
 * Represents a product visibility status that is commonly used for testing scenarios.
 */
export const EXAMPLE_PRODUCT_IS_VISIBLE = true;

/**
 * Standard example active status used in API documentation and test fixtures.
 * Represents a product active status that is commonly used for testing scenarios.
 */
export const EXAMPLE_PRODUCT_IS_ACTIVE = true;

/**
 * Standard example message used in API documentation and test fixtures.
 * Represents a message indicating that a product with the given SKU already exists.
 */
export const PRODUCT_CONFLICT_MSG =
  'Product with this SKU, name or url key already exists';

/**
 * Standard example message used in API documentation and test fixtures.
 * Represents a message indicating that a product was not found.
 */
export const PRODUCT_NOT_FOUND_MSG = 'Product not found';
