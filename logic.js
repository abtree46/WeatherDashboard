//setting up global variables
//var cities = [""];
var searchHistory = $("#searchTerm").val();
var apiKey = "&appid=3ee1c987aa4652614556d7e5de3ccfb6";
var date = new Date();
var lat = "latitude";
var lon = "longitude";
var uvIndex = "";
//(lat + lon);

$("#searchTerm").keypress(function (event) {
    //sets enter as an event as well as click
    if (event.keyCode === 13) {
        event.preventDefault();
        $("#searchBtn").click();
    }
});

$("#searchBtn").on("click", function () {

    $('#forecastH5').addClass('show');

    // gets the val of the searchHistory from input
    searchHistory = $("#searchTerm").val();

    // clears search box
    $("#searchTerm").val("");


    // sets up the var for api call
    var queryUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchHistory + apiKey;
    var queryUrlUv = "https://api.openweathermap.org/data/2.5/uvi?lat=" + uvIndex + apiKey;
    var lat = "latitude";
    var lon = "longitude";
    var uvIndex = (queryUrlUv);
    $.ajax({
        url: queryUrl,
        method: "GET"
    })
        .then(function (response) {
            console.log(response)
            //checking to see if I did it right haha
            var tempF = (response.main.temp - 273.15) * 1.80 + 32;

            getWeather(response);
            getForecast(response);
            makeList();

        })
});

function makeList() {
    var listItem = $("<li>").addClass("list-group-item").text(searchHistory);
    $(".list").append(listItem);
}

function getWeather(response) {

    // temp and conversion 
    var tempF = (response.main.temp - 273.15) * 1.80 + 32;
    tempF = Math.floor(tempF);

    $('#currentCity').empty();

    // make elements and set the contents
    var card = $("<div>").addClass("card");
    var cardBody = $("<div>").addClass("card-body");
    var searchHistory = $("<h4>").addClass("card-title").text(response.name);
    var cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
    var temperature = $("<p>").addClass("card-text current-temp").text("Temperature: " + tempF + " °F");
    var humidity = $("<p>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");
    var wind = $("<p>").addClass("card-text current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
    var uv = $("<p>").addClass("card-text current-uv").text("UV Index: " + uvIndex);
    var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")

    // dump to page
    searchHistory.append(cityDate, image)
    cardBody.append(searchHistory, temperature, humidity, wind, uv);
    card.append(cardBody);
    $("#currentCity").append(card)
    //adds search to cities array
    //var q = $("#city-input").val();
    //cities.push(q);
    //localStorage.setItem("q", JSON.stringify(cities));
}

function getForecast() {

    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/forecast?q=" + searchHistory + apiKey,
        method: "GET"
    }).then(function (response) {

        console.log(response)
        console.log(response.dt)
        $('#forecast').empty();

        // holds repsonses
        var results = response.list;
        console.log(results)

        for (var i = 0; i < results.length; i++) {

            var day = Number(results[i].dt_txt.split('-')[2].split(' ')[0]);
            var hour = results[i].dt_txt.split('-')[2].split(' ')[1];
            console.log(day);
            console.log(hour);

            if (results[i].dt_txt.indexOf("12:00:00") !== -1) {

                // get the temperature and convert to fahrenheit 
                var temp = (results[i].main.temp - 273.15) * 1.80 + 32;
                var tempF = Math.floor(temp);

                var card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
                var cardBody = $("<div>").addClass("card-body p-3 forecastBody")
                var cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
                var temperature = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + tempF + " °F");
                var humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].main.humidity + "%");
                var uv = $("<p>").addClass("card-text forecastUV").text("UV: " + uvIndex);
                var image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + results[i].weather[0].icon + ".png")

                cardBody.append(cityDate, image, temperature, humidity);
                card.append(cardBody);
                $("#forecast").append(card);

            }

        }
    });

}





//     GIVEN a weather dashboard with form inputs
// WHEN I search for a city
// THEN I am presented with current and future conditions for that city and that city is added to the search history
// WHEN I view current weather conditions for that city
// THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
// WHEN I view the UV index
// THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
// WHEN I view future weather conditions for that city
// THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
// WHEN I click on a city in the search history
// THEN I am again presented with current and future conditions for that city
// WHEN I open the weather dashboard
// THEN I am presented with the last searched city forecast
