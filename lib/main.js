'use strict';

document.addEventListener('DOMContentLoaded', function () {
  updateContact();
});

// PoS map
var map = void 0;
var infowindow = void 0;
var service = void 0;
var bounds = void 0;
var locations = ['On Tap Craftgallery', 'Wartsaal Kaffee Bar Bücher', 'Restaurant Eiger'];

function updateContact() {
  // make life hard for bots
  var user = 'unikum';
  var dom = 'ikmail';
  var link = document.createElement('a');

  var linkTpl = atob('bWFpbHRvOiV1c2VyJUAlZG9tYWluJS5jb20=');
  var href = linkTpl.replace('%user%', user).replace('%domain%', dom);
  var textTpl = atob('JXVzZXIlQCVkb21haW4lLmNvbQ==');
  var text = textTpl.replace('%user%', user).replace('%domain%', dom);

  link.setAttribute('href', href);
  link.innerText = text;
  document.getElementById('cntct').appendChild(link);
}

function initMap() {
  map = new google.maps.Map(document.getElementById('pos-map'), {
    center: { lat: 46.94801819792631, lng: 7.448263930454019 }, //,
    zoom: 13,
    mapId: '7ffd2af25c6a5a58',
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false
  });

  bounds = new google.maps.LatLngBounds();
  infowindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);

  locations.forEach(function (location, locIndex) {
    var request = {
      query: location,
      fields: ['name', 'geometry', 'formatted_address', 'place_id']
    };

    service.findPlaceFromQuery(request, function (results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        // add only the top-ranked result
        createMarker(results[0]);
        // fit bounds of map on last place
        if (locIndex == locations.length - 1) {
          map.fitBounds(bounds);
        }
      }
    });
  });
}

function createMarker(place) {
  if (!place.geometry || !place.geometry.location) return;

  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });
  bounds.extend(marker.getPosition());

  // show location info on click
  google.maps.event.addListener(marker, "click", function () {
    var content = document.createElement("div");

    var nameElement = document.createElement("span");
    nameElement.textContent = place.name;
    nameElement.classList.add('subtitle', 'is-size-6');
    content.appendChild(nameElement);

    var placeAddressElement = document.createElement("p");
    placeAddressElement.textContent = place.formatted_address;
    content.appendChild(placeAddressElement);

    infowindow.setContent(content);
    infowindow.open(map, marker);
  });
}

window.initMap = initMap;