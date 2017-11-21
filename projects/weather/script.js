var apikey = "6b14a9b854248954c39c4c25c61fe151";
var weathertitle = "It's currently <span id=\"temp\"></span> <span id=\"unit\"></span> in <span id=\"cityname\"></span>";
var weathersub = "The current condition is: <span id=\"condition\"></span>."
var curdata = null;

$(function () {
    $("#refresh").click(refresh);
    $("#unittoggle").click(toggleunit);
    refresh();
});

function refresh() {
    $("#title, #subtitle").fadeTo(400, 0);
    $("#refresh").addClass("is-loading");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var latitude;
            var longtitude;
            latitude = position.coords.latitude;
            longtitude = position.coords.longitude;
            loadWeather(latitude, longtitude);
        });
    } else {
        $("#title").html("This service requires Geolocation to be enabled..");
        $("#subtitle").html("Please allow this site to use your location");
        $("#refresh").removeClass("is-loading");
        $("#title, #subtitle").fadeTo(400, 1);
        return;
    }
}

function loadWeather(latitude, longtitude) {

    function success(data) {;
        $("#background").css("background-image", "url(" + getWeatherimage(data.weather[0].id) + ")");
        curdata = data;
        processWeather(data);
        $("#refresh").removeClass("is-loading");
        $("#title, #subtitle").fadeTo(400, 1);
    }

    function error(stuff) {
        $("#title").html("Please check your network connection..");
        $("#subtitle").html("...");
        $("#refresh").removeClass("is-loading");
        $("#title, #subtitle").fadeTo(400, 1);
    }
    $.ajax({
        url: "https://api.openweathermap.org/data/2.5/weather",
        data: {
            lat: latitude,
            lon: longtitude,
            APPID: apikey
        },
        headers: {
            Accept: "application/json"
        },
        success: success,
        error: error
    });
}

function processWeather(data) {
    $("#title").html(weathertitle);
    $("#cityname").html(data.name);
    if ($("#unittoggle").html() == "°F") {
        var temp = data.main.temp * (9 / 5) - 459.67
        temp = temp.toFixed(1);
        $("#temp").html(temp);

    } else {
        var temp = data.main.temp - 273.15;
        temp = Math.round(temp);
        $("#temp").html(temp);
    }
    $("#subtitle").html(weathersub);
    $("#condition").html(data.weather[0].description);
    $("#unit").html($("#unittoggle").html());
}

function getWeatherimage(id) {
    var baseurl = "http://source.unsplash.com/collection/{0}/1920x1080";
    var filter = "{0}";
    if (id <= 200 && id <= 238) {
        return baseurl.replace(filter, '1414458');
    } else if (id >= 300 && id <= 531) {
        return baseurl.replace(filter, '1414430');
    } else if (id >= 600 && id <= 622) {
        return baseurl.replace(filter, '1414463');
    } else if (id == 800) {
        return baseurl.replace(filter, '1415514');
    } else if (id >= 801 && id <= 802) {
        return baseurl.replace(filter, '1414444');
    } else if (id >= 803 && id <= 804) {
        return baseurl.replace(filter, '1414447');
    } else {
        return baseurl.replace(filter, '1414457');
    }
}

function toggleunit() {
    if ($("#unittoggle").html() == "°F") {
        $("#unittoggle").html("°C");
    } else {
        $("#unittoggle").html("°F");
    }
    processWeather(curdata);
}