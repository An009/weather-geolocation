const locationElement = document.getElementById('location');
const tempValueElement = document.getElementById('temp-value');
const tempUnitElement = document.getElementById('temp-unit');
const toggleTempBtn = document.getElementById('toggle-temp-btn');
const weatherIconElement = document.getElementById('weather-icon');
const descriptionTextElement = document.getElementById('description-text');

let currentTemperatureCelsius = null;
let isCelsius = true;

// Function to update the weather display
function updateWeatherDisplay(data) {
    const { name, main, weather } = data;
    const weatherDescription = weather[0].description;
    const temperatureInKelvin = main.temp;

    locationElement.textContent = name;
    descriptionTextElement.textContent = weatherDescription;

    // Convert Kelvin to Celsius
    currentTemperatureCelsius = temperatureInKelvin - 273.15;

    // Set initial temperature display
    if (isCelsius) {
        tempValueElement.textContent = currentTemperatureCelsius.toFixed(1);
        tempUnitElement.textContent = '°C';
    } else {
        const tempFahrenheit = (currentTemperatureCelsius * 9/5) + 32;
        tempValueElement.textContent = tempFahrenheit.toFixed(1);
        tempUnitElement.textContent = '°F';
    }

    // Set weather icon and background based on weather description
    // You'll need to expand this mapping significantly
    let iconUrl = '';
    let bodyClass = '';

    if (weatherDescription.includes('clear sky')) {
        iconUrl = 'https://openweathermap.org/img/wn/01d.png'; // Example icon
        bodyClass = 'sunny';
    } else if (weatherDescription.includes('cloud')) {
        iconUrl = 'https://openweathermap.org/img/wn/03d.png'; // Example icon
        bodyClass = 'cloudy';
    } else if (weatherDescription.includes('rain') || weatherDescription.includes('drizzle')) {
        iconUrl = 'https://openweathermap.org/img/wn/09d.png'; // Example icon
        bodyClass = 'rainy';
    } else if (weatherDescription.includes('snow')) {
        iconUrl = 'https://openweathermap.org/img/wn/13d.png'; // Example icon
        bodyClass = 'snowy'; // You'd need to define this class in CSS
    } else if (weatherDescription.includes('thunderstorm')) {
        iconUrl = 'https://openweathermap.org/img/wn/11d.png'; // Example icon
        bodyClass = 'stormy'; // You'd need to define this class in CSS
    } else {
        iconUrl = 'https://openweathermap.org/img/wn/50d.png'; // Default/mist
        bodyClass = 'misty'; // You'd need to define this class in CSS
    }

    weatherIconElement.src = iconUrl;
    weatherIconElement.alt = weatherDescription;

    // Remove existing background classes and add the new one
    document.body.className = ''; // Clear all classes
    document.body.classList.add(bodyClass);
}

// Function to fetch weather data
async function fetchWeatherData(latitude, longitude) {
    locationElement.textContent = 'Fetching weather...';
    try {
        const response = await fetch(`https://weather-proxy.freecodecamp.rocks/api/current?lat=${latitude}&lon=${longitude}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        updateWeatherDisplay(data);
    } catch (error) {
        console.error("Could not get weather data:", error);
        locationElement.textContent = 'Could not get weather data. Please try again later.';
        descriptionTextElement.textContent = '';
        tempValueElement.textContent = '';
        tempUnitElement.textContent = '';
        weatherIconElement.src = '';
    }
}

// Function to get user's current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                fetchWeatherData(latitude, longitude);
            },
            (error) => {
                console.error("Geolocation error:", error);
                locationElement.textContent = 'Please enable location services to see the weather.';
                descriptionTextElement.textContent = '';
                tempValueElement.textContent = '';
                tempUnitElement.textContent = '';
                weatherIconElement.src = '';
                
            }
        );
    } else {
        locationElement.textContent = 'Geolocation is not supported by your browser.';
        descriptionTextElement.textContent = '';
        tempValueElement.textContent = '';
        tempUnitElement.textContent = '';
        weatherIconElement.src = '';
    }
}

// Event listener for temperature toggle button
toggleTempBtn.addEventListener('click', () => {
    if (currentTemperatureCelsius !== null) {
        isCelsius = !isCelsius;
        if (isCelsius) {
            tempValueElement.textContent = currentTemperatureCelsius.toFixed(1);
            tempUnitElement.textContent = '°C';
        } else {
            const tempFahrenheit = (currentTemperatureCelsius * 9/5) + 32;
            tempValueElement.textContent = tempFahrenheit.toFixed(1);
            tempUnitElement.textContent = '°F';
        }
    }
});

getLocation();