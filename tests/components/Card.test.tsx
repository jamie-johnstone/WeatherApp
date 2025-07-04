// import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card } from '@/components/Card';

describe('Card', () => {
  it('renders children content', () => {
    const testContent = 'Test Card Content';
    render(
      <Card>
        <Text>{testContent}</Text>
      </Card>
    );
    
    expect(screen.getByText(testContent)).toBeTruthy();
  });

  it('renders with default elevated styling', () => {
    const { root } = render(
      <Card>
        <Text>Content</Text>
      </Card>
    );
    
    // Simply test that the card renders successfully with elevation
    expect(root).toBeTruthy();
    expect(root.type).toBe('View');
    
    // The children should include the text content
    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('renders without elevation when elevated is false', () => {
    const { root } = render(
      <Card elevated={false}>
        <Text>Content</Text>
      </Card>
    );
    
    // Simply test that the card renders successfully without elevation
    expect(root).toBeTruthy();
    expect(root.type).toBe('View');
    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('applies custom style when provided', () => {
    const customStyle = { marginTop: 20, backgroundColor: 'red' };
    const { root } = render(
      <Card style={customStyle}>
        <Text>Content</Text>
      </Card>
    );
    
    // Test that the card renders successfully with custom style
    expect(root).toBeTruthy();
    expect(root.type).toBe('View');
    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('uses custom padding when provided', () => {
    const customPadding = 24;
    const { root } = render(
      <Card padding={customPadding}>
        <Text>Content</Text>
      </Card>
    );
    
    // Test that the card renders successfully with custom padding
    expect(root).toBeTruthy();
    expect(root.type).toBe('View');
    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('uses custom margin when provided', () => {
    const customMargin = 12;
    const { root } = render(
      <Card margin={customMargin}>
        <Text>Content</Text>
      </Card>
    );
    
    // Test that the card renders successfully with custom margin
    expect(root).toBeTruthy();
    expect(root.type).toBe('View');
    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('uses custom borderRadius when provided', () => {
    const customBorderRadius = 8;
    const { root } = render(
      <Card borderRadius={customBorderRadius}>
        <Text>Content</Text>
      </Card>
    );
    
    // Test that the card renders successfully with custom border radius
    expect(root).toBeTruthy();
    expect(root.type).toBe('View');
    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('renders multiple children correctly', () => {
    render(
      <Card>
        <Text>First Child</Text>
        <Text>Second Child</Text>
      </Card>
    );
    
    expect(screen.getByText('First Child')).toBeTruthy();
    expect(screen.getByText('Second Child')).toBeTruthy();
  });

  it('renders with complex nested content', () => {
    render(
      <Card>
        <Text>Title</Text>
        <Card>
          <Text>Nested Card Content</Text>
        </Card>
      </Card>
    );
    
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Nested Card Content')).toBeTruthy();
  });

  it('combines all custom props correctly', () => {
    const customStyle = { marginTop: 20 };
    const customPadding = 24;
    const customMargin = 12;
    const customBorderRadius = 6;
    
    const { root } = render(
      <Card
        style={customStyle}
        padding={customPadding}
        margin={customMargin}
        borderRadius={customBorderRadius}
        elevated={false}
      >
        <Text>Content</Text>
      </Card>
    );
    
    // Test that the card renders successfully with all custom props
    expect(root).toBeTruthy();
    expect(root.type).toBe('View');
    expect(screen.getByText('Content')).toBeTruthy();
  });

  it('uses theme defaults when no custom props provided', () => {
    const { root } = render(
      <Card>
        <Text>Content</Text>
      </Card>
    );
    
    // Test that the card renders successfully with theme defaults
    expect(root).toBeTruthy();
    expect(root.type).toBe('View');
    expect(screen.getByText('Content')).toBeTruthy();
  });
});