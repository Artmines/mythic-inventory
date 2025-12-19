import { Box, LinearProgress, Typography } from '@mui/material';
import { useAppSelector } from '../../../shared/hooks';
import { normalizeInventory, calcWeight } from '../../../shared/utils/inventory';
import { Slot } from './Slot';
import { UseButton } from './UseButton';

export const Inventory = () => {
  const { player, secondary, showSecondary, items, itemsLoaded } = useAppSelector(
    (state) => state.inventory
  );

  const playerInv = normalizeInventory(player.inventory);
  const secondaryInv = normalizeInventory(secondary.inventory);

  const playerWeight = calcWeight(playerInv, items);
  const secondaryWeight = calcWeight(secondaryInv, items);

  const playerWeightPercent = player.capacity > 0 ? (playerWeight / player.capacity) * 100 : 0;
  const secondaryWeightPercent =
    secondary.capacity > 0 ? (secondaryWeight / secondary.capacity) * 100 : 0;

  if (!itemsLoaded) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <>
      <UseButton />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        <Box
          sx={{
            width: '90%',
            height: '60%',
          }}
        >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: '200px',
            userSelect: 'none',
            width: '100%',
            height: '100%',
          }}
        >
          <Box sx={{ width: '100%', maxWidth: '645px' }}>
            <Typography variant="h6" sx={{ paddingLeft: '5px', fontSize: '15px', mb: 1 }}>
              {player.name || 'Player Inventory'}
            </Typography>

            <Box sx={{ padding: '5px', position: 'relative' }}>
              <LinearProgress
                variant="determinate"
                value={Math.min(playerWeightPercent, 100)}
                sx={{
                  height: '20px',
                  borderRadius: '5px',
                  backgroundColor: '#247ba521',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor:
                      playerWeightPercent > 90
                        ? '#6e1616'
                        : playerWeightPercent > 70
                        ? '#f09348'
                        : '#0FC6A6',
                  },
                }}
              />
              <Typography
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: '2%',
                  transform: 'translateY(-50%)',
                  fontSize: '12px',
                  zIndex: 1,
                  textShadow: '0 0 10px rgba(12,24,38, 0.733)',
                }}
              >
                {playerWeight.toFixed(1)} / {player.capacity} lbs
              </Typography>
            </Box>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '1px',
                maxHeight: 'calc(60vh - 90px)',
                overflowY: 'scroll',
                minWidth: '645px',
                '&::-webkit-scrollbar': {
                  width: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#247ba59e',
                  transition: 'background ease-in 0.15s',
                  borderRadius: '0.375rem',
                  '&:hover': {
                    background: '#247ba561',
                  },
                },
                '&::-webkit-scrollbar-track': {
                  background: '#247ba521',
                  borderRadius: '0.375rem',
                },
              }}
            >
              {Array.from({ length: player.size }).map((_, index) => {
                const slotNumber = index + 1;
                const item = playerInv.find((i) => i?.Slot === slotNumber) || null;
                return (
                  <Slot
                    key={slotNumber}
                    slot={slotNumber}
                    item={item}
                    invType={player.invType}
                    owner={player.owner}
                    disabled={player.disabled[slotNumber] || false}
                  />
                );
              })}
            </Box>
          </Box>

          {showSecondary && (
            <Box sx={{ width: '100%', maxWidth: '645px' }}>
              <Typography variant="h6" sx={{ paddingLeft: '5px', fontSize: '15px', mb: 1 }}>
                {secondary.name || 'Secondary Inventory'}
              </Typography>

              <Box sx={{ padding: '5px', position: 'relative' }}>
                <LinearProgress
                  variant="determinate"
                  value={Math.min(secondaryWeightPercent, 100)}
                  sx={{
                    height: '20px',
                    borderRadius: '5px',
                    backgroundColor: '#247ba521',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor:
                        secondaryWeightPercent > 90
                          ? '#6e1616'
                          : secondaryWeightPercent > 70
                          ? '#f09348'
                          : '#0FC6A6',
                    },
                  }}
                />
                <Typography
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    right: '2%',
                    transform: 'translateY(-50%)',
                    fontSize: '12px',
                    zIndex: 1,
                    textShadow: '0 0 10px rgba(12,24,38, 0.733)',
                  }}
                >
                  {secondaryWeight.toFixed(1)} / {secondary.capacity} lbs
                </Typography>
              </Box>

              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(5, 1fr)',
                  gap: '1px',
                  maxHeight: 'calc(60vh - 90px)',
                  overflowY: 'scroll',
                  minWidth: '645px',
                  '&::-webkit-scrollbar': {
                    width: '4px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    background: '#247ba59e',
                    transition: 'background ease-in 0.15s',
                    borderRadius: '0.375rem',
                    '&:hover': {
                      background: '#247ba561',
                    },
                  },
                  '&::-webkit-scrollbar-track': {
                    background: '#247ba521',
                    borderRadius: '0.375rem',
                  },
                }}
              >
                {Array.from({ length: secondary.size }).map((_, index) => {
                  const slotNumber = index + 1;
                  const item = secondaryInv.find((i) => i?.Slot === slotNumber) || null;
                  return (
                    <Slot
                      key={slotNumber}
                      slot={slotNumber}
                      item={item}
                      invType={secondary.invType}
                      owner={secondary.owner}
                      disabled={secondary.disabled[slotNumber] || false}
                    />
                  );
                })}
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
    </>
  );
};
