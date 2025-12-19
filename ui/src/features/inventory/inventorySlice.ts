import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type {
  InventoryState,
  Inventory,
  InventoryItem,
  ItemDefinition,
  MoveItemPayload,
} from '../../shared/types';

const createInitialInventory = (): Inventory => ({
  size: 40,
  invType: 1,
  name: null,
  inventory: [],
  disabled: {},
  owner: 0,
  capacity: 0,
});

const devModeData = import.meta.env.MODE !== 'production' ? {
  player: {
    size: 40,
    invType: 1 as const,
    name: 'Player Storage',
    inventory: [
      { Name: 'burger', Slot: 1, Count: 5, CreateDate: Math.floor(Date.now() / 1000) },
      { Name: 'water', Slot: 2, Count: 3 },
      { Name: 'burger', Slot: 5, Count: 10 },
    ],
    disabled: {},
    owner: '12214124',
    capacity: 100,
    isWeaponEligble: true,
  },
  secondary: {
    size: 40,
    invType: 11 as const,
    name: 'Second Storage',
    inventory: [
      { Name: 'water', Slot: 1, Count: 10 },
      { Name: 'burger', Slot: 3, Count: 25 },
    ],
    disabled: {},
    owner: '346346346',
    capacity: 100,
  },
  showSecondary: true,
  items: {
    burger: {
      label: 'Burger',
      price: 0,
      isUsable: true,
      isRemoved: true,
      isStackable: 100,
      type: 1 as const,
      rarity: 1 as const,
      metalic: false,
      weight: 1,
    },
    water: {
      label: 'Water',
      price: 0,
      isUsable: true,
      isRemoved: true,
      isStackable: 10,
      type: 1 as const,
      rarity: 2 as const,
      metalic: false,
      weight: 1,
    },
  },
  itemsLoaded: true,
} : {};

const initialState: InventoryState = {
  player: {
    ...createInitialInventory(),
    isWeaponEligble: false,
    ...devModeData.player,
  },
  equipment: {
    inventory: [],
  },
  secondary: {
    ...createInitialInventory(),
    invType: 2,
    ...devModeData.secondary,
  },
  showSecondary: devModeData.showSecondary ?? false,
  hover: null,
  hoverOrigin: null,
  contextItem: null,
  splitItem: null,
  inUse: false,
  items: devModeData.items ?? {},
  itemsLoaded: devModeData.itemsLoaded ?? false,
  staticTooltip: false,
};

