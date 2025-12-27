import { Box, Typography, Popover } from '@mui/material';
import { useMemo, useCallback } from 'react';
import { useAppSelector } from '../../../shared/hooks';
import { lua2json } from '../../../shared/utils/lua';
import { formatThousands, getItemTypeLabel, getRarityLabel } from '../../../shared/utils/formatters';
import { rarityColors } from '../../../styles/theme';
import type { InventoryItem, ItemMetadata } from '../../../shared/types';

interface TooltipProps {
  item: InventoryItem | null;
  anchorEl: HTMLElement | null;
  onClose: () => void;
}

const ignoredFields = [
  'ammo',
  'clip',
  'CreateDate',
  'Container',
  'Quality',
  'CustomItemLabel',
  'CustomItemImage',
  'Items',
];

export const Tooltip = ({ item, anchorEl, onClose }: TooltipProps) => {
  const { items } = useAppSelector((state) => state.inventory);

  const itemData = item ? items[item.Name] : null;

  const metadata: ItemMetadata = useMemo(() => {
    if (!item?.MetaData) return {};
    return typeof item.MetaData === 'string' ? lua2json(item.MetaData) : item.MetaData;
  }, [item?.MetaData]);

  const durability = useMemo(() => {
    if (!metadata.CreateDate || !itemData?.durability) return null;
    return Math.ceil(
      100 -
        ((Math.floor(Date.now() / 1000) - metadata.CreateDate) / itemData.durability) * 100
    );
  }, [metadata.CreateDate, itemData?.durability]);

  const metadataEntries = useMemo(() =>
    Object.entries(metadata).filter(([key]) => !ignoredFields.includes(key)),
    [metadata]
  );

  const label = useMemo(() => metadata.CustomItemLabel || itemData?.label, [metadata.CustomItemLabel, itemData?.label]);
  const rarityLabel = useMemo(() => itemData ? getRarityLabel(itemData.rarity) : '', [itemData]);
  const typeLabel = useMemo(() => itemData ? getItemTypeLabel(itemData.type) : '', [itemData]);

  const renderMetadataField = useCallback((key: string, value: any) => {
    if (ignoredFields.includes(key)) return null;

    switch (key) {
      case 'SerialNumber':
        return (
          <Typography key={key} variant="body2" sx={{ mt: 0.5 }}>
            <strong>Serial Number:</strong> {value}
          </Typography>
        );
      case 'ScratchedSerialNumber':
        return (
          <Typography key={key} variant="body2" sx={{ mt: 0.5 }}>
            <strong>Serial Number:</strong> {'<scratched off>'}
          </Typography>
        );
      case 'WeaponComponents':
        if (!value || Object.keys(value).length === 0) return null;
        return (
          <Box key={key} sx={{ mt: 1 }}>
            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
              Weapon Attachments:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 2 }}>
              {Object.entries(value).map(([slot, attach]: [string, any]) => {
                const attachItem = items[attach.item];
                if (!attachItem) return null;
                return (
                  <Typography key={slot} component="li" variant="body2" sx={{ fontSize: '12px' }}>
                    <strong style={{ textTransform: 'capitalize' }}>{slot}:</strong>{' '}
                    {attachItem.label}
                  </Typography>
                );
              })}
            </Box>
          </Box>
        );
      default:
        if (typeof value === 'object') return null;
        return (
          <Typography key={key} variant="body2" sx={{ mt: 0.5 }}>
            <strong>{key}:</strong> {String(value)}
          </Typography>
        );
    }
  }, [items]);

  if (!item || !anchorEl || !itemData) return null;

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      disableEscapeKeyDown
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'left',
      }}
      sx={{ pointerEvents: 'none' }}
      slotProps={{
        paper: {
          sx: {
            p: 1.5,
            minWidth: '250px',
            maxWidth: '350px',
            border: `2px solid ${rarityColors[itemData.rarity]}`,
            borderRadius: '5px',
            background: 'rgba(12, 24, 38, 0.95)',
          },
        },
      }}
    >
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontSize: '20px', fontWeight: 'bold' }}>
            {label}
          </Typography>
          {itemData.price > 0 && (
            <Typography sx={{ color: 'success.main', fontSize: '14px' }}>
              ${formatThousands(itemData.price)}
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 0.5 }}>
          <Typography
            variant="body2"
            sx={{ color: rarityColors[itemData.rarity], fontSize: '14px' }}
          >
            {rarityLabel} {typeLabel}
          </Typography>
          {itemData.isUsable && (
            <Typography variant="body2" sx={{ color: 'success.light', fontSize: '14px' }}>
              - Usable
            </Typography>
          )}
        </Box>

        {itemData.description && (
          <Typography
            variant="body2"
            sx={{
              mt: 1,
              pl: 2,
              fontSize: '14px',
              color: 'text.secondary',
              fontStyle: 'italic',
            }}
            dangerouslySetInnerHTML={{ __html: itemData.description }}
          />
        )}

        <Box
          sx={{
            mt: 1,
            pt: 1,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '12px',
          }}
        >
          <Typography variant="body2">
            Weight: <span style={{ color: '#9e9e9e' }}>{itemData.weight} lbs</span>
            {item.Count > 1 && (
              <span style={{ color: '#9e9e9e' }}>
                {' '}
                ({itemData.weight * item.Count} lbs total)
              </span>
            )}
          </Typography>

          {itemData.isStackable && (
            <Typography variant="body2">
              Count:{' '}
              <span style={{ color: '#9e9e9e' }}>
                {item.Count} / {itemData.isStackable}
              </span>
            </Typography>
          )}

          {durability !== null && (
            <Typography
              variant="body2"
              sx={{
                color:
                  durability >= 75
                    ? 'success.light'
                    : durability >= 50
                    ? 'warning.light'
                    : 'error.light',
              }}
            >
              Durability: {Math.max(durability, 0)}%
            </Typography>
          )}

          {!isNaN(item.Quality ?? NaN) && (item.Quality ?? 0) > 0 && (
            <Typography
              variant="body2"
              sx={{
                color:
                  (item.Quality ?? 0) >= 75
                    ? 'success.light'
                    : (item.Quality ?? 0) >= 50
                    ? 'warning.light'
                    : 'error.light',
              }}
            >
              Quality: {item.Quality}%
            </Typography>
          )}
        </Box>

        {metadataEntries.length > 0 && (
          <Box
            sx={{
              mt: 1,
              pt: 1,
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              fontSize: '12px',
            }}
          >
            {metadataEntries.map(([key, value]) =>
              renderMetadataField(key, value)
            )}
          </Box>
        )}
      </Box>
    </Popover>
  );
};
