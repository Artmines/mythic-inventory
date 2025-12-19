import type { InventoryItem, ItemDefinition } from '../types';

export const normalizeInventory = (inv: InventoryItem[] | Record<number, InventoryItem>): InventoryItem[] => {
  return Array.isArray(inv) ? inv : Object.values(inv || {});
};

export const calcWeight = (inventory: InventoryItem[], items: Record<string, ItemDefinition>): number => {
  return inventory
    .filter((item) => Boolean(item))
    .reduce((total, item) => {
      const itemDef = items[item.Name];
      return total + (itemDef?.weight || 0) * item.Count;
    }, 0);
};

export const getItemImage = (itemName: string): string => {
  return `nui://mythic-inventory/ui/images/items/${itemName}.webp`;
};
