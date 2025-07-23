import { filterProducts, sortProducts } from './utils';
import type { Product, FilterOptions, SortOption } from './types';

describe('filterProducts', () => {
  const products: Product[] = [
    { id: '1', name: 'A', description: 'desc A', price: 10, category: 'cat1', image: '', stock: 5, featured: false, createdAt: '', updatedAt: '' },
    { id: '2', name: 'B', description: 'desc B', price: 20, category: 'cat2', image: '', stock: 2, featured: true, createdAt: '', updatedAt: '' },
    { id: '3', name: 'C', description: 'desc C', price: 30, category: 'cat1', image: '', stock: 0, featured: false, createdAt: '', updatedAt: '' },
  ];

  it('filters by category', () => {
    const filters: FilterOptions = { category: 'cat1', minPrice: 0, maxPrice: 0, search: '' };
    const result = filterProducts(products, filters);
    expect(result).toHaveLength(2);
    expect(result.every(p => p.category === 'cat1')).toBe(true);
  });

  it('filters by minPrice and maxPrice', () => {
    const filters: FilterOptions = { category: '', minPrice: 15, maxPrice: 25, search: '' };
    const result = filterProducts(products, filters);
    expect(result).toHaveLength(1);
    expect(result[0].price).toBe(20);
  });

  it('filters by search (name)', () => {
    const filters: FilterOptions = { category: '', minPrice: 0, maxPrice: 0, search: 'B' };
    const result = filterProducts(products, filters);
    expect(result).toHaveLength(1);
    expect(result[0].name).toBe('B');
  });
});

describe('sortProducts', () => {
  const products: Product[] = [
    { id: '1', name: 'C', description: '', price: 30, category: '', image: '', stock: 0, featured: false, createdAt: '2024-01-01', updatedAt: '' },
    { id: '2', name: 'A', description: '', price: 10, category: '', image: '', stock: 0, featured: true, createdAt: '2024-01-03', updatedAt: '' },
    { id: '3', name: 'B', description: '', price: 20, category: '', image: '', stock: 0, featured: false, createdAt: '2024-01-02', updatedAt: '' },
  ];

  it('sorts by name', () => {
    const result = sortProducts(products, 'name');
    expect(result.map(p => p.name)).toEqual(['A', 'B', 'C']);
  });

  it('sorts by price-low', () => {
    const result = sortProducts(products, 'price-low');
    expect(result.map(p => p.price)).toEqual([10, 20, 30]);
  });

  it('sorts by price-high', () => {
    const result = sortProducts(products, 'price-high');
    expect(result.map(p => p.price)).toEqual([30, 20, 10]);
  });

  it('sorts by newest', () => {
    const result = sortProducts(products, 'newest');
    expect(result.map(p => p.createdAt)).toEqual(['2024-01-03', '2024-01-02', '2024-01-01']);
  });

  it('sorts by featured', () => {
    const result = sortProducts(products, 'featured');
    expect(result[0].featured).toBe(true);
  });
}); 