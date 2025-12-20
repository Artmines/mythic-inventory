import { useState } from 'react';
import { Box, Popover, Typography } from '@mui/material';
import { useAppSelector } from '../../../shared/hooks';
import { getItemImage } from '../../../shared/utils/inventory';
import { Tooltip } from './Tooltip';
import type { RecipeItem } from '../../../shared/types';

interface ReagentProps {
  item: RecipeItem;
  qty: number;
}

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

export const Reagent = ({ item, qty }: ReagentProps) => {
  const { items } = useAppSelector((state) => state.inventory);
  const hidden = useAppSelector((state) => state.app.hidden);
  const { myCounts } = useAppSelector((state) => state.crafting);

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const open = Boolean(anchorEl);

  const itemData = items[item.name];
  const hasItems =
    Boolean(myCounts[item.name]) && myCounts[item.name] >= item.count * qty;

  const tooltipOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const tooltipClose = () => {
    setAnchorEl(null);
  };

  if (!itemData) return null;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Box
        onMouseEnter={tooltipOpen}
        onMouseLeave={tooltipClose}
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: 'auto',
          aspectRatio: '1 / 1',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '1.25vh',
          padding: 0,
          margin: 0,
          boxShadow: `inset 0 0 1vh ${getRarityColor(itemData.rarity)}`,
          objectFit: 'cover',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Box
            component="img"
            src={getItemImage(item.name)}
            sx={{
              width: '50%',
              height: 'auto',
            }}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}
          >
            <Typography sx={{ fontSize: '1.5vh' }}>
              {Boolean(myCounts[item.name]) ? myCounts[item.name] : 0} /{' '}
              <Box
                component="span"
                sx={{
                  color: hasItems ? 'inherit' : '#a13434',
                }}
              >
                {item.count * qty}
              </Box>
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingTop: '0.5vh',
          textAlign: 'center',
          color: '#fff',
          fontSize: '1.25vh',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          maxWidth: '100%',
        }}
      >
        {itemData.label}
      </Typography>

      <Popover
        sx={{
          pointerEvents: 'none',
          fontSize: '1.5vh',
        }}
        slotProps={{
          paper: {
            sx: {
              padding: '1vh',
              border: `0.25vh solid ${getRarityColor(itemData.rarity)}`,
              borderRadius: '1.25vh',
              background: 'rgb(18,18,28)',
            },
          },
        }}
        open={open && !hidden}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={tooltipClose}
        disableRestoreFocus
      >
        <Tooltip item={itemData} count={item.count} />
      </Popover>
    </Box>
  );
};
