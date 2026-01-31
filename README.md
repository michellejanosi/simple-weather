# Simple Weather

A lightweight, client-side weather application that displays current conditions based on your location. No build tools required—just HTML, CSS, and vanilla JavaScript.

## Features

- Real-time weather data including temperature, humidity, and wind speed
- Automatic location detection via browser geolocation API
- IP-based fallback when geolocation is unavailable or denied
- Temperature unit toggle (Fahrenheit/Celsius)
- Weather condition icons using the Weather Icons library
- Responsive, minimal UI

## Tech Stack

**Frontend**
- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

**APIs**
- [Open-Meteo](https://open-meteo.com/) — Free weather API, no authentication required
- [OpenStreetMap Nominatim](https://nominatim.openstreetmap.org/) — Reverse geocoding for city names
- [ipapi.co](https://ipapi.co/) — IP-based geolocation fallback

**Assets**
- [Weather Icons](https://erikflowers.github.io/weather-icons/) — Icon font for weather conditions

## Getting Started

### Prerequisites

A modern web browser with JavaScript enabled. No Node.js or build process required.

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/michellejanosi/simple-weather.git
   cd simple-weather
   ```

2. Start a local server:
   ```bash
   # Python 3
   python3 -m http.server 8080

   # Or using Node.js
   npx serve
   ```

3. Open `http://localhost:8080` in your browser.

4. Allow location access when prompted for accurate local weather.

## Architecture

```
simple-weather/
├── index.html      # Entry point
├── script.js       # Application logic and API integrations
├── css/
│   ├── styles.css        # Application styles
│   └── weather-icons.css # Weather Icons library
├── font/           # Weather Icons font files
└── img/            # Favicon and assets
```

### Data Flow

1. **Location acquisition**: Browser geolocation API → falls back to IP geolocation via ipapi.co
2. **Weather data**: Coordinates sent to Open-Meteo API → returns current conditions and hourly forecast
3. **City name**: Coordinates sent to Nominatim → returns human-readable location
4. **Rendering**: Data mapped to UI elements and weather icons

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

Requires JavaScript enabled and either geolocation permissions or network access for IP-based location.

## API Notes

All APIs used are free and require no authentication:

| API | Purpose | Rate Limits |
|-----|---------|-------------|
| Open-Meteo | Weather data | 10,000 requests/day |
| Nominatim | Reverse geocoding | 1 request/second |
| ipapi.co | IP geolocation | 1,000 requests/day |

For production applications with higher traffic, consider API keys or self-hosted alternatives.

## License

MIT

## Acknowledgments

- [Erik Flowers](https://erikflowers.github.io/weather-icons/) for the Weather Icons library
- [Open-Meteo](https://open-meteo.com/) for providing free weather data
