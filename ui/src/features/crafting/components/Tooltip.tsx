import { Box, Typography } from '@mui/material';
import type { ItemDefinition } from '../../../shared/types';

interface TooltipProps {
  item: ItemDefinition;
  count: number;
  showRarity?: boolean;
}

const getTypeLabel = (type: number): string => {
  switch (type) {
    case 1:
      return 'Consumable';
    case 2:
      return 'Weapon';
    case 3:
      return 'Tool';
    case 4:
      return 'Crafting Ingredient';
    case 5:
      return 'Collectable';
    case 6:
      return 'Junk';
    case 8:
      return 'Evidence';
    case 9:
      return 'Ammunition';
    case 10:
      return 'Container';
    case 11:
      return 'Gem';
    case 12:
      return 'Paraphernalia';
    case 13:
      return 'Wearable';
    case 14:
      return 'Contraband';
    case 15:
      return 'Collectable (Gang Chain)';
    case 16:
      return 'Weapon Attachment';
    case 17:
      return 'Crafting Schematic';
    case 18:
      return 'Equipment';
    default:
      return 'Unknown Item';
  }
};

const getRarityLabel = (rarity: number): string => {
  switch (rarity) {
    case 1:
      return 'Common';
    case 2:
      return 'Uncommon';
    case 3:
      return 'Rare';
    case 4:
      return 'Epic';
    case 5:
      return 'Objective';
    default:
      return 'Dogshit';
  }
};

const getRarityColor = (rarity: number): string => {
  switch (rarity) {
    case 1:
      return '#ffffff';
    case 2:
      return '#9CE60D';
    case 3:
      return '#247ba5';
    case 4:
      return '#8e3bb8';
    case 5:
      return '#f2d411';
    default:
      return '#ffffff';
  }
};

export const Tooltip = ({ item, count, showRarity = false }: TooltipProps) => {
  if (!item) return null;

  return (
    <Box sx={{ minWidth: 150 }}>
      <Typography
        sx={{
          fontSize: '18px',
          color: getRarityColor(item.rarity),
        }}
      >
        {item.label}
        <Box
          component="span"
          sx={{
            fontSize: '14px',
            color: '#ffffff',
            '&::before': {
              content: '"x"',
              marginLeft: '2px',
            },
          }}
        >
          {count}
        </Box>
      </Typography>

      {showRarity && (
        <Typography
          sx={{
            fontSize: '14px',
            color: getRarityColor(item.rarity),
          }}
        >
          {getRarityLabel(item.rarity)}
        </Typography>
      )}

      <Typography sx={{ fontSize: '14px', color: '#cecece' }}>
        {getTypeLabel(item.type)}
      </Typography>

      {item.isUsable && (
        <Typography sx={{ fontSize: '14px', color: '#60eb50' }}>Usable</Typography>
      )}

      {item.isStackable && (
        <Typography sx={{ fontSize: '12px' }}>Stackable ({item.isStackable})</Typography>
      )}

      {(item.weight || 0) > 0 && (
        <Typography
          sx={{
            fontSize: '14px',
            color: '#cecece',
            '&::after': {
              content: `"${(item.weight || 0) > 1 ? 'lbs' : 'lb'}"`,
              marginLeft: '5px',
            },
          }}
        >
          {item.weight.toFixed(2)}
        </Typography>
      )}

      {item.description && (
        <Box
          sx={{
            paddingLeft: '20px',
            fontSize: '14px',
            color: '#cecece',
          }}
          dangerouslySetInnerHTML={{ __html: item.description }}
        />
      )}
    </Box>
  );
};
