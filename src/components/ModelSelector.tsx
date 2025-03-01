import React, { useState } from 'react';
import { 
  Box, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Chip, 
  Typography, 
  Tooltip, 
  Paper, 
  alpha,
  IconButton,
  Collapse
} from '@mui/material';
import { LLMModel } from '../types';
import TuneIcon from '@mui/icons-material/Tune';
import { ModelSettings } from './ModelSettings';

// Provider icons
import SvgIcon from '@mui/material/SvgIcon';

interface ModelSelectorProps {
  models: LLMModel[];
  selectedModelId: string;
  maxTokens: number;
  temperature: number;
  onModelChange: (modelId: string) => void;
  onMaxTokensChange: (tokens: number) => void;
  onTemperatureChange: (temp: number) => void;
}

// Provider icon components
const OpenAIIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.5091-2.6067-1.4998z" />
  </SvgIcon>
);

const AnthropicIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M12 1.5C6.2 1.5 1.5 6.2 1.5 12S6.2 22.5 12 22.5 22.5 17.8 22.5 12 17.8 1.5 12 1.5zM4.5 12c0-4.1 3.4-7.5 7.5-7.5 1.6 0 3.1.5 4.3 1.4L6.6 16.4c-1.3-1.2-2.1-2.9-2.1-4.7zm7.5 7.5c-1.8 0-3.4-.6-4.7-1.7l9.7-10.5c1.5 1.2 2.4 3.1 2.4 5.2-.1 4.1-3.4 7.5-7.5 7.5z" />
  </SvgIcon>
);

const AmazonIcon = (props: any) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M15.4 13.5c-.24.22-.52.37-.81.49-.3.12-.63.18-.98.18-.35 0-.67-.07-.96-.21-.3-.14-.55-.33-.75-.58-.21-.25-.36-.55-.47-.89-.11-.34-.16-.74-.16-1.18 0-.46.05-.87.16-1.21.11-.34.26-.64.48-.89.21-.24.47-.43.77-.56.3-.13.64-.2 1.02-.2.32 0 .61.04.87.13.26.09.49.22.68.39.19.17.34.39.46.64.11.26.19.56.22.9h-1.43c-.05-.31-.15-.54-.32-.7-.17-.15-.39-.23-.66-.23-.45 0-.77.17-.97.52-.2.35-.3.83-.3 1.4 0 .52.1.94.3 1.28.2.33.49.5.89.5.11 0 .22-.01.32-.04.1-.03.2-.07.28-.12.09-.05.16-.12.22-.2.06-.08.11-.17.14-.28h1.43c-.04.17-.12.34-.23.51-.11.17-.24.33-.41.46zm3.9-4.4v.96h-.05c-.05-.15-.14-.29-.26-.43-.12-.14-.26-.26-.44-.36-.18-.1-.37-.18-.59-.24-.22-.05-.44-.08-.68-.08-.39 0-.73.07-1.03.2-.3.14-.56.32-.77.55-.21.24-.37.53-.49.86-.11.34-.17.7-.17 1.11 0 .39.05.74.16 1.08.1.34.26.64.47.89.21.25.47.45.78.59.31.14.67.22 1.07.22.26 0 .5-.03.73-.1.22-.07.42-.16.59-.27.17-.11.31-.24.42-.38.11-.14.2-.28.25-.43h.06v.99h1.43v-5.16h-1.48zm-.07 2.42c0 .22-.04.42-.12.61-.08.18-.19.34-.32.47-.14.13-.3.23-.49.3-.19.07-.4.11-.63.11-.22 0-.42-.04-.6-.13-.18-.09-.33-.21-.46-.36-.13-.15-.22-.33-.29-.53-.07-.2-.1-.42-.1-.64 0-.24.03-.46.1-.66.07-.2.17-.38.3-.52.13-.14.29-.26.47-.34.18-.08.38-.12.6-.12.24 0 .44.04.63.11.19.07.35.18.48.31.13.13.24.3.31.48.07.19.11.39.11.61zm-14.26-2.8c-.05-.15-.14-.29-.26-.43-.12-.14-.26-.26-.44-.36-.18-.1-.37-.18-.59-.24-.22-.05-.44-.08-.67-.08-.39 0-.73.07-1.03.2-.3.14-.56.32-.77.55-.21.24-.37.53-.49.86-.11.34-.17.7-.17 1.11 0 .39.05.74.16 1.08.1.34.26.64.47.89.21.25.47.45.78.59.31.14.67.22 1.07.22.26 0 .5-.03.73-.1.22-.07.42-.16.59-.27.17-.11.31-.24.42-.38.11-.14.2-.28.25-.43h.06v.99h1.43v-5.16h-1.49v.96h-.05zm0 1.84c0 .22-.04.42-.12.61-.08.18-.19.34-.32.47-.14.13-.3.23-.49.3-.19.07-.4.11-.63.11-.22 0-.42-.04-.6-.13-.18-.09-.33-.21-.46-.36-.13-.15-.22-.33-.29-.53-.07-.2-.1-.42-.1-.64 0-.24.03-.46.1-.66.07-.2.17-.38.3-.52.13-.14.29-.26.47-.34.18-.08.38-.12.6-.12.24 0 .44.04.63.11.19.07.35.18.48.31.13.13.24.3.31.48.07.19.11.39.11.61zm-5.36 1.32c.16-.11.27-.23.35-.36.08-.13.12-.27.12-.41 0-.15-.03-.27-.08-.36-.06-.1-.13-.18-.23-.26-.1-.08-.21-.14-.35-.2-.14-.06-.28-.11-.45-.17-.09-.03-.17-.06-.24-.09-.07-.03-.13-.07-.17-.11-.04-.04-.07-.09-.09-.15-.02-.06-.03-.12-.03-.2 0-.2.06-.34.17-.43.11-.09.28-.14.5-.14.16 0 .3.04.41.11.11.07.18.19.2.36h1.38c-.05-.43-.22-.77-.51-1.01-.29-.24-.7-.37-1.23-.37-.25 0-.5.03-.72.09-.22.06-.42.15-.58.28-.17.12-.3.28-.4.47-.1.19-.15.41-.15.67 0 .25.05.45.14.62.1.17.22.31.38.43.15.11.33.21.53.28.2.08.4.14.59.21.07.03.15.06.23.09.08.03.16.07.22.12.07.04.12.1.16.17.04.07.06.15.06.25 0 .09-.02.17-.05.24-.03.08-.08.14-.14.2-.06.06-.13.1-.22.13-.08.03-.18.05-.29.05-.13 0-.24-.02-.33-.06-.1-.04-.17-.09-.23-.15-.06-.06-.11-.13-.13-.21-.03-.08-.04-.16-.04-.24H2c0 .22.04.42.11.61.07.19.18.35.33.49.15.14.33.25.55.33.22.08.48.12.77.12.26 0 .51-.03.74-.1.22-.06.42-.16.59-.29zm15.97.57h-1.52v-5.16h1.52v5.16z" />
  </SvgIcon>
);

