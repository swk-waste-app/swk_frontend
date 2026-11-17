import { useEffect, useState } from 'react';
import { formatNumber } from '../../lib/format';

// Shared data and logic for the marketplace and vendor screens.

// Values saved on listings. They must match what the API stores, so change
// them only together with the backend.
export const CATEGORIES = ['Bottles', 'Papers', 'Organic Fertilizer', 'Fashion & Textiles', 'Electronics', 'Metals', 'Plastics', 'Glass', 'Wood', 'Other'];

export const WASTE_TYPES = [
  'General Waste', 'Recyclable Materials', 'Organic/Food Waste', 'Electronic (E-Waste)', 'Hazardous Waste',
  'Fashion & Textiles', 'Plastics', 'Metals & Scrap', 'Glass', 'Wood & Furniture', 'Paper & Cardboard', 'Rubber', 'Other',
];

export const CONDITIONS = ['New', 'Like New', 'Good', 'Fair'];

export const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'price_low', label: 'Price: low to high' },
  { value: 'price_high', label: 'Price: high to low' },
];

export const ROUTES = {
  marketplace: '/customerDashboard/products',
  product: (id) => `/customerDashboard/product/${id}`,
  store: (vendorId) => `/customerDashboard/store/${vendorId}`,
  overview: '/customerDashboard/vendoroverview',
  listings: '/customerDashboard/vendorProduct',
  addListing: '/customerDashboard/addProduct',
  editListing: (id) => `/customerDashboard/editProduct/${id}`,
};

export const inStock = (product) => Number(product?.inventory) > 0;

export const plural = (count, word) => `${formatNumber(count)} ${word}${Number(count) === 1 ? '' : 's'}`;

export const EMPTY_FILTERS = { search: '', category: '', upcycledOnly: false, minPrice: '', maxPrice: '', sort: 'newest' };

export const hasActiveFilters = (filters) =>
  Boolean(filters.search || filters.category || filters.upcycledOnly || filters.minPrice || filters.maxPrice);

export const filterListings = (products, { search, category, upcycledOnly, minPrice, maxPrice, sort }) => {
  const query = search.trim().toLowerCase();
  const price = (product) => Number(product.price) || 0;
  const matches = products.filter((product) =>
    (!query || [product.title, product.description, product.upcyclingStory, product.user?.name].some((text) => text?.toLowerCase().includes(query)))
    && (!category || product.category === category)
    && (!upcycledOnly || product.isUpcycled)
    && (minPrice === '' || price(product) >= Number(minPrice))
    && (maxPrice === '' || price(product) <= Number(maxPrice)));

  if (sort === 'price_low') return matches.sort((a, b) => price(a) - price(b));
  if (sort === 'price_high') return matches.sort((a, b) => price(b) - price(a));
  return matches.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
};

// The API answers a rejected form with a validation report ({ details }) and
// everything else with { message }.
export const apiErrorMessage = (error, fallback) => {
  const data = error?.response?.data;
  return data?.details?.[0]?.message || data?.message || fallback;
};

// Runs `loader` on mount and again whenever it changes or reload() is called.
// Pass a loader wrapped in useCallback.
export const useLoader = (loader) => {
  const [state, setState] = useState({ status: 'loading', data: null });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    setState({ status: 'loading', data: null });
    loader().then(
      (data) => { if (active) setState({ status: 'ready', data }); },
      () => { if (active) setState({ status: 'error', data: null }); },
    );
    return () => { active = false; };
  }, [loader, attempt]);

  return {
    ...state,
    reload: () => setAttempt((n) => n + 1),
    setData: (update) => setState((current) => ({ ...current, data: update(current.data) })),
  };
};
