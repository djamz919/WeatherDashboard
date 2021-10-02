var formSearchEl = document.querySelector('#formSearch');
var city = '';
var citiesHistory = [];
var citiesIndex = 0;

var restoreSearchHistory = function (savedCities) {
    for (var i = 0; i < savedCities.length; i++){
        city = savedCities[i];
        addToHistory();
    }
}

var apiCalls = function (addHistory) {
    console.log("I'm in the apiCalls function");
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + city + '&appid=083a782d600721f3ec95c9eb2392cf2f') //takes in the city name
        .then(function (response) {
            //console.log(searchCity);
            return response.json();
        })
        .then(function (response) {
            //console.log(response);
            var lat = response.coord.lat; // get latitude
            var lon = response.coord.lon; // get longitude
            //console.log(lat);
            //console.log(lon);
            return fetch('https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon + '&exclude=hourly&units=imperial&appid=083a782d600721f3ec95c9eb2392cf2f')
        })
        .then(function (oneCallResponse) {
            return oneCallResponse.json();
        })
        .then(function (oneCallResponse) {
            //console.log(oneCallResponse);
            displayWeatherToday(oneCallResponse);
            displayFiveDays(oneCallResponse);
            if (addHistory) {
                addToHistory(oneCallResponse);
            }
        });
}

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
    var todayHeader = document.getElementById('todayHeader');
    todayHeader.innerHTML = '<span id="city"></span><span id="todayDate"></span>' //Reset the innerHTML for new requests
    var citySpan = document.getElementById('city');
    citySpan.textContent = city;
    var date = moment().format('l');
    //console.log(date);
    var todayDateSpan = document.getElementById('todayDate');
    todayDateSpan.textContent = ' (' + date + ')';
    var todayIcon = document.createElement('img');
    var tempSpan = document.getElementById('temp');
    var windSpan = document.getElementById('wind');
    var humiditySpan = document.getElementById('humidity');
    var uvSpan = document.getElementById('uv');
    //console.log(response);
    todayIcon.src = 'http://openweathermap.org/img/wn/' + response.daily[0].weather[0].icon + '@2x.png'
    todayHeader.appendChild(todayIcon)
    tempSpan.textContent = response.current.temp + " °F";
    windSpan.textContent = response.current.wind_speed + " MPH";
    humiditySpan.textContent = response.current.humidity + "%";
    var uvIndex = response.current.uvi;
    uvSpan.textContent = uvIndex;
    updateUvColor(uvIndex, uvSpan);
}

var displayFiveDays = function (oneCallResponse) {
    var cardContainerEl = document.getElementById('cardContainer');
    cardContainerEl.innerHTML = ''; //reset the innerHTML
    for (var i = 0; i < 5; i++) { // for loop to go through the 5 days 
        var weatherCard = document.createElement('div');
        weatherCard.id = 'weatherCard';
        cardContainerEl.appendChild(weatherCard);
        var headerEl = document.createElement('h4');
        headerEl.textContent = moment().add(i+1, 'days').format('l');
        weatherCard.appendChild(headerEl);
        var iconEl = document.createElement('img');
        var tempEl = document.createElement('p');
        var windEl = document.createElement('p');
        var humidityEl = document.createElement('p');
        //console.log(oneCallResponse.daily[i+1].weather[0].icon)
        iconEl.src = 'http://openweathermap.org/img/wn/' + oneCallResponse.daily[i + 1].weather[0].icon + '@2x.png'
        tempEl.textContent = 'Temp: ' + oneCallResponse.daily[i + 1].temp.day + ' °F';
        windEl.textContent = 'Wind: ' + oneCallResponse.daily[i + 1].wind_speed + ' MPH';
        humidityEl.textContent = oneCallResponse.daily[i + 1].humidity + '%';
        weatherCard.appendChild(iconEl);
        weatherCard.appendChild(tempEl);
        weatherCard.appendChild(windEl);
        weatherCard.appendChild(humidityEl);
    }
}

var addToHistory = function () {
    var inHistory = false;
    //console.log(citiesHistory);
    //console.log('The length of the array is ' + citiesHistory.length);
    for (var i = 0; i < citiesHistory.length; i++) {
        //console.log('citiesHistory ' + citiesHistory[i]);
        //console.log(city);
        if (citiesHistory[i] === city) {
            //console.log(citiesHistory[i]);
            inHistory = true;
        }
    }
    //console.log('is it in the history?: ' + inHistory);
    if (inHistory === false) {
        citiesHistory.push(city);
        var searchHistoryEl = document.getElementById('searchHistory');
        var cityButtonEl = document.createElement('button');
        cityButtonEl.className = 'cityHistoryButton' + citiesIndex;
        cityButtonEl.textContent = city;
        searchHistoryEl.appendChild(cityButtonEl);
    }

    localStorage.setItem("citiesHistory", JSON.stringify(citiesHistory));

    var savedCities = localStorage.getItem("citiesHistory");
    if (savedCities) {
        savedCities = JSON.parse(savedCities);
        console.log(savedCities);
    }

    var cityHistoryButtonEl = document.querySelector('.cityHistoryButton' + citiesIndex);
    cityHistoryButtonEl.addEventListener("click", redisplayWeather);

    citiesIndex++;
}

var getWeather = function (event) {
    var searchCity = document.getElementById('input').value;
    city = searchCity;
    event.preventDefault(); //stop it from refreshing
    apiCalls(true);
    //console.log(searchCity);
}

var redisplayWeather = function (event) {
    event.preventDefault(); //stop it from refreshing
    var targetEl = event.target;
    city = targetEl.textContent;
    console.log("I'm in the redisplayWeather function");
    console.log(city);
    apiCalls(false);
}

formSearchEl.addEventListener("submit", getWeather);

var savedCities = localStorage.getItem("citiesHistory");
if (savedCities) {
    savedCities = JSON.parse(savedCities);
    console.log(savedCities);
    restoreSearchHistory(savedCities);
}