import { render, screen } from '@testing-library/react';
import { LoadingIndicator } from './LoadingIndicator';

describe('LoadingIndicator', () => {
  it('should render the loading message', () => {
    render(<LoadingIndicator message="Loading test..." />);
    
    expect(screen.getByText('Loading test...')).toBeInTheDocument();
  });

  it('should render three animated dots', () => {
    render(<LoadingIndicator message="Processing..." />);
    
    const container = screen.getByText('Processing...').parentElement;
    const dots = container?.querySelectorAll('.w-2.h-2.bg-blue-400.rounded-full.animate-bounce') || [];
    
    expect(dots).toHaveLength(3);
  });

  it('should apply correct styling classes', () => {
    render(<LoadingIndicator message="Testing..." />);
    
    const messageElement = screen.getByText('Testing...');
    expect(messageElement).toHaveClass('text-blue-600');
    expect(messageElement).toHaveClass('dark:text-blue-400');
  });

  it('should apply animation delays to dots', () => {
    render(<LoadingIndicator message="Animating..." />);
    
    const container = screen.getByText('Animating...').parentElement;
    const dots = container?.querySelectorAll('.w-2.h-2.bg-blue-400.rounded-full.animate-bounce') || [];
    
    expect(dots[0]).not.toHaveStyle({ 'animation-delay': '0.1s' });
    expect(dots[1]).toHaveStyle({ 'animation-delay': '0.1s' });
    expect(dots[2]).toHaveStyle({ 'animation-delay': '0.2s' });
  });
});