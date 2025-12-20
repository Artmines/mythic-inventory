import { useEffect, useState } from 'react';
import { Box, Button, CircularProgress, Typography, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../../shared/hooks';
import { craftingActions } from '../craftingSlice';
import { getItemImage } from '../../../shared/utils/inventory';
import { Recipe } from './Recipe';

export const Crafting = () => {
  const dispatch = useAppDispatch();
  const { itemsLoaded, items } = useAppSelector((state) => state.inventory);
  const { cooldowns, recipes, benchName, currentCraft } = useAppSelector(
    (state) => state.crafting
  );

  const [filtered, setFiltered] = useState(recipes);
  const [search] = useState('');

  useEffect(() => {
    setFiltered(
      recipes.filter((recipe) =>
        items[recipe.result.name]?.label.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, recipes, items]);

  const setCurrentCraft = (number: number) => {
    dispatch(craftingActions.setCurrentCraft(number));
  };

  if (!itemsLoaded || Object.keys(items).length === 0) {
    return (
      <Box
        sx={{
          position: 'absolute',
          width: 'fit-content',
          height: 'fit-content',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          margin: 'auto',
          textAlign: 'center',
        }}
      >
        <CircularProgress size={36} sx={{ margin: 'auto' }} />
        <Typography component="span" sx={{ display: 'block' }}>
          Loading Inventory Items
        </Typography>
        <Alert variant="outlined" severity="info" sx={{ marginTop: '20px' }}>
          If you see this for a long period of time, there may be an issue. Try restarting your
          FiveM.
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        userSelect: 'none',
        width: '100%',
        height: '100%',
        paddingTop: '11%',
        paddingBottom: '11%',
        paddingRight: '15%',
        paddingLeft: '15%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          userSelect: 'none',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Top Container */}
        <Box
          sx={{
            flex: '0 0 15%',
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
          }}
        >
          {benchName !== 'none' && (
            <Box
              sx={{
                width: '15%',
                background:
                  'radial-gradient(circle at center, rgba(46, 62, 79, 0.6) 5%, rgba(10, 14, 18, 0.6) 80%)',
                height: '60%',
                borderRadius: '0.5vh',
                display: 'flex',
                justifyContent: 'center',
                textAlign: 'center',
                alignItems: 'center',
                fontWeight: 600,
                fontSize: '2vh',
              }}
            >
              {benchName}
            </Box>
          )}
        </Box>

        {/* Bottom Container */}
        <Box
          sx={{
            flex: '0 0 85%',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            overflow: 'hidden',
          }}
        >
          {/* Left Container - Recipe Grid */}
          <Box
            sx={{
              flex: '0 0 49%',
              height: '100%',
              overflow: 'hidden',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {Boolean(filtered) && filtered.length > 0 ? (
              <Box
                sx={{
                  display: 'grid',
                  gridAutoRows: 'max-content',
                  gridTemplateColumns: 'repeat(5, 17%)',
                  justifyContent: 'space-between',
                  width: '100%',
                  maxWidth: '100%',
                  overflowX: 'hidden',
                  gap: '2vh',
                  overflowY: 'auto',
                  height: '92%',
                }}
              >
                {filtered.map((recipe, index) => {
                  const craftItemData = items[recipe.result.name];
                  if (!craftItemData) return null;

                  return (
                    <Button
                      key={`${recipe.id}-${index}`}
                      onClick={() => setCurrentCraft(index)}
                      sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: 'auto',
                        height: '100%',
                        aspectRatio: '1 / 1',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        borderRadius: '1.25vh',
                        padding: 0,
                        margin: 0,
                        flexDirection: 'column',
                        overflow: 'hidden',
                        boxShadow: 'inset 0 0 2vh rgba(0, 0, 0, 1.5)',
                        color: 'white',
                        textTransform: 'none',
                      }}
                    >
                      <Box
                        component="img"
                        src={getItemImage(recipe.result.name)}
                        sx={{
                          height: 'auto',
                          width: '50%',
                          objectFit: 'contain',
                        }}
                      />

                      <Typography
                        sx={{
                          fontSize: '1vh',
                          fontWeight: 600,
                        }}
                      >
                        {craftItemData.label}
                      </Typography>
                    </Button>
                  );
                })}
              </Box>
            ) : (
              <Typography
                sx={{
                  fontWeight: 700,
                  fontSize: '2vh',
                  padding: '3vh',
                  textAlign: 'center',
                }}
              >
                No Crafting Blueprints
              </Typography>
            )}
          </Box>

          {/* Right Container - Recipe Details */}
          {Boolean(filtered) && filtered.length > 0 && currentCraft !== null && (
            <Box sx={{ flex: '0 0 49%', height: '100%' }}>
              {filtered[currentCraft] && (
                <Recipe
                  key={`${filtered[currentCraft].id}-${currentCraft}`}
                  index={currentCraft}
                  recipe={filtered[currentCraft]}
                  cooldown={cooldowns[filtered[currentCraft].id]}
                />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
