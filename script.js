const container = document.querySelector('.container');
const searchBtn = document.querySelector('#search-btn');
const locBtn = document.querySelector('#location-btn');
const weatherBox = document.querySelector('.weather-box');
const weatherDetails = document.querySelector('.weather-details');
const error404 = document.querySelector('.not-found');
const input = document.querySelector('.search-box input');

searchBtn.addEventListener('click', () => {
    const city = input.value;
    if (city === '') return;
    findCity(city);
});

input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const city = input.value;
        if (city === '') return;
        findCity(city);
    }
});

locBtn.addEventListener('click', () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(gotLocation, failedLocation);
    } else {
        alert("Geolocation not supported");
    }
});

function gotLocation(pos) {
    const lat = pos.coords.latitude;
    const lon = pos.coords.longitude;
    getWeather(lat, lon);
}

function failedLocation() {
    alert("Please allow location access");
}

function findCity(city) {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (!data.results) {
                showError();
                return;
            }
            const lat = data.results[0].latitude;
            const lon = data.results[0].longitude;
            getWeather(lat, lon);
        })
        .catch(() => {
            showError();
        });
}

function getWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m`;

    fetch(url)
        .then(res => res.json())
        .then(data => {
            error404.style.display = 'none';
            error404.classList.remove('fadeIn');

            const current = data.current_weather;
            const hour = new Date().getHours();
            const hum = data.hourly.relativehumidity_2m[hour];

            const tempElement = document.querySelector('.weather-box .temperature');
            const descElement = document.querySelector('.weather-box .description');
            const humElement = document.getElementById('humidity');
            const windElement = document.getElementById('wind-speed');
            const feelsElement = document.getElementById('feels-like');

            tempElement.innerHTML = `${Math.round(current.temperature)}<span>°C</span>`;
            windElement.innerHTML = `${Math.round(current.windspeed)} Km/h`;
            humElement.innerHTML = `${hum}%`;
            feelsElement.innerHTML = `${Math.round(current.temperature)}°C`;

            updateIcon(current.weathercode);

            weatherBox.style.display = '';
            weatherDetails.style.display = '';
            weatherBox.classList.add('fadeIn');
            weatherDetails.classList.add('fadeIn');
            container.style.height = '590px';
        })
        .catch(() => {
            showError();
        });
}

function updateIcon(code) {
    const img = document.querySelector('.weather-box img');
    const desc = document.querySelector('.weather-box .description');
    const body = document.body;

    if (code === 0) {
        desc.innerHTML = "Clear Sky";
        img.src = 'https://openweathermap.org/img/wn/01d@4x.png';
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1601297183305-6df142704ea2?q=80&w=1600&auto=format&fit=crop')";
    } else if (code >= 1 && code <= 3) {
        desc.innerHTML = "Partly Cloudy";
        img.src = 'https://openweathermap.org/img/wn/04d@4x.png';
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1600&auto=format&fit=crop')";
    } else if (code >= 45 && code <= 48) {
        desc.innerHTML = "Foggy";
        img.src = 'https://openweathermap.org/img/wn/50d@4x.png';
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?q=80&w=1600&auto=format&fit=crop')";
    } else if (code >= 51 && code <= 67) {
        desc.innerHTML = "Raining";
        img.src = 'https://openweathermap.org/img/wn/10d@4x.png';
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?q=80&w=1600&auto=format&fit=crop')";
    } else if (code >= 71 && code <= 77) {
        desc.innerHTML = "Snowing";
        img.src = 'https://openweathermap.org/img/wn/13d@4x.png';
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1477601263568-180e2c6d046e?q=80&w=1600&auto=format&fit=crop')";
    } else if (code >= 95) {
        desc.innerHTML = "Thunderstorm";
        img.src = 'https://openweathermap.org/img/wn/11d@4x.png';
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?q=80&w=1600&auto=format&fit=crop')";
    } else {
        desc.innerHTML = "Cloudy";
        img.src = 'https://openweathermap.org/img/wn/03d@4x.png';
        body.style.backgroundImage = "url('https://images.unsplash.com/photo-1534088568595-a066f410bcda?q=80&w=1600&auto=format&fit=crop')";
    }
}

function showError() {
    container.style.height = '400px';
    weatherBox.style.display = 'none';
    weatherDetails.style.display = 'none';
    error404.style.display = 'block';
    error404.classList.add('fadeIn');
}