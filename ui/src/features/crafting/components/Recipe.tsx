import { useState } from 'react';
import { Box, Button, IconButton, Popover, Typography } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { craftingActions } from '../craftingSlice';
import { nuiActions } from '../../../services/nui';
import { getItemImage } from '../../../shared/utils/inventory';
import { Reagent } from './Reagent';
import { Tooltip } from './Tooltip';
import type { Recipe as RecipeType } from '../../../shared/types';

interface RecipeProps {
  index: number;
  recipe: RecipeType;
  cooldown?: number;
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

export const Recipe = ({ index, recipe, cooldown }: RecipeProps) => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((state) => state.inventory);
  const { bench, crafting, myCounts } = useAppSelector((state) => state.crafting);
  const hidden = useAppSelector((state) => state.app.hidden);

  const [qty, setQty] = useState(1);
  const [resultEl, setResultEl] = useState<HTMLElement | null>(null);
  const resultOpen = Boolean(resultEl);

  const craftItemData = items[recipe.result.name];

  const resultTPOpen = (event: React.MouseEvent<HTMLElement>) => {
    setResultEl(event.currentTarget);
  };

  const resultTPClose = () => {
    setResultEl(null);
  };

  const hasReagents = (): boolean => {
    const reagents: Record<string, number> = {};
    recipe.items.forEach((item) => {
      if (!Boolean(reagents[item.name])) {
        reagents[item.name] = item.count * qty;
      } else {
        reagents[item.name] += item.count * qty;
      }
    });

    for (const item in reagents) {
      if (!Boolean(myCounts[item]) || reagents[item] > myCounts[item]) {
        return false;
      }
    }

    return true;
  };

  const craft = async () => {
    if (Boolean(crafting)) return;

    try {
      const res: any = await nuiActions.craftItem({
        bench,
        qty,
        result: recipe.id,
      });

      if (res && !res.error) {
        nuiActions.frontEndSound('SELECT');
        dispatch(
          craftingActions.setCrafting({
            recipe: recipe.id,
            start: Date.now(),
            time: recipe.time * qty,
          })
        );
      } else {
        nuiActions.frontEndSound('DISABLED');
        // Could show res.message to user if needed
      }
    } catch (err) {
      console.error('Craft error:', err);
      nuiActions.frontEndSound('DISABLED');
    }
  };

  const cancel = async () => {
    try {
      const res = await nuiActions.craftCancel();
      if (res) {
        nuiActions.frontEndSound('BACK');
        dispatch(craftingActions.endCrafting());
      } else {
        nuiActions.frontEndSound('DISABLED');
      }
    } catch (err) {
      console.error('Cancel error:', err);
    }
  };

  const onQtyChange = (change: number) => {
    if (Boolean(recipe.cooldown)) return;

    if ((change < 0 && qty <= 1) || (change > 0 && qty >= 99)) return;
    setQty(qty + change);
  };

