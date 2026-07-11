/* ============================================
   ATMOSPHERE WEATHER APP - FIXED JS
   PROPER TAB SWITCHING + MAP INITIALIZATION
   ============================================ */

// const API_KEY = '1e2bec4abb80b8f25eba7c9e5a5d556f';

const apiKey = '1e2bec4abb80b8f25eba7c9e5a5d556f';

// Ile-Ife, Osun State, Nigeria
const lat = 7.4905;
const lon = 4.5521;
const units = 'metric';

const weatherContainer = document.getElementById('weather-container');

async function getWeather() {
    try {
        const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${units}&appid=${apiKey}`;

        const [currentResponse, forecastResponse] = await Promise.all([
            fetch(currentUrl),
            fetch(forecastUrl)
        ]);

        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error('Weather service unavailable');
        }

        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayWeather(currentData, forecastData);
    } catch (error) {
        console.error('Weather fetch error:', error);
        weatherContainer.innerHTML = `
            <p class="weather-error">
                Unable to load weather data.<br>
                <small>Add a valid OpenWeatherMap API key in scripts/weather.js</small>
            </p>
        `;
    }
}

// Pick one forecast entry per day, closest to midday (12:00), for the next 3 days
function getThreeDayForecast(forecastList) {
    const days = {};

    forecastList.forEach(entry => {
        const date = new Date(entry.dt * 1000);
        const dayKey = date.toISOString().split('T')[0];
        const hour = date.getUTCHours();

        if (!days[dayKey] || Math.abs(hour - 12) < Math.abs(days[dayKey].hourDiff)) {
            days[dayKey] = { ...entry, hourDiff: hour - 12 };
        }
    });

    const today = new Date().toISOString().split('T')[0];

    return Object.keys(days)
        .filter(day => day !== today)
        .sort()
        .slice(0, 3)
        .map(day => days[day]);
}

function displayWeather(current, forecast) {
    const iconUrl = code => `https://openweathermap.org/img/wn/${code}@2x.png`;
    const dayLabel = timestamp => new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'short' });

    const threeDayForecast = getThreeDayForecast(forecast.list);

    const forecastHtml = threeDayForecast.map(day => `
        <div class="forecast-day">
            <span class="day-label">${dayLabel(day.dt)}</span>
            <img src="${iconUrl(day.weather[0].icon)}" alt="${day.weather[0].description}">
            <p class="day-temp">${Math.round(day.main.temp)}&deg;C</p>
        </div>
    `).join('');

    weatherContainer.innerHTML = `
        <div class="weather-current">
            <img src="${iconUrl(current.weather[0].icon)}" alt="${current.weather[0].description}">
            <div>
                <p class="weather-temp">${Math.round(current.main.temp)}&deg;C</p>
                <p class="weather-desc">${current.weather[0].description}</p>
                <p class="weather-location">Ile-Ife, Osun State</p>
            </div>
        </div>
        <div class="forecast-grid">
            ${forecastHtml}
        </div>
    `;
}

getWeather();