/* ============================================
   HOME.JS - Home Page Specific JavaScript
   W03 Chamber of Commerce Home Page
   ============================================ */

// ============================================
// Weather API (OpenWeatherMap)
// ============================================
const API_KEY = '1e2bec4abb80b8f25eba7c9e5a5d556f'; 
const LAT = 40.2338;  
const LON = -111.6585;

async function fetchWeather() {
    try {
        // Current weather
        const currentResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${LAT}&lon=${LON}&units=imperial&appid=${API_KEY}`
        );
        const currentData = await currentResponse.json();

        // 3-day forecast
        const forecastResponse = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${LAT}&lon=${LON}&units=imperial&appid=${API_KEY}`
        );
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
    } catch (error) {
        console.error('Weather fetch error:', error);
        displayWeatherFallback();
    }
}

function displayCurrentWeather(data) {
    const temp = Math.round(data.main.temp);
    const high = Math.round(data.main.temp_max);
    const low = Math.round(data.main.temp_min);
    const humidity = data.main.humidity;
    const condition = data.weather[0].description;
    const iconCode = data.weather[0].icon;

    document.getElementById('temperature').textContent = temp;
    document.getElementById('high').textContent = high;
    document.getElementById('low').textContent = low;
    document.getElementById('humidity').textContent = humidity;
    document.getElementById('condition').textContent = condition;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    document.getElementById('weather-icon').alt = condition;
}

function displayForecast(data) {
    const forecastList = document.getElementById('forecast-list');
    forecastList.innerHTML = '';

    // Get one forecast per day (at noon)
    const dailyForecasts = [];
    const seenDates = new Set();

    for (const item of data.list) {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toLocaleDateString('en-US', { weekday: 'short' });

        if (!seenDates.has(dateStr) && dailyForecasts.length < 3) {
            seenDates.add(dateStr);
            dailyForecasts.push({
                day: dateStr,
                temp: Math.round(item.main.temp),
                icon: item.weather[0].icon,
                condition: item.weather[0].description
            });
        }
    }

    dailyForecasts.forEach(day => {
        const forecastItem = document.createElement('div');
        forecastItem.className = 'forecast-item';
        forecastItem.innerHTML = `
            <span class="forecast-day">${day.day}</span>
            <span class="forecast-icon">
                <img src="https://openweathermap.org/img/wn/${day.icon}.png" alt="${day.condition}" width="40" height="40">
            </span>
            <span class="forecast-temp">${day.temp}&deg;F</span>
        `;
        forecastList.appendChild(forecastItem);
    });
}

function displayWeatherFallback() {
    // Fallback data if API fails
    document.getElementById('temperature').textContent = '72';
    document.getElementById('high').textContent = '78';
    document.getElementById('low').textContent = '65';
    document.getElementById('humidity').textContent = '45';
    document.getElementById('condition').textContent = 'Partly Cloudy';

    const forecastList = document.getElementById('forecast-list');
    forecastList.innerHTML = `
        <div class="forecast-item">
            <span class="forecast-day">Mon</span>
            <span class="forecast-temp">75&deg;F</span>
        </div>
        <div class="forecast-item">
            <span class="forecast-day">Tue</span>
            <span class="forecast-temp">73&deg;F</span>
        </div>
        <div class="forecast-item">
            <span class="forecast-day">Wed</span>
            <span class="forecast-temp">70&deg;F</span>
        </div>
    `;
}

// ============================================
// Member Spotlights
// ============================================
async function loadSpotlights() {
    try {
        const response = await fetch('data/members.json');
        const members = await response.json();

        // Filter gold and silver members
        const qualifiedMembers = members.filter(
            m => m.membership === 'Gold' || m.membership === 'Silver'
        );

        // Randomly select 2-3 members
        const selectedMembers = shuffleArray(qualifiedMembers).slice(0, 3);

        displaySpotlights(selectedMembers);
    } catch (error) {
        console.error('Spotlight fetch error:', error);
        displaySpotlightFallback();
    }
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function displaySpotlights(members) {
    const grid = document.getElementById('spotlight-grid');
    grid.innerHTML = '';

    members.forEach(member => {
        const card = document.createElement('div');
        card.className = `spotlight-card ${member.membership.toLowerCase()}`;
        card.innerHTML = `
            <img src="images/${member.image}" alt="${member.name}" loading="lazy">
            <div class="spotlight-content">
                <h3>${member.name}</h3>
                <p>${member.address}</p>
                <p>${member.phone}</p>
                <a href="${member.website}" target="_blank" rel="noopener">Visit Website</a>
                <span class="membership-badge ${member.membership.toLowerCase()}">${member.membership} Member</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

function displaySpotlightFallback() {
    const grid = document.getElementById('spotlight-grid');
    grid.innerHTML = `
        <div class="spotlight-card gold">
            <img src="images/placeholder.jpg" alt="Member" loading="lazy">
            <div class="spotlight-content">
                <h3>ABC Company</h3>
                <p>123 Main St, City, ST</p>
                <p>(555) 123-4567</p>
                <a href="#">Visit Website</a>
                <span class="membership-badge gold">Gold Member</span>
            </div>
        </div>
        <div class="spotlight-card silver">
            <img src="images/placeholder.jpg" alt="Member" loading="lazy">
            <div class="spotlight-content">
                <h3>XYZ Services</h3>
                <p>456 Oak Ave, City, ST</p>
                <p>(555) 987-6543</p>
                <a href="#">Visit Website</a>
                <span class="membership-badge silver">Silver Member</span>
            </div>
        </div>
    `;
}

// ============================================
// Initialize
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    fetchWeather();
    loadSpotlights();
});