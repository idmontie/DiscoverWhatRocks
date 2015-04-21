Template.newMeetup.onCreated(function () {
  Session.set('emails', [ {
    email : '',
    index : 0
  } ])
});

Template.newMeetup.onRendered(function () {
  // Default Date is now
  var now = new Date();
  var month = now.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }

  var day = now.getDate();
  if (day < 10) {
    day = '0' + day;
  }

  $('input[name="date"]').val(
    (now.getYear() + 1900) + '-' +
    month + '-' +
    day
  );

  // Default Time is 12:00 pm
  $('input[name="time"]').val('12:00');

  // Set up calendar
  $('#datetimepicker').datetimepicker({
      inline: true,
      sideBySide: true,
      showTodayButton: true
  });

  // ==========
  // Maps Setup
  // ==========
  var labelsOff   = window._map_utils.labelsOff;
  var labelsOn    = window._map_utils.labelsOn;
  var geolocation = Geolocation.currentLocation();
  var coords      = null;
  window._map_utils.reset();

  // ==========
  // Set up Map
  // ==========
  if ( geolocation === null ) {
    // TODO better starting coordinates
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
      'scale'
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

    if ( window.currentCircle ) {
      window.currentMap.panTo( window.currentCircle.getCenter() )
    }
    // TODO rezoom the map according to the radius

    var placeType = $( '[name=meetupType]' ).val();
    window.setPlaceMarkers( placeType );
  }
} );

Template.newMeetup.helpers( {
  placeTypes : function () {
    return PlaceTypes.find()
  },
  emails : function () {
    return Session.get('emails');
  }
} )

Template.newMeetup.events( {
  'click .map-action-button' : function ( e ) {
    e.preventDefault();

    var geolocation = Geolocation.currentLocation();

    window.setCenter(
      geolocation.coords.latitude,
      geolocation.coords.longitude
    );
  },
  'keyup [name="email[]"]' : function ( e ) {
    var emails = Session.get('emails');
    for (var i = 0; i < emails.length; i++) {
      if ( emails[i].index == this.index ) {
        emails[i].email = $(e.currentTarget).val();
      }  
    }
    
    Session.set('emails', emails);
  },
  'click [data-action="add-email"]' : function ( e ) {
    var emails = Session.get('emails');
    var index = 0;

    if (emails.length > 0) {
      index = emails[emails.length - 1].index + 1;
    }

    emails.push({
      email : '',
      index : index
    });

    Session.set('emails', emails);
  },
  'click [data-action="remove-email"]' : function ( e ) {
    var emails = Session.get('emails');
    for (var i = 0; i < emails.length; i++) {
      if ( emails[i].index == this.index ) {
        emails.splice(i, 1);
      }  
    }
    
    Session.set('emails', emails);
  },
  'click #submit' : function ( e ) {
    e.preventDefault();

    // TODO

    if ( window.currentCircle === null ) {
      // TODO display error
      return
    }

    var ownerEmail     = $('[name=email]').val();
    var day            = $('[name=date]').val();
    var time           = $('[name=time]').val();
    var placeType      = $('[name=meetupType]').val();
    var lat            = window.currentCircle.center.lat();
    var lng            = window.currentCircle.center.lng();
    var radius         = window.scale;
    var emails         = Session.get( 'emails' );

    // TODO validation

    // TODO strip out extra blank emails
    emails = emails.filter(function (e) {
      return e.email.trim() != '';
    })

    // strip extra data from emails
    emails = _.map(emails, function (e) {
      return {
        email : e.email
      }
    });

    // add the current user email as the owner
    emails.push({
      email : ownerEmail,
      owner : true
    })

    var meetup = {
      name : name,
      dateToMeet : day,
      timeToMeet : time,
      placeTypeSlug : placeType,
      location : {
        latitude : lat,
        longitude : lng,
        radius : radius
      },
      invitees : emails
    };

    Meteor.call( 'meetupInsert', meetup, function ( error, data ) {
      if ( error ) {
        // TODO show error
      } else {
        Router.go( 'showMeetup', data );
      }
    } );

  }
} );