var formSearchEl = document.querySelector('#formSearch');
var citiesHistory = [];
var citiesIndex = 0;

var updateUvColor = function (uvIndex, uvSpan) {
    if (uvIndex < 3) {
        uvSpan.className = "green";
    } else if (uvIndex >= 3 && uvIndex < 5) {
        uvSpan.className = "yellow";
    } else if (uvIndex >= 5) {
        uvSpan.className = "red";
    }
}

var displayWeatherToday = function (response) {
    var todayIcon = document.getElementById('todayIcon')
    var tempSpan = document.getElementById('temp');
    var windSpan = document.getElementById('wind');
    var humiditySpan = document.getElementById('humidity');
    var uvSpan = document.getElementById('uv');
    //console.log(response);
    todayIcon.src = 'http://openweathermap.org/img/wn/'+response.daily[0].weather[0].icon+'@2x.png'
    tempSpan.textContent = response.current.temp + " °F";
    windSpan.textContent = response.current.wind_speed + " MPH";
    humiditySpan.textContent = response.current.humidity + "%";
    var uvIndex = response.current.uvi;
    uvSpan.textContent = uvIndex;
    updateUvColor(uvIndex, uvSpan);
}

var displayFiveDays = function (oneCallResponse) {
    var cardContainerEl = document.getElementById('cardContainer');
    cardContainerEl.innerHTML = '';
    for (var i = 0; i < 5; i++) {
        var weatherCard = document.createElement('div');
        weatherCard.id = 'weatherCard';
        cardContainerEl.appendChild(weatherCard);
        var headerEl = document.createElement('h4');
        headerEl.textContent = moment().add(i, 'days').format('l');
        weatherCard.appendChild(headerEl);
        var iconEl = document.createElement('img');
        var tempEl = document.createElement('p');
        var windEl = document.createElement('p');
        var humidityEl = document.createElement('p');
        //console.log(oneCallResponse.daily[i+1].weather[0].icon)
        iconEl.src = 'http://openweathermap.org/img/wn/'+oneCallResponse.daily[i+1].weather[0].icon+'@2x.png'
        tempEl.textContent = 'Temp: ' + oneCallResponse.daily[i+1].temp.day + ' °F';
        windEl.textContent = 'Wind: ' + oneCallResponse.daily[i+1].wind_speed + ' MPH';
        humidityEl.textContent  = oneCallResponse.daily[i+1].humidity + '%';
        weatherCard.appendChild(iconEl);
        weatherCard.appendChild(tempEl);
        weatherCard.appendChild(windEl);
        weatherCard.appendChild(humidityEl);
    }
}

var addToHistory = function (oneCallResponse) {
    citiesHistory[citiesIndex] = oneCallResponse;
    var searchHistoryEl = document.getElementById('searchHistory');
    var cityButtonEl = document.createElement('button');
    cityButtonEl.setAttribute("cities-index", citiesIndex);
    var searchCity = document.getElementById('input').value;
    cityButtonEl.textContent = searchCity;
    searchHistoryEl.appendChild(cityButtonEl);
    citiesIndex++;

}

var getWeather = function (event) {
    event.preventDefault();
    var searchCity = document.getElementById('input').value;
    //console.log(searchCity);
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + searchCity + '&appid=083a782d600721f3ec95c9eb2392cf2f')
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            //console.log(response);
            var citySpan = document.getElementById('city');
            citySpan.textContent = searchCity;
            var date = moment().format('l');
            //console.log(date);
            var todayDateSpan = document.getElementById('todayDate');
            todayDateSpan.textContent = '(' + date + ')';
            var lat = response.coord.lat;
            var lon = response.coord.lon;
            //console.log(lat);
            //console.log(lon);
            return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly&units=imperial&appid=083a782d600721f3ec95c9eb2392cf2f')
        })
        .then(function (oneCallResponse) {
            return oneCallResponse.json();
        })
        .then(function (oneCallResponse) {
            console.log(oneCallResponse);
            displayWeatherToday(oneCallResponse);
            displayFiveDays(oneCallResponse);
            addToHistory(oneCallResponse);
        });
}

formSearchEl.addEventListener("submit", getWeather);
