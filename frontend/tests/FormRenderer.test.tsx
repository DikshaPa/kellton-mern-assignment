import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FormRenderer from '../src/components/FormRenderer/FormRenderer';

const mockSchema = {
  title: 'Test Form',
  fields: [
    {
      fieldName: 'name',
      label: 'Name',
      type: 'text' as const,
      validation: { required: true }
    },
    {
      fieldName: 'role',
      label: 'Role',
      type: 'select' as const,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' }
      ]
    },
    {
      fieldName: 'active',
      label: 'Active',
      type: 'boolean' as const
    }
  ]
};

describe('FormRenderer', () => {
  it('renders form fields correctly', () => {
    const mockSubmit = jest.fn();
    
    render(
      <FormRenderer
        schema={mockSchema}
        onSubmit={mockSubmit}
      />
    );

    expect(screen.getByText('Test Form')).toBeInTheDocument();
    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeInTheDocument();
    expect(screen.getByLabelText('Active')).toBeInTheDocument();
  });

  it('validates required fields', () => {
    const mockSubmit = jest.fn();
    
    render(
      <FormRenderer
        schema={mockSchema}
        onSubmit={mockSubmit}
      />
    );

    fireEvent.click(screen.getByText('Save'));
    
    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('submits form with valid data', () => {
    const mockSubmit = jest.fn();
    
    render(
      <FormRenderer
        schema={mockSchema}
        onSubmit={mockSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'Test User' }
    });

    fireEvent.click(screen.getByText('Save'));
    
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'Test User'
    });
  });
});