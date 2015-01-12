// ==============================
// meetup-form-template-helper.js
// ==============================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ==============================
// Contains Template Helper and Events for the Meetup Add Form
//
// TODO clicking in the circle should move the circle
// TODO clicking on a location should move the circle
// TODO get better starting coordinates

// ============
// Lint Globals
// ============
/* global Meetups */
/* global Schema */
/* global PlaceTypes */
/* global google */
/* global check */
/* global throttle */
// The `currentPositionCallback` is defined in the template file
/* global currentPositionCallback */

+function ( _$ ) {
  'use strict';

  // ========
  // Sessions
  // ========
  Session.setDefault( 'meetupsAddFormErrors', {} )

  // ================
  // Template Created
  // ================
  Template.meetupsAddForm.created = function () {
    Session.set( 'meetupsAddFormErrors', {} )
  }

  // =================
  // Template Rendered
  // =================
  Template.meetupsAddForm.rendered = function () {
    // TODO better starting coords
    var Coords = {
      latitude: 33, 
      longitude: -112
    }
    _$.scaleFactor = 1600;
    _$.meetupCircle = false;
    _$.scale = 1 * scaleFactor;
    _$.previewMarkers = [];
    _$.infowindow = new google.maps.InfoWindow();

    $( 'input[name="dateToMeet"]' ).datetimepicker( {
      mask: '____/__/__ __:__ __',
      format: 'Y/m/d h:i a',
      formatTime: 'h:i a'
    } );

    _$.map = new google.maps.Map( document.getElementById( 'map-canvas' ), {
      center: new google.maps.LatLng( Coords.latitude, Coords.longitude ),
      zoom: 13,
      zoomControl: true,
      scaleControl: true,
      scrollwheel: false,
      disableDoubleClickZoom: true
    } );

    // Add click listener
    google.maps.event.addListener( _$.map, 'click', function ( np ) {
      _$.setCenter( np.latLng.lat(), np.latLng.lng() );
    } );

    $( document ).foundation( {
      slider: {
        on_change: throttle( function () {
          _$.setScale( $( 'input[name="meetup_slider_distance"]' ).val() );
        }, 1000 )
      }
    } );

    // Initialize scale
    $( '#meetup_slider_foundation' ).foundation( 'slider', 'set_value', _$.scale / scaleFactor);

    _$.updateMarker = function ( markerReference, placeId ) {
      var service = new google.maps.places.PlacesService( _$.map )

      var request = {
        placeId : placeId
      }

      google.maps.event.addListener( markerReference, 'click', function () {
        var self = this

        // anonymous because we need scoping
        service.getDetails( request, function ( place, status ) {

          if ( status == google.maps.places.PlacesServiceStatus.OK ) {
            _$.infowindow.setContent( place.name )
            _$.infowindow.open( _$.map, self )
          }
        } )
      } )
    }
  }

  // ==============
  // Schema Helpers
  // ==============
  Template.meetupsAddForm.schemaHelpers = {
    name : function () {
      var name = $( 'input[name=name]' ).val()
      try {
        check( name, Schema.meetups._schema.name.type )
      } catch ( e ) {
        return {
          valid : false,
          message : 'Please enter a valid name'
        }
      }

      if ( name.trim() === '' ) {
        return {
          valid : false,
          message : 'Please enter a name'
        }
      }

      return {
        valid : true
      }
    },
    date : function () {
      var dateToMeet = $( 'input[name=dateToMeet]' ).val()

      if ( ( ! dateToMeet ) || dateToMeet.trim() === '' ||
           dateToMeet === '____/__/__ __:__ __') {
        return {
          valid : false,
          message : 'Please enter a date to meet'
        }
      }

      return {
        valid : true
      }
    },
    location : function () {
      var tempLocationParts = $( '#map_center' ).val().split( ',' )

      if ( tempLocationParts.length <= 1 ) {
        return {
          valid : false,
          message : 'Please click on the map to select a location to meet'
        }
      }

      return {
        valid : true
      }
    }
  }

  // =======
  // Helpers
  // =======
  Template.meetupsAddForm.helpers( {
    nameIsNotValid : function () {
      var session = Session.get( 'meetupsAddFormErrors' )
      return ( ! ! session.name ) && ! session.name.valid
    },
    nameErrorMessage : function () {
      var session = Session.get( 'meetupsAddFormErrors' )
      return session.name.message
    },
    dateIsNotValid : function () {
      var session = Session.get( 'meetupsAddFormErrors' )
      return ( ! ! session.date ) && ! session.date.valid
    },
    dateErrorMessage : function () {
      var session = Session.get( 'meetupsAddFormErrors' )
      return session.date.message
    },
    locationIsNotValid : function () {
      var session = Session.get( 'meetupsAddFormErrors' )
      return ( ! ! session.location ) && ! session.location.valid
    },
    locationErrorMessage : function () {
      var session = Session.get( 'meetupsAddFormErrors' )
      return session.location.message
    },
    /**
     * Check for geolocation browser capability
     */
    geolocationEnabled : function () {
      if ( navigator.geolocation ) {
        return ''
      } else {
        return 'disabled="disabled"'
      }
    },
    placeTypes : function () {
      return PlaceTypes.find()
    }
  } )

  // ======
  // Events
  // ======
  Template.meetupsAddForm.events( {
    'keyup input[name=name], change input[name=name]' : function () {
      var session = Session.get( 'meetupsAddFormErrors' )

      session.name = Template.meetupsAddForm.schemaHelpers.name()

      Session.set( 'meetupsAddFormErrors', session )
    },
    'keyup input[name=dateToMeet], blur input[name=dateToMeet]' : function () {
      var session = Session.get( 'meetupsAddFormErrors' )

      session.date = Template.meetupsAddForm.schemaHelpers.date()

      Session.set( 'meetupsAddFormErrors', session )
    },
    'click #use_current_location:not("[disabled]")' : function ( e ) {
      e.preventDefault();

      // TODO precompute this on page load if we already have permission
      // to get it
      navigator.geolocation.getCurrentPosition( currentPositionCallback );
    },
    'submit form' : function ( e ) {
      e.preventDefault();

      // validation
      var forceCheck = {
        name : Template.meetupsAddForm.schemaHelpers.name(),
        date : Template.meetupsAddForm.schemaHelpers.date(),
        location : Template.meetupsAddForm.schemaHelpers.location()
      }

      Session.set( 'meetupsAddFormErrors', forceCheck )

      var dirty = false
      for ( var check in forceCheck ) {
        if ( ! forceCheck[check].valid ) {
          dirty = true
          break;
        }
      }

      if ( dirty ) {
        return;
      }

      var name              = $( 'input[name="name"]' ).val()
      var meetupDate        = $( 'input[name="dateToMeet"]' ).val()
      var meetupType        = $( 'select[name="meetupType"]' ).find( ':selected' ).val()
      var tempLocationParts = $( '#map_center' ).val().split( ',' )
      var meetupLatitude    = tempLocationParts[0].trim()
      var meetupLongitude   = tempLocationParts[1].trim()
      var meetupRadius      = _$.scale

      var meetup = Schema.meetups.clean( {
        circleId: this._id,
        dateToMeet : meetupDate,
        name : name,
        placeTypeSlug :  meetupType,
        mapCenter : {
          latitude : meetupLatitude,
          longitude : meetupLongitude,
          radius : meetupRadius
        },
        votes : []
      } )

      var newId = Meetups.insert( meetup )

      Meteor.call( 'getRealMeetupSlug', newId, function ( err, data ) {
        // redirect to the meetup view
        Router.go ( 'meetup', {
          slug : data
        } )
      } )
    }
  } )

  // ===========
  // Map Helpers
  // ===========
  _$.setScale = function ( scale ) {
    'use strict';

    _$.scale = scale * _$.scaleFactor;

    if ( _$.meetupCircle ) {
      _$.meetupCircle.setRadius( _$.scale );
      // defined in meetup-template-helper.js
      _$.setPlaceMarkers(  $( 'select[name="meetupType"]' ).find( ':selected' ).val() )
    }
  }

  _$.setCenter = function ( lat, lon ) {
    'use strict';

    var location = lat + ', ' + lon
    var center   = new google.maps.LatLng( lat, lon )
    $( '#map_center' ).val( location )

    var meetupLocation = {
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: _$.map,
      center: center,
      radius: _$.scale
    }

    if ( _$.meetupCircle ) {
      _$.meetupCircle.setMap( null )
    }

    _$.meetupCircle = new google.maps.Circle( meetupLocation )
    _$.map.panTo( _$.meetupCircle.getCenter() )
    // TODO rezoom the map according to the radius

    // defined in meetup-template-helper.js
    _$.setPlaceMarkers( $( 'select[name="meetupType"]' ).find( ':selected' ).val() )
  }

  _$.nearbyCallback = function  ( results, status ) {
    'use strict';

    var i = 0

    // Place the markers on the map
    if ( status == google.maps.places.PlacesServiceStatus.OK ) {
      // Destroy old markers
      if ( _$.previewMarkers ) {
        for ( i = 0; i < _$.previewMarkers.length; i++ ) {
          _$.previewMarkers[i].setMap( null )
        }
        _$.previewMarkers = []
      }

      for ( i = 0; i < results.length; i++ ) {
        if ( results[i] !== null &&
            typeof results[i] !== 'undefined' )
          _$.createMarker( results[i] )
      }
    }
  }

  _$.currentPositionCallback = function ( position ) {
    'use strict';

    _$.setCenter( position.coords.latitude,  position.coords.longitude );
  }
}(this);
