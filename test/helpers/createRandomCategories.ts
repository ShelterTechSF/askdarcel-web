import { faker } from "@faker-js/faker";

/**
 * Generates an object of categories for use in search refinement components
 *
 * @param size Customize the number of categories
 */
export function createRandomCategories(size: number) {
  const result: { [key: string]: number } = {};

  for (let i = 0; i < size; i++) {
    // Append incrementor because the current version of faker does not support
    // uniqueness
    const key = `${faker.company.name()}_${i}`;
    const value = faker.number.int(100);
    result[key] = value;
  }

  return result;
}
