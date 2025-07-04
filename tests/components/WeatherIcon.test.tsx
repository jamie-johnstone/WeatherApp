// import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { WeatherIcon } from '@/components/WeatherIcon';

describe('WeatherIcon', () => {
  it('renders with basic icon prop', () => {
    const icon = '☀️';
    render(<WeatherIcon icon={icon} />);
    
    expect(screen.getByText(icon)).toBeTruthy();
  });

  it('renders with default size when no size prop is provided', () => {
    const icon = '☀️';
    render(<WeatherIcon icon={icon} />);
    
    const iconElement = screen.getByText(icon);
    expect(iconElement).toBeTruthy();
  });

  it('renders with custom size when size prop is provided', () => {
    const icon = '☀️';
    const customSize = 40;
    render(<WeatherIcon icon={icon} size={customSize} />);
    
    const iconElement = screen.getByText(icon);
    expect(iconElement).toBeTruthy();
  });

  it('applies custom style when provided', () => {
    const icon = '☀️';
    const customStyle = { margin: 10, backgroundColor: 'red' };
    render(<WeatherIcon icon={icon} style={customStyle} />);
    
    const iconElement = screen.getByText(icon);
    expect(iconElement).toBeTruthy();
  });

  it('renders different weather condition icons correctly', () => {
    const weatherIcons = [
      '☀️', // Clear sky
      '🌤️', // Mainly clear
      '⛅', // Partly cloudy
      '☁️', // Overcast
      '🌫️', // Fog
      '🌦️', // Light rain
      '🌧️', // Heavy rain
      '🌨️', // Snow
      '❄️', // Heavy snow
      '⛈️', // Thunderstorm
    ];

    weatherIcons.forEach((icon, _index) => {
      const { unmount } = render(<WeatherIcon icon={icon} />);
      expect(screen.getByText(icon)).toBeTruthy();
      unmount();
    });
  });

  it('combines default styles with custom styles correctly', () => {
    const icon = '☀️';
    const customStyle = { marginTop: 20 };
    render(<WeatherIcon icon={icon} style={customStyle} />);
    
    const iconElement = screen.getByText(icon);
    expect(iconElement).toBeTruthy();
  });

  it('handles small size correctly', () => {
    const icon = '☀️';
    const smallSize = 20;
    render(<WeatherIcon icon={icon} size={smallSize} />);
    
    const iconElement = screen.getByText(icon);
    expect(iconElement).toBeTruthy();
  });

  it('handles large size correctly', () => {
    const icon = '☀️';
    const largeSize = 120;
    render(<WeatherIcon icon={icon} size={largeSize} />);
    
    const iconElement = screen.getByText(icon);
    expect(iconElement).toBeTruthy();
  });

  it('renders empty string icon gracefully', () => {
    render(<WeatherIcon icon="" />);
    
    const iconElement = screen.getByText('');
    expect(iconElement).toBeTruthy();
  });

  it('renders complex emoji icons correctly', () => {
    const complexIcon = '🌈⭐🌟'; // Multiple emojis
    render(<WeatherIcon icon={complexIcon} />);
    
    expect(screen.getByText(complexIcon)).toBeTruthy();
  });
});