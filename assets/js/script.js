// Targeting HTML elements
var $submit = $('#submit');
var $city = $('#city');




// Submit button
$submit.on("click", function(event){
    event.preventDefault();
    
    // get city name
    var cityName = $city.val();
    console.log(cityName);
})