import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TableRenderer from '../src/components/TableRenderer/TableRenderer';

const mockConfig = {
  headers: [
    { label: 'Name', fieldName: 'name', sortable: true },
    { label: 'Email', fieldName: 'email' },
    { label: 'Status', fieldName: 'isActive' }
  ],
  data: [
    { _id: '1', name: 'John Doe', email: 'john@example.com', isActive: true },
    { _id: '2', name: 'Jane Smith', email: 'jane@example.com', isActive: false }
  ],
  onEditClick: jest.fn(),
  onDeleteClick: jest.fn()
};

describe('TableRenderer', () => {
  it('renders table with data correctly', () => {
    render(<TableRenderer config={mockConfig} />);

    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Email')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@example.com')).toBeInTheDocument();
  });

  it('handles sorting correctly', () => {
    render(<TableRenderer config={mockConfig} />);

    const nameHeader = screen.getByText('Name');
    fireEvent.click(nameHeader);

    // Check if sorting is applied (Jane should come before John)
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Jane Smith');
  });

  it('calls edit and delete handlers', () => {
    render(<TableRenderer config={mockConfig} />);

    const editButtons = screen.getAllByLabelText(/edit/i);
    const deleteButtons = screen.getAllByLabelText(/delete/i);

    fireEvent.click(editButtons[0]);
    expect(mockConfig.onEditClick).toHaveBeenCalledWith(mockConfig.data[0]);

    fireEvent.click(deleteButtons[0]);
    expect(mockConfig.onDeleteClick).toHaveBeenCalledWith(mockConfig.data[0]);
  });

  it('renders status chips correctly', () => {
    render(<TableRenderer config={mockConfig} />);

    expect(screen.getByText('Active')).toBeInTheDocument();
    expect(screen.getByText('Inactive')).toBeInTheDocument();
  });
});