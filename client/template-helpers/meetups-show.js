Template.meetupsShow.created = function () {
  Session.set( 'twitterInvites', null );
};

Template.meetupsShow.rendered = function () {
  var labelsOff   = window._map_utils.labelsOff;
  var labelsOn    = window._map_utils.labelsOn;
  var geolocation = Geolocation.currentLocation();
  window._map_utils.reset();

  /**
   * Wait for the meetup context to be ready
   */
  window.waitInterval = setInterval( function () {
    if ( window.meetup ) {
      clearInterval( window.waitInterval );
      window.run();
    } else {
      // Try again
      window.meetup = window.Template.currentData( document.getElementById( 'map-canvas' ) );
    }
  }, 10 );

  /** 
   * Called when waitInverval is ready
   */
  window.run = function () {
    // ==========
    // Set up Map
    // ==========
    var coords = {
      latitude : window.meetup.location.latitude,
      longitude : window.meetup.location.longitude 
    };
    var center = new google.maps.LatLng( coords.latitude, coords.longitude );

    window.currentMap = window._map_utils.setup(
      document.getElementById( 'map-canvas' ),
      center
    );

    // =============
    // Set up Circle
    // =============
    window.scale = parseFloat( window.meetup.location.radius );

    var circleSettings = {
      center : center,
      strokeColor: '#60C3AB',
      strokeOpacity : 0.8,
      strokeWeight: 2,
      fillColor: '#60C3AB',
      fillOpacity: 0.20,
      map : window.currentMap,
      radius: window.scale
    };

    window.currentCircle = new google.maps.Circle( circleSettings );

    // ====================
    // Set up Place Markers
    // ====================
    window.setPlaceMarkers( window.meetup.placeTypeSlug );

    // ======
    // Events
    // ======
    /**
     * Listen for Map Zoom Change
     */
    window._map_utils.listenForZoom(
        window.currentMap,
        labelsOn,
        labelsOff
    );

    /**
     * Listen for Map Clicks
     */
    google.maps.event.addListener( window.currentMap, 'click', function ( np ) { 
      window.setVoteMarker(
          np.latLng.lat(),
          np.latLng.lng()
      );
    } );

    /**
     * Listen for Circle Clicks
     */
    google.maps.event.addListener( window.currentCircle, 'click', function ( np ) {
      window.setVoteMarker(
          np.latLng.lat(),
          np.latLng.lng()
      );
    } );

    /**
     * Listen for New Markers
     */
    window.listenForMarkersChange();
  };

  // ============
  // Page Helpers
  // ============
  /**
   * Set a vote marker for the current user
   *
   * @param placeData optional
   */
  window.setVoteMarker = function ( lat, lng, placeData ) {
    var latLng = new google.maps.LatLng( lat, lng );

    // include the user's twitter icon
    var image = Meteor.user().services.twitter.profile_image_url_https;

    var content = '<div class="pin"><img src="' + image + '"/></div>';

    var voteLocation = {
      position : latLng,
      map : window.currentMap,
      flat : true,
      title : 'Vote',
      content : content
    };

    // If the user has previously cast a vote, remove it
    if ( window.voteMarker ) {
      window.voteMarker.setMap( null );
    }

    window.voteMarker = new RichMarker( voteLocation );

    Session.set( 'vote', {
      latitude : lat,
      longitude : lng,
      placeData : placeData
    } );
  };

  /**
   * Listen for changes to the markers
   */
  window.listenForMarkersChange = function () {
    setInterval( function () {
      if ( window.markersDirty && window.currentMap ) {
        window.markersDirty = false;

        var votes = window.votes;
        var i     = 0;

        // TODO no need to reset all of the votes
        // Reset old votes
        for ( i = 0; i < window.oldMarkers.length; i++ ) {
          window.oldMarkers[i].setMap( null )
        }

        window.oldMarkers = []

        // Mark votes
        // TODO
      }
    } )
  };

  window.createMarker = window._map_utils.createMarker(
      'currentMap',
      'previewMarkers',
      'updateMarker'
  );

  window.updateMarker = window._map_utils.updateMarker(
      'currentMap',
      'infowindow',
      window.setVoteMarker
  );

  window.nearbyCallback = window._map_utils.nearbyCallback(
      window.createMarker,
      'previewMarkers'
  );

  window.setPlaceMarkers = window._map_utils.setPlaceMarkers(
      window.nearbyCallback,
      'currentMap',
      'currentCircle',
      'scale'
  );
}

Template.meetupsShow.helpers( {
  meetup : function () {
    return Meetups.findOne();
  },
  placeType : function () {
    var place = PlaceTypes.findOne( {
      slug : this.placeTypeSlug
    } );

    return place.readibleName;
  }
} );