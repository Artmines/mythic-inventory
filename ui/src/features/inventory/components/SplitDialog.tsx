import { useState } from 'react';
import {
  Menu,
  MenuItem,
  TextField,
  ButtonGroup,
  Button,
  Box,
  Fade,
} from '@mui/material';
import type { InventoryItem } from '../../../shared/types';

interface SplitDialogProps {
  open: boolean;
  item: InventoryItem | null;
  anchorPosition: { x: number; y: number };
  onClose: () => void;
  onSplit: (amount: number) => void;
}

export const SplitDialog = ({
  open,
  item,
  anchorPosition,
  onClose,
  onSplit,
}: SplitDialogProps) => {
  const [amount, setAmount] = useState<number>(item ? Math.ceil(item.Count / 2) : 1);

  if (!item) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 1;
    setAmount(Math.max(1, Math.min(value, item.Count)));
  };

  const handleQuickSet = (value: number) => {
    setAmount(Math.max(1, Math.min(value, item.Count)));
  };

  const handleDrag = () => {
    onSplit(amount);
    setAmount(Math.ceil(item.Count / 2));
  };

  return (
    <Menu
      open={open}
      onClose={onClose}
      onContextMenu={(e) => {
        e.preventDefault();
        onClose();
      }}
      anchorReference="anchorPosition"
      anchorPosition={{ top: anchorPosition.y, left: anchorPosition.x }}
      TransitionComponent={Fade}
    >
      <MenuItem disabled>Split Stack</MenuItem>
      <Box sx={{ p: 2, minWidth: '200px' }}>
        <TextField
          fullWidth
          type="number"
          value={amount}
          onChange={handleChange}
          inputProps={{
            min: 1,
            max: item.Count,
          }}
          sx={{ mb: 2 }}
        />
        <ButtonGroup variant="contained" fullWidth sx={{ mb: 2 }}>
          <Button onClick={() => handleQuickSet(1)}>1</Button>
          <Button onClick={() => handleQuickSet(Math.ceil(item.Count / 2))}>½</Button>
          <Button onClick={() => handleQuickSet(item.Count)}>All</Button>
        </ButtonGroup>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleDrag}
          sx={{
            background: 'rgba(12,24,38, 0.733)',
            border: '1px solid transparent',
            transition: 'border ease-in 0.15s',
            '&:hover': {
              background: 'rgba(12,24,38, 0.733)',
              borderColor: 'primary.main',
            },
          }}
        >
          Drag {amount}
        </Button>
      </Box>
    </Menu>
  );
};
