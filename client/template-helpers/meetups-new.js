Template.meetupsNew.rendered = function () {
  var labelsOff = [{
      featureType: "administrative",
      elementType: "labels",
      stylers: [{
          visibility: "off"
      }]
  }, {
      featureType: "poi",
      elementType: "labels",
      stylers: [{
          visibility: "off"
      }]
  }, {
      featureType: "water",
      elementType: "labels",
      stylers: [{
          visibility: "off"
      }]
  }, {
      featureType: "road",
      elementType: "labels",
      stylers: [{
          visibility: "off"
      }]
  }];
  var labelsOn = [{
      featureType: "administrative",
      elementType: "labels",
      stylers: [{
          visibility: "off"
      }]
  }, {
      featureType: "poi",
      elementType: "labels",
      stylers: [{
          visibility: "off"
      }]
  }, {
      featureType: "water",
      elementType: "labels",
      stylers: [{
          visibility: "off"
      }]
  }, {
      featureType: "road",
      elementType: "labels",
      stylers: [{
          visibility: "on"
      }]
  }];

  var geolocation = Geolocation.currentLocation();
  var coords      = null;

  if ( geolocation === null ) {
    coords = {
      latitude : 33,
      longitude : -112
    }
  } else {
    coords = {
      latitude : geolocation.coords.latitude,
      longitude : geolocation.coords.longitude
    }
  }

  var mapSettings = {
    center : new google.maps.LatLng( coords.latitude, coords.longitude ),
    zoom : 13,
    zoomControl : true,
    mapTypeControl : false,
    scaleControl : true,
    scrollwheel: false,
    streetViewControl : false,
    disableDoubleClickZoom: true
  };

  window.scaleFactor = 1600;
  window.scale       = window.scaleFactor;
  window.currentMap  = new google.maps.Map( document.getElementById( 'map-canvas' ), mapSettings );
  google.maps.event.addListener( window.currentMap, 'click', function ( np ) {
    window.setCenter( np.latLng.lat(), np.latLng.lng() );
  } )
  google.maps.event.addListener( window.currentMap, 'zoom_changed', function () {
    google.maps.event.addListenerOnce( window.currentMap, 'tilesloaded', function () {
      if ( window.currentMap.getZoom() >= 10 ) {
        // A little more detailed
        window.currentMap.setOptions( {
          styles: labelsOn
        } );
      } else {
        // a little less detailed
        window.currentMap.setOptions( {
          styles: labelsOff
        } );
      }
    } );
  } );

  /**
   * Set the center of the user's meetup circle
   */
  window.setCenter = function ( lat, lng ) {
    var center         = new google.maps.LatLng( lat, lng );
    var meetupLocation = {
      strokeColor: '#60C3AB',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#60C3AB',
      fillOpacity: 0.35,
      map: window.currentMap,
      center: center,
      radius: window.scale
    };

    if ( window.meetupCircle ) {
      window.meetupCircle.setMap( null );
    }

    window.meetupCircle = new google.maps.Circle( meetupLocation )
    window.currentMap.panTo( window.meetupCircle.getCenter() )
    // TODO rezoom the map according to the radius
  }
}

Template.meetupsNew.events( {
  'click .map-action-button' : function ( e ) {
    e.preventDefault();

    var geolocation = Geolocation.currentLocation();

    window.setCenter(
      geolocation.coords.latitude,
      geolocation.coords.longitude
    );
  }
} );