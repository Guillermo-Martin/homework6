// Targeting HTML elements
var $submit = $('.btn');
var $city = $('#city');
var $searchHistory = $('#searchHistory');
var $fullWeather = $('#fullWeather');

// Store search history
var searchHistory = [];

// check local storage
searchHistory = JSON.parse(localStorage.getItem("history"));
if(searchHistory !== null){

    // create a ul element and append to search history
    var $ulEl = $('<ul>');
    $ulEl.attr('id', 'cityHistory');
    $searchHistory.append($ulEl);

    // create a button for every city in local storage (searchHistory array)
    for(var i = 0; i < searchHistory.length; i++){
        // create an li
        var $liEl = $('<li>');
        // append to ul
        $ulEl.append($liEl);
        // create button
        var $button = $('<button>');
        $button.attr('type', 'submit');
        $button.addClass('btn btn-primary')
        $button.attr('data-city', searchHistory[i]);
        // append to li
        $liEl.append($button);
        // change button text
        $button.text(searchHistory[i]);
        // add event listener
        $button.on("click", function(){
            
            // =========== AJAX REQUESTS ==============
            cityName = $(this).attr('data-city');
            // console.log(cityName);
            var apiKey = "5dec8c645acb4bf246d950b6137af75e";
            var queryURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${apiKey}`;
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
        
                    // color coordinate uv index
                    // console.log(uvIndex)
                    // change background color using jquery:  https://stackoverflow.com/questions/4283141/jquery-change-background-color
                    if(uvIndex <= 2){
                        // alert("between 0 and 2");
                        $currentUV.css("background-color", "green");
                        $currentUV.css("color", "white");
                    } else if (uvIndex <= 5) {
                        // alert("between 0 and 5");
                        $currentUV.css("background-color", "orange");
                        $currentUV.css("color", "white");
                    } else {
                        // alert("uv is extreme!");
                        $currentUV.css("background-color", "red");
                        $currentUV.css("color", "white");
                    }
        
        
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
                var $fiveDayForecast = $('#fiveDayForecast');

                for(var j = 0; j < 5; j++){
                    // Gather five day data
                    var fiveDayDate = fiveDayRes.list[j].dt_txt;
                    var fiveDayTemp = fiveDayRes.list[j].main.temp;
                    var fiveDayHumidity = fiveDayRes.list[j].main.humidity;

                    // Create a card component
                    var $card = $('<div>');
                    $card.addClass('card');
                    $card.attr('style', 'width: 18rem');
                    // append to div
                    $fiveDayForecast.append($card);

                    var $cardBody = $('<div>');
                    $cardBody.addClass('card-body');
                    $card.append($cardBody);

                    var $cardTitle = $('<h5>');
                    $cardTitle.addClass('card-title');
                    $cardBody.append($cardTitle);
                    $cardTitle.text("Date: " + fiveDayDate);

                    var $cardSubtitle = $('<h6>');
                    $cardSubtitle.addClass('card-subtitle mb-2 text-muted');
                    $cardBody.append($cardSubtitle);
                    $cardSubtitle.text("Temperature: " + fiveDayTemp + " ℉");

                    var $cardText = $('<p>');
                    $cardText.addClass('card-text');
                    $cardBody.append($cardText);
                    $cardText.text("Humidity: " + fiveDayHumidity + "%");

                    // Gather five day data
                    var fiveDayDate = fiveDayRes.list[j].dt_txt;
                    var fiveDayTemp = fiveDayRes.list[j].main.temp;
                    var fiveDayHumidity = fiveDayRes.list[j].main.humidity;
                }

                
            })
            
        });
        
    }   

} else {
    searchHistory = [];
}



// Submit button
$submit.on("click", function(event){
    event.preventDefault();

    ajaxRequest();

});



// FUNCTION AJAX REQUEST
function ajaxRequest(){
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

            // color coordinate uv index
            // console.log(uvIndex)
            // change background color using jquery:  https://stackoverflow.com/questions/4283141/jquery-change-background-color
            if(uvIndex <= 2){
                // alert("between 0 and 2");
                $currentUV.css("background-color", "green");
                $currentUV.css("color", "white");
            } else if (uvIndex <= 5) {
                // alert("between 0 and 5");
                $currentUV.css("background-color", "orange");
                $currentUV.css("color", "white");
            } else {
                // alert("uv is extreme!");
                $currentUV.css("background-color", "red");
                $currentUV.css("color", "white");
            }


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
        var $fiveDayForecast = $('#fiveDayForecast');

        for(var j = 0; j < 5; j++){
            // Gather five day data
            var fiveDayDate = fiveDayRes.list[j].dt_txt;
            var fiveDayTemp = fiveDayRes.list[j].main.temp;
            var fiveDayHumidity = fiveDayRes.list[j].main.humidity;

            // Create a card component
            var $card = $('<div>');
            $card.addClass('card');
            $card.attr('style', 'width: 18rem');
            // append to div
            $fiveDayForecast.append($card);

            var $cardBody = $('<div>');
            $cardBody.addClass('card-body');
            $card.append($cardBody);

            var $cardTitle = $('<h5>');
            $cardTitle.addClass('card-title');
            $cardBody.append($cardTitle);
            $cardTitle.text("Date: " + fiveDayDate);

            var $cardSubtitle = $('<h6>');
            $cardSubtitle.addClass('card-subtitle mb-2 text-muted');
            $cardBody.append($cardSubtitle);
            $cardSubtitle.text("Temperature: " + fiveDayTemp + " ℉");

            var $cardText = $('<p>');
            $cardText.addClass('card-text');
            $cardBody.append($cardText);
            $cardText.text("Humidity: " + fiveDayHumidity + "%");

            // Gather five day data
            var fiveDayDate = fiveDayRes.list[j].dt_txt;
            var fiveDayTemp = fiveDayRes.list[j].main.temp;
            var fiveDayHumidity = fiveDayRes.list[j].main.humidity;
        }

        
    })
}