// Set api token
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaXF1ZWlkb28iLCJhIjoiY2tta2w5ZG1zMTIyODJvcWtlMGQyNzFybCJ9.b0xq0lhMNkzDULtaiQ6-Ig';
var openWeatherMapUrlApiKey = '7d7703fc298cdb7a075ae39addb6b4da';


var landing = [-97.43907175057747, 31.417202518629118];


// Init map
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/light-v10',
center: landing,
zoom: 1,
});

var popup = new mapboxgl.Popup().setHTML('<h3>SpaceX Hangar</h3><p>This is where the SpaceX ITS will be landing.</p>');



var marker = new mapboxgl.Marker({ color: '#1c1c1c'})
.setLngLat(landing)
.setPopup(popup)
.addTo(map);


map.flyTo({
  center: landing,
  zoom: 6,
  speed: 0.8,
  curve: 1,
});

// startup weather
function getLandingWeather() {
 // construct request
 var request = 'https://api.openweathermap.org/data/2.5/weather?lat='+ landing[1] +'&lon='+ landing[0] +'&appid=' + openWeatherMapUrlApiKey;

 // get current weather
 fetch(request)  
  
 // parse response to JSON format
 .then(function(response) {
   return response.json();
 })
  
 // do something with response
 .then(function(response) {
   // show full JSON object
   // console.log(response);
   var weatherBox = document.getElementById('forecast');
   var degC = Math.floor(response.main.temp - 273.15);
   weatherBox.innerHTML = degC + '&#176;C <br>' + response.weather[0].description+ '<br>' + '<img src="https://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png">';
 });
}

// init data stream
getLandingWeather();

var geocoder = new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
types: 'country,region,place,postcode,locality,neighborhood'
});


map.addControl(geocoder);

geocoder.on('result', function(response) {
document.getElementById('status').innerHTML = 'Current weather:';

map.flyTo({
  center: [response.result.center[0], response.result.center[1]],
  zoom: 10,
  speed: 0.8,
  curve: 1,
  essential: true // this animation is considered essential with respect to prefers-reduced-motion
});

var request = 'https://api.openweathermap.org/data/2.5/weather?lat='+ response.result.center[1] +'&lon=' + response.result.center[0] + '&appid=' + openWeatherMapUrlApiKey;
// get current weather
fetch(request)

 // parse response to JSON format
.then(function(response) {
  return response.json();
})
  
// do something with response
.then(function(response) {
  // show full JSON object
  // console.log(response);

  var weatherBox = document.getElementById('forecast');
  var degC = Math.floor(response.main.temp - 273.15);
  weatherBox.innerHTML = degC + '&#176;C <br>' + response.weather[0].description + '<br>' + '<img src="https://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png">';

});
});

document.getElementById('knop').onclick = function() {
  map.flyTo({
  center: landing,
  zoom: 6,
  speed: 0.8,
  essential: true // this animation is considered essential with respect to prefers-reduced-motion
  });
  document.getElementById('status').innerHTML = 'Current weather at landing site:';
  getLandingWeather();
};