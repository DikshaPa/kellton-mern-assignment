import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Button,
  Typography,
} from '@mui/material';
import { FormSchema } from '../../types';

interface FormRendererProps {
  schema: FormSchema;
  initialData?: any;
  onSubmit: (data: any) => void;
  loading?: boolean;
}

const FormRenderer: React.FC<FormRendererProps> = ({
  schema,
  initialData = {},
  onSubmit,
  loading = false,
}) => {
  const [formData, setFormData] = useState<any>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const validateField = (fieldName: string, value: any) => {
    const field = schema.fields.find(f => f.fieldName === fieldName);
    if (!field?.validation) return '';

    const { required, min, max, custom } = field.validation;

    if (required && (!value || value === '')) {
      return `${field.label} is required`;
    }

    if (min && value.length < min) {
      return `${field.label} must be at least ${min} characters`;
    }

    if (max && value.length > max) {
      return `${field.label} must be no more than ${max} characters`;
    }

    if (custom) {
      return custom(value) || '';
    }

    return '';
  };

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [fieldName]: value }));
    
    const error = validateField(fieldName, value);
    setErrors((prev: any) => ({ ...prev, [fieldName]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    schema.fields.forEach(field => {
      const error = validateField(field.fieldName, formData[field.fieldName]);
      if (error) newErrors[field.fieldName] = error;
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const renderField = (field: any) => {
    const value = formData[field.fieldName] || field.value || '';
    const error = errors[field.fieldName];

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <TextField
            key={field.fieldName}
            fullWidth
            label={field.label}
            type={field.type}
            value={value}
            onChange={(e) => handleChange(field.fieldName, e.target.value)}
            error={!!error}
            helperText={error}
            margin="normal"
          />
        );

      case 'date':
        return (
          <TextField
            key={field.fieldName}
            fullWidth
            label={field.label}
            type="date"
            value={value}
            onChange={(e) => handleChange(field.fieldName, e.target.value)}
            error={!!error}
            helperText={error}
            margin="normal"
            InputLabelProps={{
              shrink: true,
            }}
            sx={{
              '& .MuiInputBase-input': {
                padding: '16.5px 14px',
              }
            }}
          />
        );

      case 'select':
        return (
          <FormControl key={field.fieldName} fullWidth margin="normal" error={!!error}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              onChange={(e) => handleChange(field.fieldName, e.target.value)}
              label={field.label}
            >
              {field.options?.map((option: any) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <Typography variant="caption" color="error">{error}</Typography>}
          </FormControl>
        );

      case 'boolean':
        return (
          <FormControlLabel
            key={field.fieldName}
            control={
              <Switch
                checked={!!value}
                onChange={(e) => handleChange(field.fieldName, e.target.checked)}
              />
            }
            label={field.label}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Typography variant="h5" gutterBottom>
        {schema.title}
      </Typography>
      
      {schema.fields.map(renderField)}
      
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      </Box>
    </Box>
  );
};

export default FormRenderer;