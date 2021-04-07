// Set api tokens
mapboxgl.accessToken = 'pk.eyJ1IjoiZGFuaXF1ZWlkb28iLCJhIjoiY2tta2w5ZG1zMTIyODJvcWtlMGQyNzFybCJ9.b0xq0lhMNkzDULtaiQ6-Ig';
var openWeatherMapUrlApiKey = '7d7703fc298cdb7a075ae39addb6b4da';

// global variable voor het gemak
var landing = [-97.43907175057747, 31.417202518629118];


// Init map; start van ver zodat het inzoomt op de landingsplaats
var map = new mapboxgl.Map({
container: 'map',
style: 'mapbox://styles/mapbox/light-v10',
center: landing,
zoom: 1,
});

// popup voor de marker hieronder
var popup = new mapboxgl.Popup().setHTML('<h3>SpaceX Hangar</h3><p>This is where the SpaceX ITS will be landing.</p>');


// marker voor de landingplaats
var marker = new mapboxgl.Marker({ color: '#1c1c1c'})
.setLngLat(landing)
.setPopup(popup)
.addTo(map);

// zoom in naar landingsplaats
map.flyTo({
  center: landing,
  zoom: 6,
  speed: 0.8,
  curve: 1,
});

// landingWeather apart van geocode weather anders werd het verwarrend
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

  // pakt de forecast div zodat de onderstaande data erin kan
   var weatherBox = document.getElementById('forecast');
   var degC = Math.floor(response.main.temp - 273.15);
   // temperatuur, beschrijving, en icon
   weatherBox.innerHTML = degC + '&#176;C <br>' + response.weather[0].description+ '<br>' + '<img src="https://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png">';

   // voor de suggesties heb ik if statements gebruikt
   var suggestw = document.getElementById('suggest');
   if (degC <= -10) {
    suggestw.innerHTML = "<p>Don't even go outside at this point it is FREEZING</p>";
   }if(degC > -10 && degC <= 0){
    suggestw.innerHTML = "<p>Get your winter outfit ready! It's COLD cold.</p>";
   }if(degC > 0 && degC <= 10){
    suggestw.innerHTML = "<p>It might be a bit chilly, wear a jacket!</p>";
   }if(degC > 10 && degC <= 20){
    suggestw.innerHTML = "<p>The weather is doable. Maybe wear a sweater.</p>";
   }if(degC > 20 && degC <=30){
    suggestw.innerHTML = "<p>It's warm enough to wear shorts @ Dutch people.</p>";
   }if(degC >=30){
    suggestw.innerHTML = "<p>Boiling hot. Wear your sunscreen please!</p>";
   }
 });
}

// functie roepen
getLandingWeather();

// geocoder aanmaken, engels als taal ingesteld en types zoektermen
var geocoder = new MapboxGeocoder({
accessToken: mapboxgl.accessToken,
types: 'country,region,place,postcode,locality,neighborhood',
language: 'en-GB'
});

// geocoder toevoegen
map.addControl(geocoder);

// deze functie loopt zodra geocoder een resultaat heeft in search bar
geocoder.on('result', function(response) {
  // verandert 'current weather at landing site' naar gewoon 'current weather' (dit verandert weer terug zodra je op return to landing drukt)
  document.getElementById('status').innerHTML = 'Current weather:';

  map.flyTo({
    center: [response.result.center[0], response.result.center[1]],
    zoom: 10,
    speed: 0.8,
    curve: 1,
    essential: true // this animation is considered essential with respect to prefers-reduced-motion
  });

  // link voor openweathermap huidige weersituatie
  var request = 'https://api.openweathermap.org/data/2.5/weather?lat='+ response.result.center[1] +'&lon=' + response.result.center[0] + '&appid=' + openWeatherMapUrlApiKey;

  // pakt het huidige weer
  fetch(request)

   // parse response to JSON format
  .then(function(response) {
    return response.json();
  })
    
  // do something with response
  .then(function(response) {
    // pakt div met id forecast om de onderstaande data in te gooien
    var weatherBox = document.getElementById('forecast');
    var degC = Math.floor(response.main.temp - 273.15);
    // temperatuur, beschrijving, en icon
    weatherBox.innerHTML = degC + '&#176;C <br>' + response.weather[0].description + '<br>' + '<img src="https://openweathermap.org/img/wn/' + response.weather[0].icon + '@2x.png">';
    // weer de suggesties voor het huidige weer
    var suggestw = document.getElementById('suggest');
     if (degC <= -10) {
      suggestw.innerHTML = "<p>Don't even go outside at this point it is FREEZING</p>";
     }if(degC >= -10 && degC <= 0){
      suggestw.innerHTML = "<p>Get your winter outfit ready! It's COLD cold.</p>";
     }if(degC >= 0 && degC <= 10){
      suggestw.innerHTML = "<p>It might be a bit chilly, wear a jacket!</p>";
     }if(degC >= 10 && degC <= 20){
      suggestw.innerHTML = "<p>The weather is doable. Maybe wear a sweater.</p>";
     }if(degC >= 20 && degC <=30){
      suggestw.innerHTML = "<p>It's warm enough to wear shorts @ Dutch people.</p>";
     }if(degC >=30){
      suggestw.innerHTML = "<p>Boiling hot. Wear your sunscreen please!</p>";
     }

  });
});

// knop om terug te keren naar landing
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