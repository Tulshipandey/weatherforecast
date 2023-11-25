import React, { useState, useEffect } from 'react';

const WeatherApp = () => {
  const [userLocation, setUserLocation] = useState({});
  const [weatherUser, setWeatherUser] = useState({});
  const [weatherSurrounding, setWeatherSurrounding] = useState([]);

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });

          // Fetch weather for user's location
          fetchWeather(latitude, longitude, 'user');
          
          // Fetch weather for surrounding areas
          fetchWeather(latitude, longitude, 'surrounding');
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const fetchWeather = async (lat, lon, type) => {
    const apiKey = '6037f275673ea7efb8ec79849269b65c';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (type === 'user') {
        setWeatherUser(data);
      } else if (type === 'surrounding') {
        // Filter locations within 50 km radius (simplified example)
        const filteredData = data.list.filter((location) => {
          const distance = calculateDistance(lat, lon, location.coord.lat, location.coord.lon);
          return distance <= 50;
        });

        setWeatherSurrounding(filteredData);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Simplified distance calculation for demonstration purposes
    const R = 6371; // Earth's radius in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const toRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  return (
    <div>
      <h1>Weather for User's Location</h1>
      {/* Display weather for user's location */}
      <pre>{JSON.stringify(weatherUser, null, 2)}</pre>

      <h1>Weather for Surrounding Areas (within 50 km)</h1>
      {/* Display weather for surrounding areas */}
      <pre>{JSON.stringify(weatherSurrounding, null, 2)}</pre>
    </div>
  );
};

export default WeatherApp;
