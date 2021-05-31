'use strict';

function initMap() {
  const seoul = { lat: 37.5642135, lng: 127.0016985 };
  const map = new google.maps.Map(document.querySelector('.search__map'), {
    zoom: 15,
    center: seoul,
  });

  new google.maps.Marker({
    position: seoul,
    map: map,
  });
}
