Template.meetupsNew.created = function () {
  Session.set( 'twitterInvites', null );
};

Template.meetupsNew.rendered = function () {
  var labelsOff   = window._map_utils.labelsOff;
  var labelsOn    = window._map_utils.labelsOn;
  var geolocation = Geolocation.currentLocation();
  var coords      = null;
  window._map_utils.reset();

  // ==========
  // Set up Map
  // ==========
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

  var center = new google.maps.LatLng( coords.latitude, coords.longitude );

  window.currentMap = window._map_utils.setup(
    document.getElementById( 'map-canvas' ),
    center
  );

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
  window._map_utils.listenForZoom(
      window.currentMap,
      labelsOn,
      labelsOff
  );

  $( '[name=meetupType]' ).change( function () {
    var placeType = $( this ).val();
    window.setPlaceMarkers( placeType );
  } )

  $( '[name=radius]' ).change( function () {
    window.scale = window.scaleFactor * $( this ).val();

    if ( window.currentCircle ) { 
      var lat = window.currentCircle.center.lat();
      var lng = window.currentCircle.center.lng();

      window.setCenter( lat, lng );
    }
  } )

  // ============
  // Page Helpers
  // ============
  window.createMarker = window._map_utils.createMarker(
      'currentMap',
      'previewMarkers',
      'updateMarker'
  );

  window.updateMarker = window._map_utils.updateMarker(
      'currentMap',
      'infowindow'
  );

  window.nearbyCallback = window._map_utils.nearbyCallback(
      window.createMarker,
      'previewMarkers'
  );

  window.setPlaceMarkers = window._map_utils.setPlaceMarkers(
      window.nearbyCallback,
      'currentMap',
      'currentCircle',
      window.scale
  );

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

    if ( window.currentCircle ) {
      window.currentCircle.setMap( null );
    }

    window.currentCircle = new google.maps.Circle( meetupLocation )
    window.currentMap.panTo( window.currentCircle.getCenter() )
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

    if ( window.currentCircle === null ) {
      // TODO display error
      return
    }

    var name           = $('[name=name]').val();
    var day            = $('[name=date]').val();
    var time           = $('[name=time]').val();
    var placeType      = $('[name=meetupType]').val();
    var lat            = window.currentCircle.center.lat();
    var lng            = window.currentCircle.center.lng();
    var radius         = window.scale;
    var twitterInvites = Session.get( 'twitterInvites' );

    // TODO validation

    var meetup = {
      name : name,
      dayToMeet : day,
      timeToMeet : time,
      placeTypeSlug : placeType,
      location : {
        latitude : lat,
        longitude : lng,
        radius : radius
      },
      twitterInvites : twitterInvites
    };

    Meteor.call( 'meetupInsert', meetup, function ( error, data ) {
      if ( error ) {
        // TODO show error
      } else {
        Router.go( 'meetupsShow', {
          slug: data 
        } );
      }
    } );

  }
} );