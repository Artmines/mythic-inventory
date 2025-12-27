import { useEffect, useState, useMemo, useRef, memo } from 'react';
import { Box, Typography } from '@mui/material';
import { useAppSelector } from '../../../shared/hooks';
import { getItemImage } from '../../../shared/utils/inventory';
import { lua2json } from '../../../shared/utils/lua';
import { rarityColors } from '../../../styles/theme';

const HoverSlotComponent = () => {
  const { hover, items } = useAppSelector((state) => state.inventory);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | undefined>(undefined);
  const posRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          setMousePos({ x: posRef.current.x, y: posRef.current.y });
          rafRef.current = undefined;
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const itemData = hover ? items[hover.Name] : null;

  const metadata = useMemo(() => {
    if (!hover?.MetaData) return {};
    return typeof hover.MetaData === 'string' ? lua2json(hover.MetaData) : hover.MetaData;
  }, [hover?.MetaData]);

  if (!hover || !itemData) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: mousePos.y,
        left: mousePos.x,
        transform: 'translate(-50%, -50%)',
        width: '125px',
        height: '125px',
        background: 'rgba(17, 49, 80, 0.9)',
        border: `2px solid ${rarityColors[itemData.rarity]}`,
        borderRadius: '6px',
        pointerEvents: 'none',
        zIndex: 9999,
        transition: 'none',
      }}
    >
      <Box
        sx={{
          height: '100%',
          width: '100%',
          backgroundImage: `url(${getItemImage(
            metadata.CustomItemImage || hover.Name
          )})`,
          backgroundSize: '55%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
        }}
      />

      {hover.Count > 1 && (
        <Typography
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            padding: '0 5px',
            fontSize: '14px',
            fontWeight: 'bold',
            zIndex: 4,
            textShadow: '0 0 4px rgba(0,0,0,0.8)',
          }}
        >
          {hover.Count}
        </Typography>
      )}

      <Typography
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          textAlign: 'center',
          padding: '2px 5px',
          fontSize: '12px',
          background: 'rgba(12,24,38, 0.9)',
          borderTop: '1px solid rgb(255 255 255 / 4%)',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          textOverflow: 'ellipsis',
          zIndex: 4,
        }}
      >
        {metadata.CustomItemLabel || itemData.label}
      </Typography>
    </Box>
  );
};

// Memoize component to prevent unnecessary re-renders from parent
export const HoverSlot = memo(HoverSlotComponent);
