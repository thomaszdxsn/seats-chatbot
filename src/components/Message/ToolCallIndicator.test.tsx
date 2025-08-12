/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ToolCallIndicator } from './ToolCallIndicator';

describe('ToolCallIndicator', () => {
  it('renders loading state for flight search tool', () => {
    render(
      <ToolCallIndicator 
        toolName="pointsYeahFlightSearch"
        isLoading={true}
      />
    );
    
    expect(screen.getByText('✈️')).toBeInTheDocument();
    expect(screen.getByText('Searching for flights...')).toBeInTheDocument();
  });

  it('renders completed state for flight search tool', () => {
    render(
      <ToolCallIndicator 
        toolName="pointsYeahFlightSearch"
        isCompleted={true}
      />
    );
    
    expect(screen.getByText('✈️')).toBeInTheDocument();
    expect(screen.getByText('Flight search completed')).toBeInTheDocument();
  });

  it('renders loading state for hotel search tool', () => {
    render(
      <ToolCallIndicator 
        toolName="pointsYeahHotelSearch"
        isLoading={true}
      />
    );
    
    expect(screen.getByText('🏨')).toBeInTheDocument();
    expect(screen.getByText('Searching for hotels...')).toBeInTheDocument();
  });

  it('renders completed state for hotel search tool', () => {
    render(
      <ToolCallIndicator 
        toolName="pointsYeahHotelSearch"
        isCompleted={true}
      />
    );
    
    expect(screen.getByText('🏨')).toBeInTheDocument();
    expect(screen.getByText('Hotel search completed')).toBeInTheDocument();
  });

  it('renders loading state for datetime calculator tool', () => {
    render(
      <ToolCallIndicator 
        toolName="datetimeCalculator"
        isLoading={true}
      />
    );
    
    expect(screen.getByText('🧮')).toBeInTheDocument();
    expect(screen.getByText('Calculating datetime...')).toBeInTheDocument();
  });

  it('renders completed state for datetime calculator tool', () => {
    render(
      <ToolCallIndicator 
        toolName="datetimeCalculator"
        isCompleted={true}
      />
    );
    
    expect(screen.getByText('🧮')).toBeInTheDocument();
    expect(screen.getByText('Datetime calculation completed')).toBeInTheDocument();
  });

  it('renders default state for unknown tool', () => {
    render(
      <ToolCallIndicator 
        toolName="unknownTool"
        isCompleted={true}
      />
    );
    
    expect(screen.getByText('🔧')).toBeInTheDocument();
    expect(screen.getByText('Tool execution completed')).toBeInTheDocument();
  });

  it('applies correct CSS classes for loading state', () => {
    const { container } = render(
      <ToolCallIndicator 
        toolName="pointsYeahFlightSearch"
        isLoading={true}
      />
    );
    
    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('bg-blue-50', 'dark:bg-blue-900/20', 'border-blue-300');
  });

  it('applies correct CSS classes for completed state', () => {
    const { container } = render(
      <ToolCallIndicator 
        toolName="pointsYeahFlightSearch"
        isCompleted={true}
      />
    );
    
    const indicator = container.firstChild as HTMLElement;
    expect(indicator).toHaveClass('bg-green-50', 'dark:bg-green-900/20', 'border-green-300');
  });
});