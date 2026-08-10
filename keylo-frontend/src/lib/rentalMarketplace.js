// ============================================================================
// Rental marketplace composition.
//
// The public /rentals page and the item detail page read their catalog from
// here instead of importing src/lib/rentalCatalog.js directly, so items
// published by listers automatically appear with the same card design.
// ============================================================================

import { rentalItems, categoryImages } from './rentalCatalog';
import { getPublishedListerItems, listerCategoryLabel, listerCategoryImages } from './listerData';

export const marketplaceCategoryImages = {
  ...categoryImages,
  ...listerCategoryImages,
};

// Map a lister item into the exact marketplace card shape used by the
// existing rental grid (rentalCatalog item contract).
export function toMarketplaceItem(listerItem) {
  return {
    id: `lister-${listerItem.id}`,
    name: listerItem.name,
    category: listerItem.category,
    categoryLabel: listerCategoryLabel(listerItem.category),
    price: `₹${Number(listerItem.pricePerDay).toLocaleString('en-IN')}`,
    period: '/ Day',
    badges: [
      {
        label: listerItem.availability === 'available' ? 'By Owner' : 'Rented',
        bg: listerItem.availability === 'available' ? 'bg-[#C7F000]' : 'bg-[#FF4F9A]',
        textColor: 'text-primary',
      },
    ],
    image: listerItem.photos?.[0] || marketplaceCategoryImages[listerItem.category],
    listerItemId: listerItem.id,
    listerUserId: listerItem.listerId,
    description: listerItem.description,
    pricePerDay: listerItem.pricePerDay,
    pricePerWeek: listerItem.pricePerWeek,
    deposit: listerItem.deposit,
    condition: listerItem.condition,
    location: listerItem.location,
    availability: listerItem.availability,
    rules: listerItem.rules,
    fulfilment: listerItem.fulfilment,
    photos: listerItem.photos || [],
    timesRented: listerItem.timesRented || 0,
    createdAt: listerItem.createdAt,
  };
}

export async function getMarketplaceItems() {
  const catalog = rentalItems;
  const published = await getPublishedListerItems();
  return [...catalog, ...published.map(toMarketplaceItem)];
}

export async function getMarketplaceItemById(id) {
  const stringId = String(id);
  const catalog = rentalItems.find((r) => String(r.id) === stringId);
  if (catalog) return catalog;
  const published = await getPublishedListerItems();
  const match = published.find((i) => `lister-${i.id}` === stringId);
  return match ? toMarketplaceItem(match) : null;
}
