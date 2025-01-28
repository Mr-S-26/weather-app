import '../css/styles.css';
import ui from './ui.js';
import { fetchWeatherByGeolocation, updateWidgetWeather, fetchWeatherNews, requestNotificationPermission, applyTheme, toggleTheme } from './features.js';

const defaultCity = 'New York'; // Set your default city here

// Function to set the background image based on the current weather condition
function setWeatherBackground(icon) {
    import(
        /* webpackMode: "lazy" */
        `../images/${icon}.jpg`
    )
        .then((module) => {
            const backgroundImage = module.default;
            document.body.style.backgroundImage = `url(${backgroundImage})`;
        })
        .catch((error) => {
            console.error('Error loading background image:', error);
            document.body.style.backgroundImage = 'url(../images/default.jpg)';
        });
}

// Function to fetch and display weather data for a given city
async function fetchAndDisplayWeather(city) {
    try {
        const weatherService = (await import('./weatherService.js')).default;
        ui.clearUI();
        const weatherData = await weatherService.getWeather(city);
        ui.displayCurrentWeather(weatherData);
        ui.displayHourlyForecast(weatherData);
        ui.displayForecast(weatherData);
        ui.displayWeatherAlerts(weatherData);
        ui.displayClothingSuggestion(weatherData);
        ui.displayDetailedMetrics(weatherData);
        setWeatherBackground(weatherData.currentConditions.icon);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again.');
    }
}

// Ensure DOM content is fully loaded before accessing elements
document.addEventListener('DOMContentLoaded', () => {
    // Event listener for the search button
    document.getElementById('search-btn').addEventListener('click', () => {
        const location = document.getElementById('location').value;
        if (location) {
            fetchAndDisplayWeather(location);
        } else {
            alert('Please enter a location.');
        }
    });

    // Event listener for the theme toggle button
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    // Event listener for the date picker
    document.getElementById('date-picker').addEventListener('change', async (event) => {
        const date = event.target.value;
        const location = document.getElementById('location').value;
        const weatherData = await weatherService.getHistoricalWeather(location, date);
        ui.displayCurrentWeather(weatherData);
    });

    // Call functions that depend on DOM elements here
    fetchWeatherByGeolocation();
    fetchWeatherNews();
    requestNotificationPermission();
    ui.loadFavoriteLocations();
});