// Weight calculation utility - currently unused but kept for future weight validation
// const calcWeight = (inv: InventoryItem[], items: Record<string, ItemDefinition>): number => {
//   return inv.reduce((total, item) => {
//     if (!item) return total;
//     const itemDef = items[item.Name];
//     return total + (itemDef?.weight || 0) * item.Count;
//   }, 0);
// };

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    resetInventory: (state) => {
      state.player = {
        ...initialState.player,
        disabled: { ...state.player.disabled },
      };
      state.secondary = {
        ...initialState.secondary,
        disabled: { ...state.secondary.disabled },
      };
    },

    setPlayerInventory: (state, action: PayloadAction<Inventory>) => {
      state.player = {
        ...action.payload,
        invType: 1,
        disabled: state.player.disabled,
      };
    },

    setSecondaryInventory: (state, action: PayloadAction<Inventory>) => {
      const isSameInventory =
        state.secondary.owner === action.payload.owner &&
        state.secondary.invType === action.payload.invType;

      state.secondary = {
        ...action.payload,
        disabled: isSameInventory ? state.secondary.disabled : {},
      };
    },

    showSecondaryInventory: (state) => {
      state.showSecondary = true;
    },

    hideSecondaryInventory: (state) => {
      state.showSecondary = false;
      state.secondary = initialState.secondary;
    },

    setItems: (state, action: PayloadAction<Record<string, ItemDefinition>>) => {
      state.items = action.payload;
    },

    addItem: (state, action: PayloadAction<{ id: string; item: ItemDefinition }>) => {
      state.items[action.payload.id] = action.payload.item;
    },

    setItemsLoaded: (state, action: PayloadAction<boolean>) => {
      state.itemsLoaded = action.payload;
    },

    setHover: (state, action: PayloadAction<InventoryItem | null>) => {
      state.hover = action.payload;
    },

    setHoverOrigin: (
      state,
      action: PayloadAction<InventoryItem | null>
    ) => {
      state.hoverOrigin = action.payload;
    },

    setContextItem: (state, action: PayloadAction<InventoryItem | null>) => {
      state.contextItem = action.payload;
    },

    setSplitItem: (state, action: PayloadAction<InventoryItem | null>) => {
      state.splitItem = action.payload;
    },

    setInUse: (state, action: PayloadAction<boolean>) => {
      state.inUse = action.payload;
    },

    setStaticTooltip: (state, action: PayloadAction<InventoryItem | false>) => {
      state.staticTooltip = action.payload;
    },

    setPlayerSlotDisabled: (state, action: PayloadAction<{ slot: number; disabled: boolean }>) => {
      state.player.disabled[action.payload.slot] = action.payload.disabled;
    },

    setSecondarySlotDisabled: (
      state,
      action: PayloadAction<{ slot: number; disabled: boolean }>
    ) => {
      state.secondary.disabled[action.payload.slot] = action.payload.disabled;
    },

    moveItemPlayerSame: (state, action: PayloadAction<MoveItemPayload>) => {
      const { originSlot, destSlot } = action.payload;
      state.player.inventory = state.player.inventory.map((item) => {
        if (item?.Slot === originSlot) {
          return { ...item, Slot: destSlot };
        }
        return item;
      });
      state.player.disabled[originSlot] = true;
      state.player.disabled[destSlot] = true;
    },

    mergeItemPlayerSame: (state, action: PayloadAction<MoveItemPayload>) => {
      const { originSlot, destSlot } = action.payload;
      const originItem = state.player.inventory.find((item) => item?.Slot === originSlot);

      state.player.inventory = state.player.inventory
        .filter((item) => item?.Slot !== originSlot)
        .map((item) => {
          if (item?.Slot === destSlot && originItem) {
            return { ...item, Count: item.Count + originItem.Count };
          }
          return item;
        });

      state.player.disabled[originSlot] = true;
      state.player.disabled[destSlot] = true;
    },

    swapItemPlayerSame: (state, action: PayloadAction<MoveItemPayload>) => {
      const { originSlot, destSlot } = action.payload;
      state.player.inventory = state.player.inventory.map((item) => {
        if (item?.Slot === originSlot) {
          return { ...item, Slot: destSlot };
        } else if (item?.Slot === destSlot) {
          return { ...item, Slot: originSlot };
        }
        return item;
      });

      state.player.disabled[originSlot] = true;
      state.player.disabled[destSlot] = true;
    },

    moveItemSecondaryToPlayer: (state, action: PayloadAction<MoveItemPayload>) => {
      const { destSlot, origin } = action.payload;
      state.player.inventory.push({
        ...origin,
        Slot: destSlot,
      });
      state.player.disabled[destSlot] = true;
    },

    moveItemPlayerToSecondary: (state, action: PayloadAction<MoveItemPayload>) => {
      const { destSlot, origin } = action.payload;
      state.secondary.inventory.push({
        ...origin,
        Slot: destSlot,
      });
      state.secondary.disabled[destSlot] = true;
    },

    mergeItemSecondaryToPlayer: (state, action: PayloadAction<MoveItemPayload>) => {
      const { destSlot, origin } = action.payload;
      state.player.inventory = state.player.inventory.map((item) => {
        if (item?.Slot === destSlot) {
          return { ...item, Count: item.Count + origin.Count };
        }
        return item;
      });
      state.player.disabled[destSlot] = true;
    },

    mergeItemPlayerToSecondary: (state, action: PayloadAction<MoveItemPayload>) => {
      const { destSlot, origin } = action.payload;
      state.secondary.inventory = state.secondary.inventory.map((item) => {
        if (item?.Slot === destSlot) {
          return { ...item, Count: item.Count + origin.Count };
        }
        return item;
      });
      state.secondary.disabled[destSlot] = true;
    },

    setEquipment: (state, action: PayloadAction<{ inventory: InventoryItem[] }>) => {
      state.equipment = action.payload;
    },

    clearHover: (state) => {
      state.hover = null;
      state.hoverOrigin = null;
    },
  },
});

export const inventoryActions = inventorySlice.actions;
export default inventorySlice.reducer;
