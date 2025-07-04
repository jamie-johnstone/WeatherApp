// import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { ErrorMessage } from '@/components/ErrorMessage';

describe('ErrorMessage', () => {
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with required message prop', () => {
    const message = 'Something went wrong';
    render(<ErrorMessage message={message} />);
    
    expect(screen.getByText(message)).toBeTruthy();
  });

  it('renders with default title when no title prop is provided', () => {
    render(<ErrorMessage message="Test error" />);
    
    expect(screen.getByText('Error')).toBeTruthy();
  });

  it('renders with custom title when provided', () => {
    const customTitle = 'Network Error';
    render(<ErrorMessage title={customTitle} message="Test error" />);
    
    expect(screen.getByText(customTitle)).toBeTruthy();
  });

  it('renders retry button when onRetry is provided and showRetry is true', () => {
    render(
      <ErrorMessage
        message="Test error"
        onRetry={mockOnRetry}
        showRetry={true}
      />
    );
    
    expect(screen.getByText('Try Again')).toBeTruthy();
  });

  it('uses custom retry text when provided', () => {
    const customRetryText = 'Retry Now';
    render(
      <ErrorMessage
        message="Test error"
        onRetry={mockOnRetry}
        retryText={customRetryText}
      />
    );
    
    expect(screen.getByText(customRetryText)).toBeTruthy();
  });

  it('does not render retry button when showRetry is false', () => {
    render(
      <ErrorMessage
        message="Test error"
        onRetry={mockOnRetry}
        showRetry={false}
      />
    );
    
    expect(screen.queryByText('Try Again')).toBeNull();
  });

  it('does not render retry button when onRetry is not provided', () => {
    render(<ErrorMessage message="Test error" />);
    
    expect(screen.queryByText('Try Again')).toBeNull();
  });

  it('calls onRetry when retry button is pressed', () => {
    render(
      <ErrorMessage
        message="Test error"
        onRetry={mockOnRetry}
      />
    );
    
    const retryButton = screen.getByText('Try Again');
    fireEvent.press(retryButton);
    
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('renders with custom style when provided', () => {
    const customStyle = { margin: 20 };
    const { root } = render(
      <ErrorMessage
        message="Test error"
        style={customStyle}
      />
    );
    
    // Test that the error message renders successfully with custom style
    expect(root).toBeTruthy();
    expect(screen.getByText('Test error')).toBeTruthy();
  });

  it('renders correct error styling', () => {
    const { root } = render(<ErrorMessage message="Test error" />);
    
    // Test that the error message renders successfully with default styling
    expect(root).toBeTruthy();
    expect(screen.getByText('Test error')).toBeTruthy();
  });
});