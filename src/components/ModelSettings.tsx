import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Slider,
  TextField,
  Button,
  Tooltip,
  alpha,
  Collapse,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TuneIcon from '@mui/icons-material/Tune';
import { ParameterPreset } from '../types';
import { parameterPresets } from '../utils/store';

interface ModelSettingsProps {
  currentMaxTokens: number;
  currentTemperature: number;
  currentTopP: number;
  currentFrequencyPenalty: number;
  currentPresencePenalty: number;
  defaultMaxTokens: number;
  defaultTemperature: number;
  maxPossibleTokens: number;
  onMaxTokensChange: (tokens: number) => void;
  onTemperatureChange: (temp: number) => void;
  onTopPChange: (value: number) => void;
  onFrequencyPenaltyChange: (value: number) => void;
  onPresencePenaltyChange: (value: number) => void;
  onApplyPreset: (preset: ParameterPreset) => void;
}

export const ModelSettings: React.FC<ModelSettingsProps> = ({
  currentMaxTokens,
  currentTemperature,
  currentTopP,
  currentFrequencyPenalty,
  currentPresencePenalty,
  defaultMaxTokens,
  defaultTemperature,
  maxPossibleTokens,
  onMaxTokensChange,
  onTemperatureChange,
  onTopPChange,
  onFrequencyPenaltyChange,
  onPresencePenaltyChange,
  onApplyPreset,
}) => {
  // UI state
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  // Handlers for parameter changes
  const handleTemperatureChange = (_event: Event, newValue: number | number[]) => {
    onTemperatureChange(newValue as number);
    setSelectedPreset(null); // Clear preset selection when manually changing parameters
  };

  const handleTopPChange = (_event: Event, newValue: number | number[]) => {
    onTopPChange(newValue as number);
    setSelectedPreset(null);
  };

  const handleFrequencyPenaltyChange = (_event: Event, newValue: number | number[]) => {
    onFrequencyPenaltyChange(newValue as number);
    setSelectedPreset(null);
  };

  const handlePresencePenaltyChange = (_event: Event, newValue: number | number[]) => {
    onPresencePenaltyChange(newValue as number);
    setSelectedPreset(null);
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

  const handlePresetSelect = (presetName: string) => {
    const preset = parameterPresets.find(p => p.name === presetName);
    if (preset) {
      onApplyPreset(preset);
      setSelectedPreset(presetName);
    }
  };

  const handleReset = () => {
    onMaxTokensChange(defaultMaxTokens);
    onTemperatureChange(defaultTemperature);
    onTopPChange(0.95);
    onFrequencyPenaltyChange(0);
    onPresencePenaltyChange(0);
    setSelectedPreset(null);
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
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 0.5 }}>
            Model Settings
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Current settings: Temperature {currentTemperature.toFixed(1)}, Max tokens {currentMaxTokens.toLocaleString()}
          </Typography>
        </Box>
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

      {/* Parameter Presets */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" fontWeight="medium" sx={{ mb: 1.5 }}>
          Parameter Presets
        </Typography>
        <ToggleButtonGroup
          value={selectedPreset}
          exclusive
          onChange={(_, value) => value && handlePresetSelect(value)}
          aria-label="parameter presets"
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          {parameterPresets.map((preset) => (
            <ToggleButton 
              key={preset.name} 
              value={preset.name}
              sx={{
                borderRadius: '12px',
                py: 0.75,
                px: 1.5,
                border: '1px solid',
                borderColor: 'divider',
                minWidth: 'auto',
                flexGrow: 1,
                textTransform: 'none',
                '&.Mui-selected': {
                  backgroundColor: alpha('#4f46e5', 0.1),
                  borderColor: alpha('#4f46e5', 0.5),
                  color: 'primary.main',
                  fontWeight: 'bold',
                },
              }}
            >
              {preset.name}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        
        {selectedPreset && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {parameterPresets.find(p => p.name === selectedPreset)?.description}
          </Typography>
        )}
      </Box>

      <Divider sx={{ my: 2, opacity: 0.6 }} />

      {/* Basic Settings */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" fontWeight="medium">Temperature: {currentTemperature.toFixed(1)}</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 'medium' }}>
            {currentTemperature <= 0.3 ? 'Deterministic' : 
             currentTemperature <= 0.7 ? 'Balanced' : 
             currentTemperature <= 0.9 ? 'Creative' : 'Very Creative'}
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

      <Box sx={{ mb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="body2" fontWeight="medium">Max Tokens: {currentMaxTokens.toLocaleString()}</Typography>
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

      {/* Advanced Settings Toggle */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 1 }}>
        <Button
          variant="text"
          size="small"
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          endIcon={
            <ExpandMoreIcon
              sx={{
                transform: showAdvancedSettings ? 'rotate(180deg)' : 'rotate(0)',
                transition: 'transform 0.3s',
              }}
            />
          }
          startIcon={<TuneIcon fontSize="small" />}
          sx={{ 
            textTransform: 'none',
            borderRadius: '10px',
            py: 0.75,
            backgroundColor: alpha('#4f46e5', 0.05),
            '&:hover': {
              backgroundColor: alpha('#4f46e5', 0.1),
            }
          }}
        >
          {showAdvancedSettings ? 'Hide Advanced Settings' : 'Show Advanced Settings'}
        </Button>
      </Box>

      {/* Advanced Settings */}
      <Collapse in={showAdvancedSettings} timeout={300}>
        <Box sx={{ mt: 2, px: 1 }}>
          <Divider sx={{ mb: 2, opacity: 0.6 }} />

          {/* Top-P Sampling */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" fontWeight="medium">Top-P: {currentTopP.toFixed(2)}</Typography>
            </Box>
            <Slider
              value={currentTopP}
              onChange={handleTopPChange}
              step={0.01}
              min={0.01}
              max={1}
              marks={[
                { value: 0.01, label: '0.01' },
                { value: 0.5, label: '0.5' },
                { value: 1, label: '1.0' },
              ]}
              sx={{
                color: 'primary.main',
                '& .MuiSlider-thumb': { width: 12, height: 12, backgroundColor: '#fff' },
                '& .MuiSlider-rail': { opacity: 0.5 },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Controls diversity by limiting to the most likely tokens. Lower values = more focused, higher values = more diverse.
            </Typography>
          </Box>

          {/* Frequency Penalty */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" fontWeight="medium">Frequency Penalty: {currentFrequencyPenalty.toFixed(2)}</Typography>
            </Box>
            <Slider
              value={currentFrequencyPenalty}
              onChange={handleFrequencyPenaltyChange}
              step={0.1}
              min={0}
              max={2}
              marks={[
                { value: 0, label: '0' },
                { value: 1, label: '1' },
                { value: 2, label: '2' },
              ]}
              sx={{
                color: 'primary.main',
                '& .MuiSlider-thumb': { width: 12, height: 12, backgroundColor: '#fff' },
                '& .MuiSlider-rail': { opacity: 0.5 },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Reduces repetition by decreasing the chance of using words that have already appeared frequently.
            </Typography>
          </Box>

          {/* Presence Penalty */}
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" fontWeight="medium">Presence Penalty: {currentPresencePenalty.toFixed(2)}</Typography>
            </Box>
            <Slider
              value={currentPresencePenalty}
              onChange={handlePresencePenaltyChange}
              step={0.1}
              min={0}
              max={2}
              marks={[
                { value: 0, label: '0' },
                { value: 1, label: '1' },
                { value: 2, label: '2' },
              ]}
              sx={{
                color: 'primary.main',
                '& .MuiSlider-thumb': { width: 12, height: 12, backgroundColor: '#fff' },
                '& .MuiSlider-rail': { opacity: 0.5 },
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              Increases diversity by penalizing tokens that have already appeared at all in the response.
            </Typography>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};