Template.showMeetup.onRendered(function () {
  // ===========================
  // Set up the Structured Votes
  // ===========================
  var that = this;
  this.autorun(function () {
    var invitees        = Router.current().data().invitees;
    var structuredVotes = {};
    var locations       = {};

    // TODO for each invitee, if they have a vote,
    // and the vote does not exist in structued votes,
    // add the vote.  If they have a vote, add them
    // to that vote in structured votes.

    _.each(invitees, function (e, i) {
      if ( e.vote ) {
        var hash = e.vote.latitude + '' + e.vote.longitude;
        if (structuredVotes[hash]) {
          // Just add it
          structuredVotes[hash].push(e.email);
        } else {
          structuredVotes[hash] = [e.email];
          locations[hash]       = e.vote;
        }
      }
    });

    // convert from object to array
    var structuredVotes = $.map(structuredVotes, function(e, i) {
      return [{
        votes : e,
        location : locations[i]
      }];
    });

    // TODO sort by most votes to least votes

    Session.set('structuredVotes', structuredVotes);

  });

  // ====================================
  // Set the current email as the session
  // ====================================
  var invitees = this.data.invitees;
  var email = '';
  var shortcode = Router.current().params.userShortcode;

  for (var i = 0; invitees && i < invitees.length; i++) {
    if (invitees[i].shortcode === shortcode) {
      email = invitees[i].email;
    }
  }

  Session.set('currentEmail', email);

  // ========================
  // Set up Map Functionality
  // ========================
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
    var image = Gravatar.imageUrlFromEmail(
      Session.get('currentEmail'),
      {
        secure : true
      }
    );

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
});

Template.showMeetup.helpers( {
  meetup : function () {
    return meetups.findOne();
  },
  placeType : function () {
    var place = PlaceTypes.findOne( {
      slug : this.placeTypeSlug
    } );

    return place.readibleName;
  },
  readibleDate : function () {
    // TODO make a readible date from the meetup
    return new Date(Date.parse(this.datetime)).toDateString();
  },
  readibleTime : function () {
    return new Date(Date.parse(this.datetime)).toLocaleTimeString();
  },
  voteNotCast : function () {
    // TODO
    return false;
  },
  voteAlreadyCast : function () {
    // TODO
    return false;
  },
  hasVotes : function () {
    var votes = Session.get('structuredVotes');

    return votes && votes.length > 0;
  },
  structuredVotes : function () {
    return Session.get('structuredVotes');
  },
  didNotVoteForThisLocation : function () {
    // is this users name in this structured vote?
    if ( this.votes.indexOf( Session.get( 'currentEmail' ) ) !== -1 ) {
      return false;
    } else {
      return true;
    }
  }
} );

Template.showMeetup.events( {
  'click #vote:not(.disabled)' : function ( e ) {
    e.preventDefault();
    e.stopPropagation();

    var shortcode = Router.current().params.shortcode;
    var update = {
      email : Session.get('currentEmail'),
      shortcode : Router.current().params.userShortcode,
      vote : Session.get('vote')
    }

    Meteor.call( 'meetupVote', shortcode, update, function ( error, data ) {
      if ( error ) {
        // TODO show error
        alert( error );
      } else {
        // TODO something should happen
        alert( 'success' );

        // TODO scroll down to their vote
      }
    } );
  }
} );