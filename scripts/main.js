// Set api token for mapbox
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaXF1ZWlkb28iLCJhIjoiY2tta2w5ZG1zMTIyODJvcWtlMGQyNzFybCJ9.b0xq0lhMNkzDULtaiQ6-Ig';

// api token for openWeatherMap
var openWeatherMapUrl = 'https://api.openweathermap.org/data/2.5/weather';
var openWeatherMapUrlApiKey = '7d7703fc298cdb7a075ae39addb6b4da';

//landing variable
var landing = [-97.43907175057747, 31.417202518629118];

// Initiate map
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/outdoors-v11',
  center: landing,
  zoom: 1
});

//init geocoder
var geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken,
  language: 'en-GB', // Specificeert taal als engels
  mapboxgl: mapboxgl
});

map.addControl(geocoder);

map.flyTo({
  center: landing,
  zoom: 6,
  speed: 0.6,
  curve: 1,
  easing(t){
  return t;
  }
});

//marker and popup window
var popup = new mapboxgl.Popup().setHTML('<p>This is where the Interplanetary Transport System will be landing.</p>');
var marker = new mapboxgl.Marker({ color: '#1c1c1c'})
.setLngLat(landing)
.setPopup(popup)
.addTo(map);




//weather
function getAPIdata() {

  // construct request
  var request = 'https://api.openweathermap.org/data/2.5/weather?lat=31.417202518629118&lon=-97.43907175057747&appid=7d7703fc298cdb7a075ae39addb6b4da';

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
    weatherBox.innerHTML = degC + '&#176;C <br>' + response.weather[0].description;
  });
}

// init data stream
getAPIdata();