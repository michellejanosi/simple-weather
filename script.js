window.addEventListener("load", () => {
  let region = document.querySelector('.location');
  let weatherIcon = document.querySelector('.icon');
  let temp = document.querySelector('.temp');
  let humid = document.querySelector('.humidity');
  let hourlyDetails = document.querySelector('.details');
  let alertInfo = document.querySelector('.alert-title');
  let wind = document.querySelector('.wind');
  const convertToF = document.querySelector('.fahrenheit');
  const convertToC = document.querySelector('.celsius');

  // Map WMO weather codes to weather-icons classes
  function getWeatherIcon(code) {
    const iconMap = {
      0: 'wi-day-sunny',           // Clear sky
      1: 'wi-day-sunny',           // Mainly clear
      2: 'wi-day-cloudy',          // Partly cloudy
      3: 'wi-cloudy',              // Overcast
      45: 'wi-fog',                // Fog
      48: 'wi-fog',                // Depositing rime fog
      51: 'wi-sprinkle',           // Light drizzle
      53: 'wi-sprinkle',           // Moderate drizzle
      55: 'wi-sprinkle',           // Dense drizzle
      56: 'wi-sleet',              // Light freezing drizzle
      57: 'wi-sleet',              // Dense freezing drizzle
      61: 'wi-rain',               // Slight rain
      63: 'wi-rain',               // Moderate rain
      65: 'wi-rain',               // Heavy rain
      66: 'wi-sleet',              // Light freezing rain
      67: 'wi-sleet',              // Heavy freezing rain
      71: 'wi-snow',               // Slight snow
      73: 'wi-snow',               // Moderate snow
      75: 'wi-snow',               // Heavy snow
      77: 'wi-snow',               // Snow grains
      80: 'wi-showers',            // Slight rain showers
      81: 'wi-showers',            // Moderate rain showers
      82: 'wi-showers',            // Violent rain showers
      85: 'wi-snow',               // Slight snow showers
      86: 'wi-snow',               // Heavy snow showers
      95: 'wi-thunderstorm',       // Thunderstorm
      96: 'wi-thunderstorm',       // Thunderstorm with slight hail
      99: 'wi-thunderstorm'        // Thunderstorm with heavy hail
    };
    return iconMap[code] || 'wi-na';
  }

  // Get weather description from WMO code
  function getWeatherDescription(code) {
    const descMap = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Foggy',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    return descMap[code] || 'Unknown conditions';
  }

  // Reverse geocode to get city name
  async function getCityName(lat, lon) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      );
      const data = await response.json();
      return data.address.city || data.address.town || data.address.village || data.address.county || 'Unknown Location';
    } catch (error) {
      console.log('Geocoding failed:', error);
      return 'Unknown Location';
    }
  }

  // Fetch weather data from Open-Meteo
  async function fetchWeather(lat, lon) {
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&hourly=weather_code&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=auto`;

    try {
      const [weatherResponse, cityName] = await Promise.all([
        fetch(weatherUrl),
        getCityName(lat, lon)
      ]);

      const data = await weatherResponse.json();
      const current = data.current;

      const temperatureF = current.temperature_2m;
      const humidity = current.relative_humidity_2m;
      const weatherCode = current.weather_code;
      const windSpeed = current.wind_speed_10m;

      // Get a summary based on upcoming hourly conditions
      const hourlyConditions = data.hourly.weather_code.slice(0, 12);
      const uniqueConditions = [...new Set(hourlyConditions.map(code => getWeatherDescription(code)))];
      const summary = uniqueConditions.slice(0, 2).join(', then ') + ' expected throughout the day.';

      // Update UI
      region.innerHTML = cityName;
      weatherIcon.innerHTML = `<i class="wi ${getWeatherIcon(weatherCode)}"></i>`;
      temp.innerHTML = `${Math.round(temperatureF)}<i class="wi wi-fahrenheit"></i>`;
      humid.innerHTML = `${humidity} <i class="wi wi-humidity"></i>`;
      wind.innerHTML = `${Math.round(windSpeed)} <i class="wi wi-strong-wind"></i>`;
      hourlyDetails.textContent = summary;
      convertToF.innerHTML = `<i class="wi wi-fahrenheit"></i>`;
      convertToC.innerHTML = `<i class="wi wi-celsius"></i>`;

      // Temperature conversion handlers
      convertToF.addEventListener('click', event => {
        event.preventDefault();
        temp.innerHTML = `${Math.round(temperatureF)}<i class="wi wi-fahrenheit"></i>`;
      });

      convertToC.addEventListener('click', event => {
        event.preventDefault();
        temp.innerHTML = `${Math.round((temperatureF - 32) * 5 / 9)}<i class="wi wi-celsius"></i>`;
      });

      // Hide alerts section (Open-Meteo free tier doesn't include alerts)
      alertInfo.style.display = "none";

    } catch (error) {
      console.log('Weather fetch failed:', error);
      region.innerHTML = 'Error loading weather';
      hourlyDetails.textContent = 'Please try again later.';
    }
  }

  // Get user location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        fetchWeather(lat, lon);
      },
      error => {
        console.log('Geolocation error:', error);
        // Fallback to IP-based location using ipapi.co (free, supports HTTPS)
        fetch('https://ipapi.co/json/')
          .then(response => response.json())
          .then(data => {
            fetchWeather(data.latitude, data.longitude);
          })
          .catch(err => {
            console.log('IP geolocation failed:', err);
            region.innerHTML = 'Location unavailable';
            hourlyDetails.textContent = 'Please enable location services.';
          });
      }
    );
  } else {
    region.innerHTML = 'Geolocation not supported';
    hourlyDetails.textContent = 'Your browser does not support geolocation.';
  }
});
