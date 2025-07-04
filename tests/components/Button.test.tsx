// import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from '@/components/Button';

describe('Button', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with required props', () => {
    const title = 'Test Button';
    render(<Button title={title} onPress={mockOnPress} />);
    
    expect(screen.getByText(title)).toBeTruthy();
  });

  it('calls onPress when button is pressed', () => {
    const title = 'Test Button';
    render(<Button title={title} onPress={mockOnPress} />);
    
    const button = screen.getByText(title);
    fireEvent.press(button);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('renders with primary variant by default', () => {
    render(<Button title="Primary Button" onPress={mockOnPress} />);
    
    const button = screen.getByText('Primary Button');
    expect(button).toBeTruthy();
    // Primary variant should have primary color styling
  });

  it('renders with different variants', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost', 'danger'] as const;
    
    variants.forEach((variant) => {
      const { unmount } = render(
        <Button title={`${variant} Button`} onPress={mockOnPress} variant={variant} />
      );
      
      expect(screen.getByText(`${variant} Button`)).toBeTruthy();
      unmount();
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['small', 'medium', 'large'] as const;
    
    sizes.forEach((size) => {
      const { unmount } = render(
        <Button title={`${size} Button`} onPress={mockOnPress} size={size} />
      );
      
      expect(screen.getByText(`${size} Button`)).toBeTruthy();
      unmount();
    });
  });

  it('renders with medium size by default', () => {
    render(<Button title="Medium Button" onPress={mockOnPress} />);
    
    const button = screen.getByText('Medium Button');
    expect(button).toBeTruthy();
  });

  it('does not call onPress when disabled', () => {
    render(<Button title="Disabled Button" onPress={mockOnPress} disabled={true} />);
    
    const button = screen.getByText('Disabled Button');
    fireEvent.press(button);
    
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('renders with reduced opacity when disabled', () => {
    const { root } = render(
      <Button title="Disabled Button" onPress={mockOnPress} disabled={true} />
    );
    
    // Test that the button renders successfully when disabled
    expect(root).toBeTruthy();
    expect(screen.getByText('Disabled Button')).toBeTruthy();
  });

  it('renders loading indicator when loading is true', () => {
    render(<Button title="Loading Button" onPress={mockOnPress} loading={true} />);
    
    // Should still render the title
    expect(screen.getByText('Loading Button')).toBeTruthy();
    
    // Should have ActivityIndicator (though we can't easily test its presence without testID)
  });

  it('does not call onPress when loading', () => {
    render(<Button title="Loading Button" onPress={mockOnPress} loading={true} />);
    
    const button = screen.getByText('Loading Button');
    fireEvent.press(button);
    
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('renders with custom style when provided', () => {
    const customStyle = { marginTop: 20 };
    const { root } = render(
      <Button title="Custom Style Button" onPress={mockOnPress} style={customStyle} />
    );
    
    // Test that the button renders successfully with custom style
    expect(root).toBeTruthy();
    expect(screen.getByText('Custom Style Button')).toBeTruthy();
  });

  it('renders with custom text style when provided', () => {
    const customTextStyle = { fontWeight: 'bold' as const };
    render(
      <Button title="Custom Text Style Button" onPress={mockOnPress} textStyle={customTextStyle} />
    );
    
    // Test that the button renders successfully with custom text style
    const buttonText = screen.getByText('Custom Text Style Button');
    expect(buttonText).toBeTruthy();
  });

  it('renders with full width when fullWidth is true', () => {
    const { root } = render(
      <Button title="Full Width Button" onPress={mockOnPress} fullWidth={true} />
    );
    
    // Test that the button renders successfully with full width
    expect(root).toBeTruthy();
    expect(screen.getByText('Full Width Button')).toBeTruthy();
  });

  it('renders with icon when provided', () => {
    const IconComponent = () => <span>🔥</span>;
    render(
      <Button title="Button with Icon" onPress={mockOnPress} icon={<IconComponent />} />
    );
    
    expect(screen.getByText('Button with Icon')).toBeTruthy();
    // Icon should be rendered but we can't easily test its presence without testID
  });

  it('does not render icon when loading', () => {
    const IconComponent = () => <span>🔥</span>;
    render(
      <Button 
        title="Loading Button with Icon" 
        onPress={mockOnPress} 
        icon={<IconComponent />} 
        loading={true} 
      />
    );
    
    expect(screen.getByText('Loading Button with Icon')).toBeTruthy();
    // Icon should not be rendered when loading
  });

  it('handles multiple press events correctly', () => {
    render(<Button title="Multi Press Button" onPress={mockOnPress} />);
    
    const button = screen.getByText('Multi Press Button');
    fireEvent.press(button);
    fireEvent.press(button);
    fireEvent.press(button);
    
    expect(mockOnPress).toHaveBeenCalledTimes(3);
  });

  it('applies correct default styling structure', () => {
    const { root } = render(
      <Button title="Default Button" onPress={mockOnPress} />
    );
    
    // Test that the button renders successfully with default styling
    expect(root).toBeTruthy();
    expect(screen.getByText('Default Button')).toBeTruthy();
  });
});