function getWeather() {
    var searchCity = document.getElementById('input').value;
    console.log(searchCity);
    fetch('https://api.openweathermap.org/data/2.5/weather?q=' + searchCity + '&appid=083a782d600721f3ec95c9eb2392cf2f')
        .then(function (response) {
            return response.json();
        })
        .then(function (response) {
            console.log(response);
        });
}