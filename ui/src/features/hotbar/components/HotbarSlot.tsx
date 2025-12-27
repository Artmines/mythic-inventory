import { Box, LinearProgress, Typography } from '@mui/material';
import { useMemo, memo } from 'react';
import { useAppSelector } from '../../../shared/hooks';
import { getItemImage } from '../../../shared/utils/inventory';
import { lua2json } from '../../../shared/utils/lua';
import { rarityColors } from '../../../styles/theme';
import type { InventoryItem, ItemMetadata } from '../../../shared/types';

interface HotbarSlotProps {
  slot: number;
  item: InventoryItem | null;
  invType: number;
  owner: string | number;
  isEquipped?: boolean;
}

const HotbarSlotComponent = ({ slot, item, isEquipped = false }: HotbarSlotProps) => {
  const { items } = useAppSelector((state) => state.inventory);

  // Memoize metadata parsing to prevent expensive lua2json calls
  const metadata: ItemMetadata = useMemo(() => {
    if (!item?.MetaData) return {};
    return typeof item.MetaData === 'string' ? lua2json(item.MetaData) : item.MetaData;
  }, [item?.MetaData]);

  const itemData = item ? items[item.Name] : null;
  const isEmpty = !item || !itemData;

  // Memoize durability calculation
  const durability = useMemo((): number | null => {
    if (!(item as any)?.CreateDate || !itemData?.durability) return null;
    return Math.ceil(
      100 -
        ((Math.floor(Date.now() / 1000) - (item as any).CreateDate) /
          itemData.durability) *
          100
    );
  }, [(item as any)?.CreateDate, itemData?.durability]);

  const isBroken = durability !== null && durability <= 0;

  // Memoize durability color calculation
  const durabilityColor = useMemo(() => {
    if (!durability) return '#0FC6A6';
    if (durability >= 75) return '#0FC6A6';
    if (durability >= 50) return '#f09348';
    return '#6e1616';
  }, [durability]);

  return (
    <Box
      sx={{
        width: '70px',
        height: '70px',
        background: isBroken
          ? 'linear-gradient(rgba(99, 35, 35, 0.8), 25%, rgba(99, 35, 35, 0.4))'
          : 'rgba(17, 49, 80, 0.85)',
        border: `2px solid ${
          itemData ? rarityColors[itemData.rarity] : 'rgba(255, 255, 255, 0.1)'
        }`,
        borderRadius: '6px',
        position: 'relative',
        boxShadow: isEquipped ? '0 0 15px rgba(15, 198, 166, 0.6)' : 'none',
      }}
    >
      {!isEmpty && itemData && (
        <>
          <Box
            sx={{
              height: '100%',
              width: '100%',
              backgroundImage: `url(${getItemImage(
                metadata.CustomItemImage || item.Name
              )})`,
              backgroundSize: '60%',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center center',
            }}
          />

          {item.Count > 1 && (
            <Typography
              sx={{
                position: 'absolute',
                top: 0,
                right: 0,
                padding: '0 3px',
                fontSize: '11px',
                fontWeight: 'bold',
                zIndex: 4,
                textShadow: '0 0 3px rgba(0,0,0,0.9)',
              }}
            >
              {item.Count}
            </Typography>
          )}

          {durability !== null && durability > 0 && (
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '3px',
                zIndex: 4,
              }}
            >
              <LinearProgress
                variant="determinate"
                value={durability}
                sx={{
                  height: '100%',
                  backgroundColor: 'transparent',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: durabilityColor,
                    transition: 'none',
                  },
                }}
              />
            </Box>
          )}

          {isBroken && (
            <Typography
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                fontSize: '10px',
                fontWeight: 'bold',
                color: '#fff',
                textShadow: '0 0 5px rgba(0,0,0,0.8)',
                zIndex: 5,
              }}
            >
              BROKEN
            </Typography>
          )}

          {!isEquipped && (
            <Typography
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                padding: '0 4px',
                fontSize: '10px',
                color: '#9CE60D',
                background: 'rgba(12,24,38, 0.9)',
                borderRight: '1px solid rgb(255 255 255 / 4%)',
                borderBottom: '1px solid rgb(255 255 255 / 4%)',
                borderBottomRightRadius: '4px',
                borderTopLeftRadius: '4px',
                zIndex: 4,
              }}
            >
              {slot}
            </Typography>
          )}

          {isEquipped && (
            <Typography
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                padding: '0 4px',
                fontSize: '9px',
                color: '#0FC6A6',
                background: 'rgba(12,24,38, 0.9)',
                borderRight: '1px solid rgb(255 255 255 / 4%)',
                borderBottom: '1px solid rgb(255 255 255 / 4%)',
                borderBottomRightRadius: '4px',
                borderTopLeftRadius: '4px',
                zIndex: 4,
              }}
            >
              EQUIPPED
            </Typography>
          )}
        </>
      )}

      {isEmpty && (
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'rgba(255, 255, 255, 0.3)',
            fontSize: '10px',
          }}
        >
          {slot}
        </Typography>
      )}
    </Box>
  );
};

export const HotbarSlot = memo(HotbarSlotComponent);
