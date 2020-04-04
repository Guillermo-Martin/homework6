// Targeting HTML elements
var $submit = $('#submit');
var $city = $('#city');




// Submit button
$submit.on("click", function(event){
    event.preventDefault();
    
    // get city name
    // URI encode:  https://www.sitepoint.com/jquery-decode-url-string/
    var cityName = encodeURIComponent($city.val().trim());
    console.log(cityName);

    // AJAX request for main weather
    var apiKey = "5dec8c645acb4bf246d950b6137af75e";
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;
    console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        // console.log(response);

        // city:  console.log(response.name);
        var searchedCity = response.name;
        // current temp:  console.log(response.main.temp);
        var currentTemp = response.main.temp;
        // current humidity:  console.log(response.main.humidity);
        var currentHumidity = response.main.humidity;
        // current wind speed console.log(response.wind.speed);
        var currentWind = response.wind.speed;
        // longitude for uv index:  console.log(response.coord.lon);
        var longitude = response.coord.lon;
        // latitude for uv index:  console.log(response.coord.lat);
        var latitude = response.coord.lat;
        


        // AJAX request for UV index
        var uvURL = `http://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${latitude}&lon=${longitude}`;

        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function(uvResponse){
            // console.log(uvResponse);

            // uv index:  console.log(uvResponse.value)
            var uvIndex = uvResponse.value;

        });
    
    });
    
});