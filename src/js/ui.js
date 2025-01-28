class UI {
    displayCurrentWeather(data) {
        const currentWeatherDiv = document.getElementById('current-weather');
        currentWeatherDiv.innerHTML = `
            <h2>Current Weather</h2>
            <p>Location: ${data.locationName || data.resolvedAddress}</p>
            <div class="weather-icon-container">
                <i class="wi ${this.getWeatherIcon(data.currentConditions.icon)} weather-icon"></i>
            </div>
            <p>Temperature: ${data.currentConditions.temp}°C</p>
            <p>Feels Like: ${data.currentConditions.feelslike}°C</p>
            <p>Weather: ${data.currentConditions.conditions}</p>
            <p>Humidity: ${data.currentConditions.humidity}%</p>
            <p>Wind Speed: ${data.currentConditions.windspeed} km/h</p>
            <p>Visibility: ${data.currentConditions.visibility} km</p>
            <p>UV Index: ${data.currentConditions.uvindex}</p>
            <p>Sunrise: ${data.currentConditions.sunrise}</p>
            <p>Sunset: ${data.currentConditions.sunset}</p>
        `;
    }

    displayHourlyForecast(data) {
        const hourlyForecastDiv = document.getElementById('hourly-forecast');
        hourlyForecastDiv.innerHTML = '<h2>Hourly Forecast</h2>';
        if (data.hours && Array.isArray(data.hours)) {
            data.hours.slice(0, 24).forEach(hour => {
                hourlyForecastDiv.innerHTML += `
                    <div class="hourly-forecast-hour">
                        <p>Time: ${hour.datetime}</p>
                        <p>Temp: ${hour.temp}°C</p>
                        <p>Weather: ${hour.conditions}</p>
                    </div>
                `;
            });
        } else {
            hourlyForecastDiv.innerHTML = '<p>No hourly forecast data available.</p>';
        }
    }

    displayForecast(data) {
        const forecastDiv = document.getElementById('forecast');
        forecastDiv.innerHTML = '<h2>7-Day Forecast</h2>';
        if (data.days && Array.isArray(data.days)) {
            data.days.slice(0, 7).forEach(day => {
                forecastDiv.innerHTML += `
                    <div class="forecast-day">
                        <div class="weather-icon-container">
                            <i class="wi ${this.getWeatherIcon(day.icon)} weather-icon"></i>
                        </div>
                        <div>
                            <p>Date: ${day.datetime}</p>
                            <p>High: ${day.tempmax}°C</p>
                            <p>Low: ${day.tempmin}°C</p>
                            <p>Weather: ${day.conditions}</p>
                        </div>
                    </div>
                `;
            });
        } else {
            forecastDiv.innerHTML = '<p>No forecast data available.</p>';
        }
    }

    displayWeatherAlerts(data) {
        const alertsDiv = document.getElementById('weather-alerts');
        if (data.alerts && data.alerts.length > 0) {
            alertsDiv.innerHTML = '<h2>Weather Alerts</h2>';
            data.alerts.forEach(alert => {
                alertsDiv.innerHTML += `
                    <div class="alert">
                        <p>${alert.event}</p>
                        <p>${alert.description}</p>
                    </div>
                `;
            });
        } else {
            alertsDiv.innerHTML = '<h2>No Weather Alerts</h2>';
        }
    }

    displayClothingSuggestion(data) {
        const clothingDiv = document.getElementById('clothing-suggestion');
        clothingDiv.innerHTML = `
            <h2>Clothing Suggestion</h2>
            <p>${this.getClothingSuggestion(data.currentConditions.temp)}</p>
        `;
    }

    displayDetailedMetrics(data) {
        const metricsDiv = document.getElementById('detailed-metrics');
        metricsDiv.innerHTML = `
            <h2>Detailed Metrics</h2>
            <p>UV Index: ${data.currentConditions.uvindex}</p>
            <p>Dew Point: ${data.currentConditions.dewpoint}°C</p>
            <p>Pressure: ${data.currentConditions.pressure} hPa</p>
        `;
    }

    clearUI() {
        document.getElementById('current-weather').innerHTML = '';
        document.getElementById('hourly-forecast').innerHTML = '';
        document.getElementById('forecast').innerHTML = '';
        document.getElementById('weather-alerts').innerHTML = '';
        document.getElementById('weather-map').innerHTML = '';
        document.getElementById('favorites').innerHTML = '';
        document.getElementById('weather-news').innerHTML = '';
        document.getElementById('detailed-metrics').innerHTML = '';
        document.getElementById('clothing-suggestion').innerHTML = '';
        document.getElementById('air-quality').innerHTML = ''; // Remove this line
    }

    getWeatherIcon(icon) {
        const iconMap = {
            'clear-day': 'wi-day-sunny',
            'clear-night': 'wi-night-clear',
            'rain': 'wi-rain',
            'snow': 'wi-snow',
            'sleet': 'wi-sleet',
            'wind': 'wi-strong-wind',
            'fog': 'wi-fog',
            'cloudy': 'wi-cloudy',
            'partly-cloudy-day': 'wi-day-cloudy',
            'partly-cloudy-night': 'wi-night-alt-cloudy',
        };
        return iconMap[icon] || 'wi-na';
    }

    getClothingSuggestion(temp) {
        if (temp > 30) return 'Wear light clothing';
        if (temp > 20) return 'Wear a t-shirt and jeans';
        if (temp > 10) return 'Wear a jacket';
        return 'Wear a coat and warm clothes';
    }

    loadFavoriteLocations() {
        let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
        const favoritesDiv = document.getElementById('favorites');
        favoritesDiv.innerHTML = '<h2>Favorite Locations</h2>';
        favorites.forEach(location => {
            favoritesDiv.innerHTML += `<button onclick="fetchAndDisplayWeather('${location}')">${location}</button>`;
        });
    }
}

const ui = new UI();
export default ui;