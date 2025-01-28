import weatherService from './weatherService.js';
import ui from './ui.js';

const reverseGeocodingAPIKey = 'a8311025a6ab4000b91af15e8fd1dbcd';

// Geolocation-Based Weather
export function fetchWeatherByGeolocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const locationName = await getLocationName(latitude, longitude);
            ui.clearUI();
            const weatherData = await weatherService.getWeatherByCoordinates(latitude, longitude);
            weatherData.locationName = locationName; // Add location name to weatherData
            ui.displayCurrentWeather(weatherData);
            ui.displayHourlyForecast(weatherData);
            ui.displayForecast(weatherData);
            ui.displayWeatherAlerts(weatherData);
            ui.displayClothingSuggestion(weatherData);
            ui.displayDetailedMetrics(weatherData);
            setWeatherBackground(weatherData.currentConditions.icon); // Set background image
        }, (error) => {
            console.error('Geolocation error:', error);
            alert('Failed to get location. Please enter a location manually.');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Helper function to get location name from coordinates
async function getLocationName(latitude, longitude) {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${reverseGeocodingAPIKey}`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.results && data.results[0]) {
        return data.results[0].formatted;
    } else {
        return 'Unknown Location';
    }
}

// Function to set the background image based on the current weather condition
async function setWeatherBackground(icon) {
    try {
        const module = await import(`../images/${icon}.jpg`);
        const backgroundImage = module.default;
        document.body.style.backgroundImage = `url(${backgroundImage})`;
    } catch (error) {
        console.error('Error loading background image:', error);
        document.body.style.backgroundImage = 'url(../images/default.jpg)';
    }
}

// Weather Notifications
export function requestNotificationPermission() {
    if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted.');
            }
        });
    }
}

export function showWeatherNotification(alert) {
    if (Notification.permission === 'granted') {
        new Notification('Weather Alert', {
            body: alert.description,
            icon: 'path/to/icon.png'
        });
    }
}

// Favorite Locations
export function saveFavoriteLocation(location) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(location)) {
        favorites.push(location);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        ui.loadFavoriteLocations();
    }
}

// Historical Weather Data
document.addEventListener('DOMContentLoaded', () => {
    const datePicker = document.getElementById('date-picker');
    if (datePicker) {
        datePicker.addEventListener('change', async (event) => {
            const date = event.target.value;
            const location = document.getElementById('location').value;
            const weatherData = await weatherService.getHistoricalWeather(location, date);
            ui.displayCurrentWeather(weatherData);
        });
    }
});

// Weather Sharing
export function shareWeather(weatherData) {
    const weatherText = `Current weather: ${weatherData.currentConditions.temp}°C and ${weatherData.currentConditions.conditions}`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(weatherText)}`;
    window.open(shareUrl, '_blank');
}

// Custom Themes
export function applyTheme(theme) {
    document.body.className = theme;
}

// Toggle Theme
export function toggleTheme() {
    const body = document.body;
    const themeToggleIcon = document.querySelector('#theme-toggle i');

    body.classList.toggle('light-mode');
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
        themeToggleIcon.classList.remove('fa-moon');
        themeToggleIcon.classList.add('fa-sun');
    } else {
        themeToggleIcon.classList.remove('fa-sun');
        themeToggleIcon.classList.add('fa-moon');
    }
}

// Load Weather News
export async function fetchWeatherNews() {
    const url = 'https://newsapi.org/v2/everything?q=weather&apiKey=b906343e166041dcbf8da1a5ca6c4aa4';
    const response = await fetch(url);
    const data = await response.json();
    const newsDiv = document.getElementById('weather-news');
    newsDiv.innerHTML = '<h2>Weather News</h2>';

    // Check if data.articles is defined and is an array before using forEach
    if (data.articles && Array.isArray(data.articles)) {
        data.articles.forEach(article => {
            newsDiv.innerHTML += `<div class="news-article"><h3>${article.title}</h3><p>${article.description}</p></div>`;
        });
    } else {
        newsDiv.innerHTML += '<p>No news articles found.</p>';
    }
}

// Update Widget Weather
export async function updateWidgetWeather(location) {
    const weatherData = await weatherService.getWeather(location);
    document.getElementById('widget-current-weather').innerHTML = `
        <p>${weatherData.currentConditions.temp}°C</p>
        <p>${weatherData.currentConditions.conditions}</p>
    `;
}