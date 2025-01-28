class WeatherService {
    constructor(apiKey) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
    }

    async getWeather(location) {
        const url = `${this.baseUrl}${location}?key=${this.apiKey}`;
        console.log('Fetching weather data from URL:', url); // Debugging
        const response = await fetch(url);
        if (!response.ok) {
            console.error('Fetch response not OK:', response.status, response.statusText); // Debugging
            throw new Error('Failed to fetch weather data');
        }
        return response.json();
    }

    async getWeatherByCoordinates(latitude, longitude) {
        const url = `${this.baseUrl}${latitude},${longitude}?key=${this.apiKey}`;
        console.log('Fetching weather data by coordinates from URL:', url); // Debugging
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }
        return response.json();
    }

    async getHistoricalWeather(location, date) {
        const url = `${this.baseUrl}${location}/${date}?key=${this.apiKey}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Failed to fetch historical weather data');
        }
        return response.json();
    }
}

const weatherService = new WeatherService('LLNLBUWTUK7UYPGYF8CCJVYNE'); // Replace with your actual API key
export default weatherService;