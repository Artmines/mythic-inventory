import { useEffect } from 'react';
import { Box, Slide } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { appActions } from '../../../store/appSlice';
import { HotbarSlot } from './HotbarSlot';

export const Hotbar = () => {
  const dispatch = useAppDispatch();
  const { showHotbar, hotbarItems, equipped, mode } = useAppSelector((state) => state.app);
  const { items, itemsLoaded, player } = useAppSelector((state) => state.inventory);

  useEffect(() => {
    if (!showHotbar) return;

    const timer = setTimeout(() => {
      dispatch(appActions.hideHotbar());
    }, 5000);

    return () => clearTimeout(timer);
  }, [showHotbar, dispatch]);

  if (mode === 'crafting' || !itemsLoaded || !hotbarItems || Object.keys(items).length === 0) {
    return null;
  }

  return (
    <Slide direction="up" in={showHotbar}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '6px',
          pb: 2,
          pointerEvents: 'none',
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => {
          const slotNumber = index + 1;
          const item = hotbarItems[index];
          return (
            <HotbarSlot
              key={slotNumber}
              slot={slotNumber}
              item={item}
              invType={player.invType}
              owner={player.owner}
            />
          );
        })}

        {equipped && (
          <Box sx={{ ml: 2 }}>
            <HotbarSlot
              slot={equipped.Slot}
              item={equipped}
              invType={player.invType}
              owner={player.owner}
              isEquipped
            />
          </Box>
        )}
      </Box>
    </Slide>
  );
};
