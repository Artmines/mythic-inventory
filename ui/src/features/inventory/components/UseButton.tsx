import { Box, Fade } from '@mui/material';
import { Fingerprint } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { inventoryActions } from '../inventorySlice';
import { nuiActions } from '../../../services/nui';

export const UseButton = () => {
  const dispatch = useAppDispatch();
  const { hover, hoverOrigin, items, inUse, player } = useAppSelector(
    (state) => state.inventory
  );

  const isUsable = (): boolean => {
    if (Object.keys(items).length === 0) return false;
    if (!hover) return false;
    if (!hoverOrigin) return false;

    const itemData = items[hover.Name];
    if (!itemData) return false;

    const isDurable = !itemData.durability ||
      (!!((hover as any).CreateDate) &&
        (hover as any).CreateDate + itemData.durability > Date.now() / 1000);

    return (
      !inUse &&
      hoverOrigin.owner === player.owner &&
      itemData.isUsable &&
      isDurable
    );
  };

  const handleUseItem = () => {
    if (!hover || !hoverOrigin || hoverOrigin.invType !== player.invType) return;

    nuiActions.frontEndSound('SELECT');
    nuiActions.useItem({
      owner: hoverOrigin.owner,
      slot: hoverOrigin.Slot,
      invType: hoverOrigin.invType,
    });

    // Disable the slot optimistically while item is being used
    dispatch(
      inventoryActions.setPlayerSlotDisabled({
        slot: hoverOrigin.Slot,
        disabled: true,
      })
    );

    dispatch(inventoryActions.clearHover());
  };

  return (
    <Fade in={isUsable()}>
      <Box
        onMouseUp={handleUseItem}
        sx={{
          width: '130px',
          height: '130px',
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          margin: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(13, 22, 37, 0.733)',
          border: '1px solid transparent',
          borderRadius: '0',
          transition: 'background ease-in 0.15s, border ease-in 0.15s, color ease-in 0.15s',
          cursor: 'pointer',
          zIndex: 9999,
          '&:hover': {
            background: '#0c0c0c9e',
            borderColor: 'primary.light',
            color: 'primary.light',
          },
        }}
      >
        <Fingerprint sx={{ fontSize: '48px' }} />
      </Box>
    </Fade>
  );
};