  if (!craftItemData) return null;

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at top, rgba(46, 62, 79, 0.8) 5%, rgba(10, 14, 18, 0.8) 80%)',
        backgroundColor: 'rgba(9, 49, 71, 0.6)',
        borderRadius: '1.5vh',
        padding: '2%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'space-between',
      }}
    >
      <Popover
        sx={{ pointerEvents: 'none', fontSize: '1.5vh' }}
        slotProps={{
          paper: {
            sx: {
              padding: '1vh',
              border: `0.25vh solid ${getRarityColor(craftItemData.rarity)}`,
              borderRadius: '1.25vh',
              background: 'rgb(18,18,28)',
            },
          },
        }}
        open={resultOpen && !hidden}
        anchorEl={resultEl}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        onClose={resultTPClose}
        disableEscapeKeyDown
        disableRestoreFocus
      >
        <Tooltip item={craftItemData} count={recipe.result.count} />
      </Popover>

      {/* Top Container */}
      <Box
        sx={{
          flex: '0 0 25%',
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexDirection: 'row',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            padding: '2%',
            flex: '0 0 20%',
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '1.5vh',
            boxShadow: `inset 0 0 4vh ${getRarityColor(craftItemData.rarity)}`,
          }}
        >
          <Box
            component="img"
            src={getItemImage(recipe.result.name)}
            onMouseEnter={resultTPOpen}
            onMouseLeave={resultTPClose}
            sx={{
              height: 'auto',
              width: '100%',
              objectFit: 'contain',
            }}
          />
        </Box>

        <Box
          sx={{
            padding: '2%',
            flex: '0 0 78%',
            height: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'space-between',
            borderRadius: '1.5vh',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Typography
            sx={{
              overflow: 'hidden',
              flex: '0 0 35%',
              fontSize: '2.5vh',
              fontWeight: 700,
              display: 'flex',
              justifyContent: 'flex-start',
              alignItems: 'center',
              color: getRarityColor(craftItemData.rarity),
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {craftItemData.label}
          </Typography>

          <Box sx={{ flex: '0 0 15%' }} />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: '0 0 25%',
            }}
          >
            <Typography
              sx={{
                color: 'white',
                marginRight: '0.5vh',
                fontWeight: 700,
                fontSize: '1.5vh',
              }}
            >
              Yield:
            </Typography>
            <Typography
              sx={{
                color: getRarityColor(craftItemData.rarity),
                fontWeight: 700,
                fontSize: '1.5vh',
              }}
            >
              {recipe.result.count * qty}pcs
            </Typography>
          </Box>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: '0 0 25%',
            }}
          >
            <Typography
              sx={{
                color: 'white',
                marginRight: '0.5vh',
                fontWeight: 700,
                fontSize: '1.5vh',
              }}
            >
              Crafting Time:
            </Typography>
            <Typography
              sx={{
                color: getRarityColor(craftItemData.rarity),
                fontWeight: 700,
                fontSize: '1.5vh',
              }}
            >
              {recipe.time > 0 ? `${(recipe.time * qty) / 1000}sec` : 'Instant'}
            </Typography>
          </Box>

          {Boolean(recipe.cooldown) && Boolean(cooldown) && cooldown! > Date.now() && (
            <Typography
              sx={{
                color: 'white',
                marginRight: '0.5vh',
                fontWeight: 700,
                fontSize: '1.5vh',
              }}
            >
              Craft Available in {Math.ceil((cooldown! - Date.now()) / 1000)}s
            </Typography>
          )}
        </Box>
      </Box>

      {/* Middle Container */}
      <Box
        sx={{
          flex: '0 0 65%',
          width: '100%',
          paddingTop: '4%',
          display: 'flex',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            backgroundColor: 'rgba(0, 18, 28, 0.5)',
            borderRadius: '1.25vh',
            padding: '2%',
            height: 'auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Typography
            sx={{
              display: 'flex',
              flex: '0 0 15%',
              fontSize: '2vh',
              fontWeight: 800,
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            }}
          >
            Items Required
          </Typography>

          <Box
            sx={{
              flex: '1 1 auto',
              overflow: 'auto',
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 15%)',
              justifyContent: 'center',
              gap: '3vh',
              gridAutoRows: 'max-content',
            }}
          >
            {recipe.items.map((item, k) => (
              <Reagent key={`${recipe.id}-${index}-ing-${k}`} item={item} qty={qty} />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Bottom Container */}
      <Box
        sx={{
          flex: '0 0 10%',
          width: '100%',
          paddingTop: '2%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            flex: '0 0 15%',
            boxShadow: 'inset 0 0 4vh rgba(48, 48, 48, 0.8)',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
            borderRadius: '1.25vh',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-evenly',
              width: '100%',
            }}
          >
            <IconButton
              disabled={Boolean(recipe.cooldown) || qty <= 1}
              onClick={() => onQtyChange(-1)}
              sx={{ fontSize: '1.5vh' }}
            >
              <Remove />
            </IconButton>

            <Typography sx={{ textAlign: 'center', fontSize: '2vh', width: '75%' }}>
              {qty}
            </Typography>

            <IconButton
              disabled={Boolean(recipe.cooldown) || qty >= 99}
              onClick={() => onQtyChange(1)}
              sx={{ fontSize: '1.5vh' }}
            >
              <Add />
            </IconButton>
          </Box>
        </Box>

        <Box
          sx={{
            flex: '0 0 83%',
            height: '100%',
            display: 'flex',
            justifyContent: 'space-evenly',
            alignItems: 'center',
          }}
        >
          {Boolean(crafting) && crafting!.recipe === recipe.id && recipe.time > 0 ? (
            <Button
              disabled={!Boolean(crafting)}
              onClick={cancel}
              sx={{
                width: '100%',
                height: '100%',
                color: 'white',
                fontWeight: 600,
                boxShadow: 'inset 0 0 4vh rgba(110, 9, 9, 0.8)',
                borderRadius: '1.25vh',
                textTransform: 'none',
                display: 'flex',
                justifyContent: 'center',
                fontSize: '1.5vh',
                '&:hover': {
                  backgroundColor: 'rgba(110, 9, 9, 0.5)',
                },
              }}
            >
              Cancel
            </Button>
          ) : (
            <Button
              onClick={craft}
              disabled={
                Boolean(crafting) ||
                !hasReagents() ||
                (Boolean(recipe.cooldown) && Boolean(cooldown) && cooldown! > Date.now())
              }
              sx={{
                width: '100%',
                height: '100%',
                color: 'white',
                fontWeight: 600,
                boxShadow:
                  Boolean(crafting) ||
                  !hasReagents() ||
                  (Boolean(recipe.cooldown) && Boolean(cooldown) && cooldown! > Date.now())
                    ? 'inset 0 0 4vh rgba(48, 48, 48, 0.8)'
                    : 'inset 0 0 4vh rgba(2, 191, 0, 0.8)',
                borderRadius: '1.25vh',
                textTransform: 'none',
                display: 'flex',
                justifyContent: 'center',
                fontSize: '1.5vh',
                '&:hover': {
                  backgroundColor:
                    Boolean(crafting) ||
                    !hasReagents() ||
                    (Boolean(recipe.cooldown) && Boolean(cooldown) && cooldown! > Date.now())
                      ? 'transparent'
                      : 'rgba(1, 77, 0, 0.8)',
                },
              }}
            >
              {Boolean(crafting) || !hasReagents() ? 'Cannot Craft' : 'Craft'}
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};
