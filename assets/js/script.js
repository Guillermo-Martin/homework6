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
        $currentTemp.text(currentTemp);
        $currentHumidity.text(currentHumidity);
        $currentWind.text(currentWind);


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
            $currentUV.text(uvIndex);
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
        $fiveDayTemp.text(fiveDayTemp);
        $fiveDayHumidity.text(fiveDayHumidity);
        
        

        
    })


});