// Targeting HTML elements
var $submit = $('#submit');
var $city = $('#city');
var $searchHistory = $('#searchHistory');

// Store search history
var searchHistory = [];

// check local storage
searchHistory = JSON.parse(localStorage.getItem("history"));
if(searchHistory !== null){
    for(var i = 0; i < searchHistory.length; i++){
        // create p element
        var $pEl = $('<p>');
        // change text of p element
        $pEl.text(searchHistory[i]);
        // append to div
        $searchHistory.append($pEl);
    }   
} else {
    searchHistory = [];
}



// Submit button
$submit.on("click", function(event){
    event.preventDefault();

    // get city name
    // URI encode:  https://www.sitepoint.com/jquery-decode-url-string/
    var cityName = encodeURIComponent($city.val().trim());
    // console.log(cityName);

    // Push city into searchHistory array
    searchHistory.push(cityName);
    console.log(searchHistory);

    // Save cities array into local storage
    localStorage.setItem("history", JSON.stringify(searchHistory));

    // AJAX request for main weather
    var apiKey = "5dec8c645acb4bf246d950b6137af75e";
    var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;
    // console.log(queryURL);

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        // console.log(response);

        // Gathering current weather data
        var searchedCity = response.name;
        var currentTemp = response.main.temp;
        var currentHumidity = response.main.humidity;
        var currentWind = response.wind.speed;
        var longitude = response.coord.lon;
        var latitude = response.coord.lat;
        
        // Displaying current weather data in html
        var $searchedCity = $('#searched-city');
        var $currentTemp = $('#current-temp');
        var $currentHumidity = $('#current-humidity');
        var $currentWind = $('#current-wind');

        $searchedCity.text(searchedCity);
        // Unicode:  https://www.compart.com/en/unicode/U+2109
        $currentTemp.text("Current Temperature: " + currentTemp + " ℉");
        $currentHumidity.text("Current Humidity: " + currentHumidity + "%");
        $currentWind.text("Wind Speed: " + currentWind + " MPH");


        // AJAX request for UV index
        var uvURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${latitude}&lon=${longitude}`;

        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function(uvResponse){
            // console.log(uvResponse);

            // Getting UV index
            var uvIndex = uvResponse.value;

            // Displaying UV index in html
            var $currentUV = $('#uv-index');
            $currentUV.text("UV Index: " + uvIndex);
        });


    });

    // Ajax request for 5-day
    var fiveDayURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&units=imperial&appid=${apiKey}`

    $.ajax({
        url: fiveDayURL,
        method: "GET"
    }).then(function(fiveDayRes){
        console.log(fiveDayRes);
        // console.log(typeof fiveDayRes.list); // this is an array

        // Gathering five day data
        var fiveDayDate = fiveDayRes.list[0].dt_txt;
        var fiveDayTemp = fiveDayRes.list[0].main.temp;
        var fiveDayHumidity = fiveDayRes.list[0].main.humidity;

        // Displaying five day data in html
        var $fiveDayDate = $('#five-day-date');
        var $fiveDayTemp = $('#five-day-temp');
        var $fiveDayHumidity = $('#five-day-humidity');

        $fiveDayDate.text(fiveDayDate);
        $fiveDayTemp.text("Temperature: " + fiveDayTemp + " ℉");
        $fiveDayHumidity.text("Humidity: " + fiveDayHumidity + "%");
        
        

        
    })


});