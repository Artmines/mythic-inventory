import {
  Dialog,
  DialogContent,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
} from '@mui/material';
import { Close, Inventory2, Build, Store, LocalShipping } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { appActions } from '../../../store/appSlice';
import { inventoryActions } from '../inventorySlice';
import { craftingActions } from '../../crafting/craftingSlice';

interface DevModePopupProps {
  open: boolean;
  onClose: () => void;
}

export const DevModePopup = ({ open, onClose }: DevModePopupProps) => {
  const dispatch = useAppDispatch();
  const currentMode = useAppSelector((state) => state.app.mode);

  const handleSetInventoryMode = () => {
    dispatch(appActions.setMode('inventory'));
    dispatch(inventoryActions.hideSecondaryInventory());
    dispatch(appActions.showApp());

    // Add mock item definitions
    dispatch(
      inventoryActions.setItems({
        burger: {
          label: 'Burger',
          price: 0,
          isUsable: true,
          isRemoved: true,
          isStackable: 100,
          type: 1,
          rarity: 1,
          metalic: false,
          weight: 1,
        },
        water: {
          label: 'Water',
          price: 0,
          isUsable: true,
          isRemoved: true,
          isStackable: 10,
          type: 1,
          rarity: 2,
          metalic: false,
          weight: 1,
        },
      })
    );

    // Mark items as loaded
    dispatch(inventoryActions.setItemsLoaded(true));
  };

  const handleSetInventoryWithSecondary = () => {
    dispatch(appActions.setMode('inventory'));
    dispatch(appActions.showApp());

    // Add mock item definitions
    dispatch(
      inventoryActions.setItems({
        burger: {
          label: 'Burger',
          price: 0,
          isUsable: true,
          isRemoved: true,
          isStackable: 100,
          type: 1,
          rarity: 1,
          metalic: false,
          weight: 1,
        },
        water: {
          label: 'Water',
          price: 0,
          isUsable: true,
          isRemoved: true,
          isStackable: 10,
          type: 1,
          rarity: 2,
          metalic: false,
          weight: 1,
        },
      })
    );

    // Mark items as loaded
    dispatch(inventoryActions.setItemsLoaded(true));

    // Mock secondary inventory data
    dispatch(
      inventoryActions.setSecondaryInventory({
        inventory: [
          { Name: 'burger', Slot: 1, Count: 10, Quality: 100 },
          { Name: 'water', Slot: 2, Count: 5, Quality: 100 },
        ],
        name: 'Ground',
        invType: 1,
        capacity: 100,
        owner: 'ground-123',
        size: 50,
        disabled: {},
      })
    );
    dispatch(inventoryActions.showSecondaryInventory());
  };

  const handleSetCraftingMode = () => {
    dispatch(appActions.setMode('crafting'));
    dispatch(appActions.showApp());

    // Add mock item definitions for crafting
    dispatch(
      inventoryActions.setItems({
        lockpick: {
          label: 'Lockpick',
          price: 0,
          isUsable: true,
          isRemoved: true,
          isStackable: 10,
          type: 2,
          rarity: 2,
          metalic: false,
          weight: 0.5,
        },
        metalscrap: {
          label: 'Metal Scrap',
          price: 0,
          isUsable: false,
          isRemoved: false,
          isStackable: 50,
          type: 10,
          rarity: 1,
          metalic: true,
          weight: 0.2,
        },
        plastic: {
          label: 'Plastic',
          price: 0,
          isUsable: false,
          isRemoved: false,
          isStackable: 50,
          type: 10,
          rarity: 1,
          metalic: false,
          weight: 0.1,
        },
        bandage: {
          label: 'Bandage',
          price: 0,
          isUsable: true,
          isRemoved: true,
          isStackable: 10,
          type: 1,
          rarity: 1,
          metalic: false,
          weight: 0.2,
        },
        cloth: {
          label: 'Cloth',
          price: 0,
          isUsable: false,
          isRemoved: false,
          isStackable: 50,
          type: 10,
          rarity: 1,
          metalic: false,
          weight: 0.1,
        },
      })
    );

    // Mark items as loaded
    dispatch(inventoryActions.setItemsLoaded(true));

    // Mock crafting bench data
    dispatch(
      craftingActions.setBench({
        benchName: 'Crafting Bench',
        bench: 'dev-bench',
        cooldowns: {},
        actionString: 'Crafting',
        recipes: [
          {
            id: 'lockpick',
            time: 5000,
            result: { name: 'lockpick', count: 1 },
            items: [
              { name: 'metalscrap', count: 2 },
              { name: 'plastic', count: 1 },
            ],
          },
          {
            id: 'bandage',
            time: 3000,
            result: { name: 'bandage', count: 1 },
            items: [
              { name: 'cloth', count: 2 },
            ],
          },
        ],
        myCounts: {
          metalscrap: 10,
          plastic: 5,
          cloth: 8,
          lockpick: 2,
          bandage: 3,
        },
      })
    );
  };

  const handleSetShopMode = () => {
    dispatch(appActions.setMode('inventory'));
    dispatch(appActions.showApp());

    // Add mock item definitions
    dispatch(
      inventoryActions.setItems({
        burger: {
          label: 'Burger',
          price: 10,
          isUsable: true,
          isRemoved: true,
          isStackable: 100,
          type: 1,
          rarity: 1,
          metalic: false,
          weight: 1,
        },
        water: {
          label: 'Water',
          price: 5,
          isUsable: true,
          isRemoved: true,
          isStackable: 10,
          type: 1,
          rarity: 2,
          metalic: false,
          weight: 1,
        },
        bandage: {
          label: 'Bandage',
          price: 15,
          isUsable: true,
          isRemoved: true,
          isStackable: 10,
          type: 1,
          rarity: 1,
          metalic: false,
          weight: 0.2,
        },
      })
    );

    // Mark items as loaded
    dispatch(inventoryActions.setItemsLoaded(true));

    // Mock shop inventory
    dispatch(
      inventoryActions.setSecondaryInventory({
        inventory: [
          { Name: 'burger', Slot: 1, Count: 999, Quality: 100, Price: 10 },
          { Name: 'water', Slot: 2, Count: 999, Quality: 100, Price: 5 },
          { Name: 'bandage', Slot: 3, Count: 999, Quality: 100, Price: 15 },
        ],
        name: '24/7 Store',
        invType: 10,
        capacity: 0,
        owner: 'shop-247',
        size: 25,
        disabled: {},
        shop: true,
      })
    );
    dispatch(inventoryActions.showSecondaryInventory());
  };

  const stateOptions = [
    {
      label: 'Inventory Only',
      description: 'View player inventory without secondary inventory',
      icon: <Inventory2 />,
      action: handleSetInventoryMode,
      mode: 'inventory',
    },
    {
      label: 'Inventory + Ground',
      description: 'View with secondary inventory (ground/container)',
      icon: <LocalShipping />,
      action: handleSetInventoryWithSecondary,
      mode: 'inventory-secondary',
    },
    {
      label: 'Crafting Bench',
      description: 'View crafting interface with mock recipes',
      icon: <Build />,
      action: handleSetCraftingMode,
      mode: 'crafting',
    },
    {
      label: 'Shop',
      description: 'View shop interface with purchasable items',
      icon: <Store />,
      action: handleSetShopMode,
      mode: 'shop',
    },
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'rgba(18, 18, 18, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(36, 123, 165, 0.3)',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(36, 123, 165, 0.3)',
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ color: '#0FC6A6' }}>
          Dev Mode - State Switcher
        </Typography>
        <IconButton onClick={onClose} size="small" sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>

      <DialogContent sx={{ pt: 3 }}>
        <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255, 255, 255, 0.7)' }}>
          Switch between different inventory states to test UI changes without restarting the
          game. Current mode: <strong>{currentMode}</strong>
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {stateOptions.map((option, index) => (
            <Box key={index}>
              <Button
                onClick={() => {
                  option.action();
                  onClose();
                }}
                fullWidth
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  textAlign: 'left',
                  padding: 2,
                  backgroundColor: 'rgba(36, 123, 165, 0.1)',
                  border: '1px solid rgba(36, 123, 165, 0.3)',
                  borderRadius: 1,
                  transition: 'all 0.2s',
                  '&:hover': {
                    backgroundColor: 'rgba(36, 123, 165, 0.2)',
                    borderColor: 'rgba(36, 123, 165, 0.5)',
                    transform: 'translateX(4px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1, width: '100%' }}>
                  <Box sx={{ color: '#0FC6A6' }}>{option.icon}</Box>
                  <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                    {option.label}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', pl: 4 }}>
                  {option.description}
                </Typography>
              </Button>
              {index < stateOptions.length - 1 && (
                <Divider sx={{ my: 1, borderColor: 'rgba(36, 123, 165, 0.1)' }} />
              )}
            </Box>
          ))}
        </Box>

        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: 'rgba(255, 165, 0, 0.1)',
            border: '1px solid rgba(255, 165, 0, 0.3)',
            borderRadius: 1,
          }}
        >
          <Typography variant="caption" sx={{ color: 'rgba(255, 165, 0, 0.9)' }}>
            <strong>Note:</strong> This dev mode popup is only visible when running in development
            mode and will not appear in production builds.
          </Typography>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
