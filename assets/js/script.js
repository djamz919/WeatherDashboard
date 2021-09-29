function getWeather() {
    var searchCity = document.getElementById('input').value;
    console.log(searchCity);
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + searchCity + '&appid=')
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);
        });
}