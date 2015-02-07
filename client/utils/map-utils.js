window._map_utils = {};

// ====================
// Common Map Variables
// ====================
window._map_utils.labelsOff = [{
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

window._map_utils.labelsOn = [{
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

// ====================
// Common Map Functions
// ====================
window._map_utils.reset = function () {
  window.previewMarkers = [];
  window.previewMarkers = [];
  window.markersDirty   = false;
  window.scaleFactor    = 1600;
  window.scale          = window.scaleFactor;
  window.currentCircle  = null;
  window.meetup         = null;
  window.voteMarkers    = null;
  window.infowindow     = new google.maps.InfoWindow();
}


window._map_utils.setup = function ( el, pos ) {
  var mapSettings = {
    center : pos,
    zoom : 13,
    zoomControl : true,
    mapTypeControl : false,
    scaleControl : true,
    scrollwheel: false,
    streetViewControl : false,
    disableDoubleClickZoom: true
  };
  return new google.maps.Map( el, mapSettings ); 
}

window._map_utils.listenForZoom = function ( map, labelsOn, labelsOff ) {
  google.maps.event.addListener( map, 'zoom_changed', function () {
    google.maps.event.addListenerOnce( map, 'tilesloaded', function () {
      if ( map.getZoom() >= 10 ) {
        // A little more detailed
        map.setOptions( {
          styles: labelsOn
        } );
      } else {
        // a little less detailed
        map.setOptions( {
          styles: labelsOff
        } );
      }
    } );
  } );
};

window._map_utils.createMarker = function ( mapReference, previewReference, updateCallback ) {
  return function ( place ) {
    var marker = new google.maps.Marker( {
      map: window[mapReference],
      position: place.geometry.location
    } );

    window[previewReference].push( marker );

    /*jshint camelcase: false */
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    window[updateCallback]( marker, place.place_id );
    /*jshint camelcase: true */
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
  }
};

window._map_utils.updateMarker = function ( mapReference, infoWindowReference ) {
  return function ( markerReference, placeId ) {
    var service = new google.maps.places.PlacesService( window[mapReference] );

    var request = {
      placeId : placeId
    };

    google.maps.event.addListener( markerReference, 'click', function () {
      var self = this;

      // anonymous because we need scoping
      service.getDetails( request, function ( place, status ) {
        if ( status === google.maps.places.PlacesServiceStatus.OK ) {
          window[infoWindowReference].setContent( place.name );
          window[infoWindowReference].open( window[mapReference], self );
        }
      } );
    } );
  }
};

window._map_utils.nearbyCallback = function ( createMarkerCallback, previewMarkersReference ) {
  return function ( results, status ) {
    var i = 0;

    // Place the markers on the map if OK
    if ( status === google.maps.places.PlacesServiceStatus.OK ) {
      // Remove old markers
      if ( window[previewMarkersReference] ) {
        for ( i = 0; i < window[previewMarkersReference].length; i++ ) {
          window[previewMarkersReference][i].setMap( null );
        }

        window[previewMarkersReference] = []
      }

      // Add the new ones
      for ( i = 0; i < results.length; i++ ) {
        if ( results[i] !== null &&
             typeof results[i] !== 'undefined' ) {
          createMarkerCallback( results[i] );
        }
      }
    } else {
      // TODO alert if fails or no places found!
    }
  };
};

window._map_utils.setPlaceMarkers = function ( nearbyCallback, currentMapReference, currentCircleReference, scale ) {
  return function ( placeTypeSlug, keywords ) {
    var service = new google.maps.places.PlacesService( window[currentMapReference] );
    var placeRequestSettings = {
      location : window[currentCircleReference].getCenter(),
      radius : scale,
      types : [placeTypeSlug]
    };

    if ( keywords ) {
      placeRequestSettings.keyword = keywords;
    }

    service.radarSearch( placeRequestSettings, nearbyCallback );
  };
};
