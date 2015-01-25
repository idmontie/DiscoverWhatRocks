Template.meetupsNew.created = function () {
  Session.set( 'twitterInvites', null );
};

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

  window.previewMarkers = [];
  window.markersDirty   = false;
  window.scaleFactor    = 1600;
  window.scale          = window.scaleFactor;
  window.infowindow     = new google.maps.InfoWindow();
  var geolocation       = Geolocation.currentLocation();
  var coords            = null;

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
  window.currentMap = new google.maps.Map( document.getElementById( 'map-canvas' ), mapSettings );

  // ======
  // Events
  // ======
  /**
   * Listen for Map Clicks
   */
  google.maps.event.addListener( window.currentMap, 'click', function ( np ) {
    window.setCenter( np.latLng.lat(), np.latLng.lng() );
  } );

  /**
   * Listen for Map Zoom Change
   */
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

  $( '[name=meetupType]' ).change( function () {
    var placeType = $( this ).val();
    window.setPlaceMarkers( placeType );
  } )

  $( '[name=radius]' ).change( function () {
    window.scale = window.scaleFactor * $( this ).val();

    if ( window.meetupCircle ) { 
      var lat = window.meetupCircle.center.lat();
      var lng = window.meetupCircle.center.lng();

      window.setCenter( lat, lng );
    }
  } )

  // ============
  // Page Helpers
  // ============

  window.createMarker = function ( place ) {
    var marker = new google.maps.Marker( {
      map: window.currentMap,
      position: place.geometry.location
    } )

    window.previewMarkers.push( marker )

    /*jshint camelcase: false */
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    window.updateMarker( marker, place.place_id )
    /*jshint camelcase: true */
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
  }

  window.updateMarker = function ( markerReference, placeId ) {
    var service = new google.maps.places.PlacesService( window.currentMap )

    var request = {
      placeId : placeId
    }

    google.maps.event.addListener( markerReference, 'click', function () {
      var self = this

      // anonymous because we need scoping
      service.getDetails( request, function ( place, status ) {

        if ( status == google.maps.places.PlacesServiceStatus.OK ) {
          window.infowindow.setContent( place.name )
          window.infowindow.open( window.currentMap, self )
        }
      } )
    } )
  }

  window.nearbyCallback = function ( results, status ) {
    var i = 0

    // Place the markers on the map
    if ( status == google.maps.places.PlacesServiceStatus.OK ) {
      // Destroy old markers
      if ( window.previewMarkers ) {
        for ( i = 0; i < window.previewMarkers.length; i++ ) {
          window.previewMarkers[i].setMap( null )
        }
        window.previewMarkers = []
      }

      for ( i = 0; i < results.length; i++ ) {
        if ( results[i] !== null &&
            typeof results[i] !== 'undefined' )
          window.createMarker( results[i] )
      }
    }

    // TODO alert if failed or no places found!
  }

  window.setPlaceMarkers = function ( placeType, keywords ) {
    // set markers
    var service   = new google.maps.places.PlacesService( window.currentMap )
    var placeRequest = {
      location : window.meetupCircle.getCenter(),
      radius : window.scale,
      types  : [placeType]
    }

    if ( keywords ) {
      placeRequest.keyword = keywords
    }

    service.radarSearch( placeRequest, window.nearbyCallback )
  }

  // TODO setPlaceMarkers when "[name=meetupType]" changes

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

    var placeType = $( '[name=meetupType]' ).val();
    window.setPlaceMarkers( placeType );
  }
}

// TODO validate

Template.meetupsNew.helpers( {
  twitterInvites : function () {
    return Session.get( 'twitterInvites' );
  },
  placeTypes : function () {
    return PlaceTypes.find()
  }
} )

Template.meetupsNew.events( {
  'click .map-action-button' : function ( e ) {
    e.preventDefault();

    var geolocation = Geolocation.currentLocation();

    window.setCenter(
      geolocation.coords.latitude,
      geolocation.coords.longitude
    );
  }, 
  'click #submit' : function ( e ) {
    e.preventDefault();

    var name           = $('[name=name]').val();
    var day            = $('[name=date]').val();
    var time           = $('[name=time]').val();
    var placeType      = $('[name=meetupType]').val();
    var lat            = window.meetupCircle.center.lat();
    var lng            = window.meetupCircle.center.lng();
    var radius         = window.scale;
    var twitterInvites = Session.get( 'twitterInvites' );

    // TODO validation
    var meetup = {
      name : name,
      day : day,
      time : time,
      placeType : placeType,
      location : {
        latitude : lat,
        longitude : lng,
        radius : radius
      },
      twitterInvites : twitterInvites
    };

    Meteor.call( 'meetupInsert', meetup, function ( error, data ) {

    } );

  }
} );