export const ModelSelector: React.FC<ModelSelectorProps> = ({ 
  models, 
  selectedModelId,
  maxTokens,
  temperature,
  onModelChange,
  onMaxTokensChange,
  onTemperatureChange
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const selectedModel = models.find((model) => model.id === selectedModelId);
  
  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai':
        return <OpenAIIcon fontSize="small" />;
      case 'anthropic':
        return <AnthropicIcon fontSize="small" />;
      case 'amazon':
        return <AmazonIcon fontSize="small" />;
      default:
        return null;
    }
  };
  
  return (
    <Box sx={{ minWidth: 200 }}>
      <FormControl fullWidth size="small">
        <InputLabel id="model-select-label">Model</InputLabel>
        <Select
          labelId="model-select-label"
          id="model-select"
          value={selectedModelId}
          label="Model"
          onChange={(e) => onModelChange(e.target.value)}
          sx={{ 
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px'
            } 
          }}
          renderValue={(selected) => {
            const model = models.find((m) => m.id === selected);
            if (!model) return selected;
            
            return (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {getProviderIcon(model.provider)}
                <Typography variant="body2">{model.name}</Typography>
              </Box>
            );
          }}
        >
          {models.map((model) => (
            <MenuItem 
              key={model.id} 
              value={model.id}
              sx={{ 
                borderRadius: '8px',
                mx: 0.5,
                my: 0.5,
                '&:hover': {
                  backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.08)
                }
              }}
            >
              <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  {getProviderIcon(model.provider)}
                  <Typography variant="body1" sx={{ ml: 1 }}>{model.name}</Typography>
                </Box>
                <Typography variant="caption" color="text.secondary">
                  {model.description}
                </Typography>
                <Box sx={{ mt: 1, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {model.capabilities.map((cap) => (
                    <Chip
                      key={cap}
                      label={cap}
                      size="small"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  ))}
                </Box>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {selectedModel && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
            <Tooltip
              title={
                <Box>
                  <Typography variant="body2">{selectedModel.description}</Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Max tokens: {selectedModel.maxTokens.toLocaleString()}
                  </Typography>
                  <Box sx={{ mt: 1 }}>
                    {selectedModel.capabilities.map((cap) => (
                      <Chip
                        key={cap}
                        label={cap}
                        size="small"
                        variant="outlined"
                        sx={{ mr: 0.5, mt: 0.5, height: 20, fontSize: '0.7rem' }}
                      />
                    ))}
                  </Box>
                </Box>
              }
              placement="top"
            >
              <Paper
                elevation={0}
                sx={{
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.1)',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: '12px',
                  cursor: 'help',
                  flex: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {getProviderIcon(selectedModel.provider)}
                  <Typography variant="caption" sx={{ ml: 1 }}>
                    Max: {selectedModel.maxTokens.toLocaleString()} tokens
                  </Typography>
                </Box>
              </Paper>
            </Tooltip>
            
            <Tooltip title="Model settings">
              <IconButton 
                onClick={() => setShowSettings(!showSettings)}
                sx={{ 
                  ml: 1,
                  backgroundColor: showSettings ? 'rgba(79, 70, 229, 0.2)' : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:hover': {
                    backgroundColor: 'rgba(79, 70, 229, 0.2)',
                  }
                }}
              >
                <TuneIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          
          <Collapse in={showSettings} timeout={300} sx={{ mt: 2 }}>
            <ModelSettings
              currentMaxTokens={maxTokens}
              currentTemperature={temperature}
              defaultMaxTokens={selectedModel.defaultTokens || 4096}
              defaultTemperature={selectedModel.defaultTemperature || 0.7}
              maxPossibleTokens={selectedModel.maxTokens}
              onMaxTokensChange={onMaxTokensChange}
              onTemperatureChange={onTemperatureChange}
            />
          </Collapse>
        </>
      )}
    </Box>
  );
};