import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  TextField,
  Button,
  Tooltip,
  alpha,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface ModelSettingsProps {
  currentMaxTokens: number;
  currentTemperature: number;
  defaultMaxTokens: number;
  defaultTemperature: number;
  maxPossibleTokens: number;
  onMaxTokensChange: (tokens: number) => void;
  onTemperatureChange: (temp: number) => void;
}

export const ModelSettings: React.FC<ModelSettingsProps> = ({
  currentMaxTokens,
  currentTemperature,
  defaultMaxTokens,
  defaultTemperature,
  maxPossibleTokens,
  onMaxTokensChange,
  onTemperatureChange,
}) => {
  const handleTemperatureChange = (_event: Event, newValue: number | number[]) => {
    onTemperatureChange(newValue as number);
  };

  const handleMaxTokensChange = (_event: Event, newValue: number | number[]) => {
    onMaxTokensChange(newValue as number);
  };

  const handleMaxTokensInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (!isNaN(value) && value >= 0 && value <= maxPossibleTokens) {
      onMaxTokensChange(value);
    }
  };

  const handleReset = () => {
    onMaxTokensChange(defaultMaxTokens);
    onTemperatureChange(defaultTemperature);
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="subtitle1">Model Settings</Typography>
        <Tooltip title="Reset to defaults">
          <Button
            size="small"
            startIcon={<RestartAltIcon />}
            onClick={handleReset}
            sx={{
              borderRadius: '8px',
              backgroundColor: 'rgba(79, 70, 229, 0.1)',
              '&:hover': {
                backgroundColor: 'rgba(79, 70, 229, 0.2)',
              }
            }}
          >
            Reset
          </Button>
        </Tooltip>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2">Temperature: {currentTemperature.toFixed(1)}</Typography>
          <Typography variant="caption" color="text.secondary">
            {currentTemperature === 0 ? 'Deterministic' : currentTemperature >= 0.7 ? 'Creative' : 'Balanced'}
          </Typography>
        </Box>
        <Slider
          value={currentTemperature}
          onChange={handleTemperatureChange}
          step={0.1}
          min={0}
          max={1}
          marks={[
            { value: 0, label: '0' },
            { value: 0.5, label: '0.5' },
            { value: 1, label: '1' },
          ]}
          sx={{
            color: 'primary.main',
            '& .MuiSlider-thumb': {
              width: 12,
              height: 12,
              backgroundColor: '#fff',
              '&:hover, &.Mui-focusVisible': {
                boxShadow: '0px 0px 0px 8px rgba(79, 70, 229, 0.2)',
              },
            },
            '& .MuiSlider-rail': {
              opacity: 0.5,
            },
          }}
        />
      </Box>

      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2">Max Tokens: {currentMaxTokens.toLocaleString()}</Typography>
          <Typography variant="caption" color="text.secondary">
            {Math.round((currentMaxTokens / maxPossibleTokens) * 100)}% of limit
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Slider
            value={currentMaxTokens}
            onChange={handleMaxTokensChange}
            min={0}
            max={maxPossibleTokens}
            step={100}
            sx={{
              color: 'primary.main',
              flexGrow: 1,
              '& .MuiSlider-thumb': {
                width: 12,
                height: 12,
                backgroundColor: '#fff',
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0px 0px 0px 8px rgba(79, 70, 229, 0.2)',
                },
              },
              '& .MuiSlider-rail': {
                opacity: 0.5,
              },
            }}
          />
          <TextField
            value={currentMaxTokens}
            onChange={handleMaxTokensInputChange}
            type="number"
            variant="outlined"
            size="small"
            inputProps={{
              min: 0,
              max: maxPossibleTokens,
              step: 100,
            }}
            sx={{
              width: 100,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: alpha('#FFF', 0.05),
              },
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            Max possible: {maxPossibleTokens.toLocaleString()}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};