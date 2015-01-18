// ==========================
// meetup-template-helper.js
// ==========================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ==========================
// Contains Template Helper and Events for the Meetups View

// ============
// Lint Globals
// ============
/* global google */
/* global RichMarker */
/* global Meetups */
/* global PlaceTypes */
/* global Schema */
/* global ReactivityHelper */
/* global Gravatar */
/* global addToAlerts */

// ================
// Session Defaults
// ================
Session.setDefault( 'voteLat', null );
Session.setDefault( 'voteLong', null );
Session.setDefault( 'voteData', null );

var _$ = this;

+function () {
  'use strict';

  // =================
  // Template Rendered
  // =================
  Template.meetup.rendered = function () {
    $(document).foundation('dropdown', 'reflow');
    
    $('.delete-meetup').holdToDelete( {
      cleanup : function () {
        if ( $( this ).data( 'original-background-color' ) &&
             ! ( this ).data( 'to-be-deleted' ) ) {
          var originalColor = $( this ).data( 'original-background-color' )
          $( this ).css( 'background', originalColor )
        }
      },
      increment : function ( count ) {
        var originalColor;


        if ( $( this ).data( 'original-background-color' ) ) {
          originalColor = $( this ).data( 'original-background-color' )
        } else {
          originalColor = $( this ).css( 'background-color' )
          $( this ).data( 'original-background-color', originalColor )
        }

        $( this ).css(
          'background',
          'linear-gradient(to right, ' +
          '#f00 0%, ' +
          '#f00 ' + count + '%, ' +
          originalColor + ' ' + count + '%, ' +
          originalColor + ' 100%)')
      },
      success : function () {
        $( this ).data( 'to-be-deleted', true )
        $( this ).css( 'background', '#f00' )

        /*
         * Hack to force Meteor to react to our
         * custom event.  Normally you would use:
         *
         * ```js
         * $(elem).on('htdsuccess')
         * ```
         */
        // var event = document.createEvent('Event');
        // event.initEvent('htdsuccess', true, true)

        // $( this )[0].dispatchEvent( event )
      },
      speed : 15
    } )

    _$.data = window.Template.currentData($('#map-canvas')[0]);
    _$.voteMarker = false;
    _$.meetupCircle = null;
    _$.previewMarkers = [];
    _$.infowindow = new google.maps.InfoWindow();
    // Hack to make sure no infinite map refreshes happen
    _$.selfInterval = _$.selfInterval || -1;
    clearInterval( _$.selfInterval );

    /**
     * Wait for circle and meetup context to be ready
     */
    _$.selfInterval = setInterval( function () {
      if ( _$.data !== null &&
           _$.data.circle !== null &&
           _$.data.meetup !== null) {
        clearInterval( _$.selfInterval );

        _$.run();
      } else {
        // Try again
        _$.data = window.Template.currentData( $('#map-canvas')[0] );
      }
    }, 100 );

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

            // this marks the marker
            _$.setVoteMarker(
                markerReference.getPosition().lat(),
                markerReference.getPosition().lng(),
                place
            )
          }
        } )
      } )
    }
  }

  // =======
  // Helpers
  // =======

  Template.meetup.helpers( {
    isOwner : function () {
      var isSet = ReactivityHelper.reliesOn( this.meetup )

      if ( isSet ) {
        if ( this.meetup.ownerId === Meteor.userId() ) {
          return true
        }
      }

      return false
    },
    hasNotPinged : function () {
      return ! this.meetup.pinged
    },
    placeType : function () {
      if ( this.meetup !== null &&
           typeof this.meetup !== 'undefined' ) {
        return PlaceTypes.findOne( {
          slug : this.meetup.placeTypeSlug
        } )
      } else {
        return ''
      }
    },
    voteNotCast : function () {
      return Session.get( 'voteLat' ) === null &&
        Session.get( 'voteLong' ) === null
    },
    voteAlreadyCast : function () {
      var isSet = ReactivityHelper.reliesOn( this.meetup )

      if ( isSet ) {
        var index = window.getPreviouslyCastVote( this.meetup, Meteor.userId() )
        return index !== -1
      } else {
        return false
      }
    },
    notOwnVote : function () {
      var votedForThis = false

      for ( var i = 0; i < this.voters.length; i++ ) {
        if ( this.voters[i].email === Meteor.user().emails[0].address.toLowerCase() )
          votedForThis = true
      }

      return ! votedForThis
    },
    hasVotes : function () {
      if ( this.meetup !== null &&
           typeof this.meetup !== 'undefined' &&
           this.meetup.votes !== null &&
           this.meetup.votes.length > 0 ) {
        return true
      } else {
        return false
      }
    },
    structuredVotes : function () {
      var self = this

      ReactivityHelper.reliesOn( Meetups.findOne( {
        _id : self.meetup._id
      } ) )

      Meteor.call(
        'meetupStructuredVotes',
        self.meetup._id,
        function ( error, result ) {
          Session.set( 'structuredVotes', result )
          _$.markersDirty = true
          window.updateMarkers( result )
        }
      )

      return Session.get( 'structuredVotes' )
    },
    invitees : function () {
      var self = this
      var isSet = ReactivityHelper.reliesOn( this.meetup )

      if ( isSet ) {
        Meteor.autorun( function () {

          Meteor.call(
            'meetupInvitees',
            self.meetup._id,
            function ( error, result ) {
              Session.set( 'meetupInvitees', result )
            }
          )
        } )
      }

      return Session.get( 'meetupInvitees' )
    }
  } )

  // ======
  // Events
  // ======

  Template.meetup.events( {
    'click .search' : function ( e ) {
      e.preventDefault()

      $( e.currentTarget )
        .addClass('open-dwr')
        .find( 'input.closed' )
          .removeClass( 'closed' )
          .focus()
    },
    'click .search.open-dwr i' : function ( e ) {
      e.preventDefault()

      var searchTerm = $( e.currentTarget ).parent().find( 'input' ).val()

      // TODO decide whether to provide a placeTypeSlug
      _$.setPlaceMarkers( _$.data.meetup.placeTypeSlug, searchTerm )
    },
    'keypress .search.open-dwr input' : function ( e ) {
      if ( e.which == 13 ) {
        e.preventDefault()

        // TODO refactor with above event
        var searchTerm = $( e.currentTarget ).parent().find( 'input' ).val()

        // TODO decide whether to provide a placeTypeSlug
        _$.setPlaceMarkers( _$.data.meetup.placeTypeSlug, searchTerm )
      }
    },
    'click #email-friends-about-meetup' : function ( e ) {
      $( e.target ).hide()
      var meetup = this.meetup;

      // email, callback show alert
      Meteor.call( 'inviteToMeetup', meetup._id, function ( error ) {
        // Tell the user whether they were successful or not

        // TODO refactor, this alerts code is very similar and used all
        // over the place (see friends-form-template-helper.js)
        var html = '';
        var alerts = Session.get( 'alerts' )

        if ( error ) {
          html = 'We could not send out the emails to your Circle. ' +
            '<a href="#" onclick="location.reload(true); retun false;">Refresh the page to try again</a>.'
        } else {
          html = 'Emails successfully sent to this Circle.'
        }

        alerts.push( html )

        Session.set( 'alerts', alerts )
      } )
    },
    'click .vote-premade' : function ( e ) {
      e.preventDefault()
      e.stopPropagation()

      var parent =  Template.parentData()

      var newMeetup = $.extend( {}, parent.meetup )

      /*jshint camelcase: false */
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      var vote = {
        latitude : this.latitude,
        longitude : this.longitude,
        userId : Meteor.userId(),
        placeDetails : {
          name : this.placeDetails.name,
          place_id : this.placeDetails.place_id,
          vicinity : this.placeDetails.vicinity
        }
      }
      /*jshint camelcase: true */
      // jscs:enable requireCamelCaseOrUpperCaseIdentifiers

      // update vote
      // Check array for pre-existing vote
      var index = _$.getPreviouslyCastVote( newMeetup, Meteor.userId() )

      // Pre-existing votes should be updated, not deleted
      if ( index !== -1 ) {
        newMeetup.votes[index] = vote
      } else {
        newMeetup.votes.push( vote )
      }

      // Update meetup
      // TODO  use add to set!
      // TODO use a meteor call
      newMeetup = Schema.meetups.clean( newMeetup )
      Meetups.update( parent.meetup._id, {
        $set : {
          votes : newMeetup.votes
        }
      } )

      _$.markersDirty = true
    },
    'click #vote:not(.disabled)' : function ( e ) {
      e.preventDefault()
      e.stopPropagation()

      // Add or Update vote in the meetup
      var newMeetup = $.extend( {}, this.meetup )
      var userId    = Meteor.userId()
      var vote      = _$.createVote( userId )

      // First vote needs to create votes array
      if ( newMeetup.votes == null ) {
        newMeetup.votes = []
      }

      // Check array for pre-existing vote
      var index = _$.getPreviouslyCastVote( newMeetup, userId )

      // Pre-existing votes should be updated, not deleted
      if ( index !== -1 ) {
        newMeetup.votes[index] = vote
      } else {
        newMeetup.votes.push( vote )
      }

      // Update meetup
      // TODO use add to set
      // TODO use a meteor call
      newMeetup = Schema.meetups.clean( newMeetup )
      Meetups.update( this.meetup._id, {
        $set : {
          votes : newMeetup.votes
        }
      } )

      _$.markersDirty = true
    },
    'htdsuccess .delete-meetup' : function ( e ) {
      e.preventDefault()
      e.stopPropagation()

      $( e.target ).hide()

      Meteor.call( 'meetupDelete', this.meetup._id, addToAlerts( function () {
        $( e.target ).show()
      }, function () {
        // TODO redirect to circle
        Router.go( '/' )
      } ) )
    }
  } )

  // ============
  // Vote Helpers
  // ============

  _$.getPreviouslyCastVote = function ( meetup, userId ) {
    var index = -1

    for ( var i = 0; i < meetup.votes.length; i++ ) {
      if ( meetup.votes[i].userId == userId ) {
        index = i
        break
      }
    }

    return index
  }

  _$.createVote = function ( userId ) {
    var lat          = Session.get( 'voteLat' )
    var lng          = Session.get( 'voteLong' )
    var placeDetails = Session.get( 'voteData' )

    // Make sure placeDetails is an object
    if ( placeDetails == null ) {
      // TODO ask to name location
      /*jshint camelcase: false */
      // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
      placeDetails = {
        name : '(' + lat + ', ' + lng + ')',
        place_id : 'NA',
        vicinity : 'NA'
      }
      /*jshint camelcase: true */
      // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
    }

    return {
      latitude : lat,
      longitude : lng,
      userId : userId,
      placeDetails : placeDetails
    }
  }

  // ===========
  // Map Helpers
  // ===========

  /**
   * Run after data is set
   */
  _$.run = function () {
    var Coords = {
      latitude: _$.data.meetup.mapCenter.latitude,
      longitude: _$.data.meetup.mapCenter.longitude
    }

    _$.map = new google.maps.Map( document.getElementById( 'map-canvas' ), {
      center: new google.maps.LatLng( Coords.latitude, Coords.longitude ),
      zoom: 13,
      zoomControl: true,
      scaleControl: true,
      scrollwheel: false,
      disableDoubleClickZoom: true
    } )
    _$.scale = parseFloat( _$.data.meetup.mapCenter.radius )
    _$.oldMarkers = []

    var meetupLocation = {
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: _$.map,
      center: new google.maps.LatLng( Coords.latitude, Coords.longitude ),
      radius: _$.scale
    };

    _$.meetupCircle = new google.maps.Circle( meetupLocation );

    _$.setPlaceMarkers( _$.data.meetup.placeTypeSlug )

    // Add click listener
    google.maps.event.addListener( _$.map, 'click', function ( np ) {
      _$.setVoteMarker( np.latLng.lat(), np.latLng.lng() );
    } )

    google.maps.event.addListener( _$.meetupCircle, 'click', function ( np ) {
      _$.setVoteMarker( np.latLng.lat(), np.latLng.lng() );
    } )

    _$.listenForMarkers()
  }

  _$.setVoteMarker = function ( lat, lon, placeData ) {
    var location = lat + ', ' + lon
    var latLng = new google.maps.LatLng( lat, lon )

    $( '#vote_location' ).val( location )

    var content = '<div class="pin"><img src="' + Gravatar.imageUrlFromEmail( Meteor.user().emails[0].address, {
      size : 32,
      secure : true
    } ) + '" /></div>';

    var voteLocation = {
      position: latLng,
      map: _$.map,
      flat: true,
      title: 'Vote',
      content: content
    }

    if ( _$.voteMarker ) {
      _$.voteMarker.setMap( null )
    }

    _$.voteMarker = new RichMarker( voteLocation )

    Session.set( 'voteLat', lat )
    Session.set( 'voteLong', lon )
    Session.set( 'voteData', placeData )
  }

  _$.setPlaceMarkers = function ( placeType, keywords ) {
    // set markers
    var service   = new google.maps.places.PlacesService( _$.map )
    var placeRequest = {
      location : _$.meetupCircle.getCenter(),
      radius : _$.scale,
      types  : [placeType]
    }

    if ( keywords ) {
      placeRequest.keyword = keywords
    }

    service.radarSearch( placeRequest, _$.nearbyCallback )
  }

  _$.currentPositionCallback = function ( position ) {
    _$.setCenter( position.coords.latitude,  position.coords.longitude );
  }

  _$.createMarker = function ( place ) {
    var marker = new google.maps.Marker( {
      map: _$.map,
      position: place.geometry.location
    } )

    _$.previewMarkers.push( marker )

    /*jshint camelcase: false */
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    _$.updateMarker( marker, place.place_id )
    /*jshint camelcase: true */
    // jscs:enable requireCamelCaseOrUpperCaseIdentifiers
  }

  _$.updateMarkers = function ( votes ) {
    if ( ! _.isEqual( votes, _$.votes ) ) {
      _$.markersDirty = true
      _$.votes = votes
    }
  }

  _$.listenForMarkers = function () {
    setInterval( function () {
      if ( _$.markersDirty && _$.map ) {
        _$.markersDirty = false

        var votes = _$.votes
        var i     = 0
        // TODO theres not need to redo ALL of the votes
        // remove old votes
        for ( i = 0; i < _$.oldMarkers.length; i++ ) {
          _$.oldMarkers[i].setMap( null )
        }
        _$.oldMarkers = []

        // mark votes
        for ( i = 0; i < votes.length; i++ ) {
          var vote = votes[i]
          var latLng = new google.maps.LatLng( vote.latitude, vote.longitude )

          for ( var j = 0; j < vote.voters.length; j++ ) {
            var voter = vote.voters[j]

            var content = '<div class="pin"><img src="' + Gravatar.imageUrlFromEmail(
                voter.email,
                {
                  size : 32,
                  secure : true
                }
              ) + '" /></div>';

            var voteLocation = {
              position: latLng,
              map: _$.map,
              flat: true,
              title: 'Vote',
              content: content
            }

            if ( voter.email === Meteor.user().emails[0].address ) {
              // TODO Bug: if a user clicks on the map BEFORE this gets run, their
              // vote will get overwriten.
              // To cause this bug, refresh the page and click on a marker before the
              // gravitar circles show up.

              // Delete the old marker
              if ( _$.voteMarker == null ) {
                continue;
              }

              if ( _$.voteMarker ) {
                _$.voteMarker.setMap( null )
              }

              _$.voteMarker = new RichMarker( voteLocation )

              Session.set( 'voteLat', vote.latitude )
              Session.set( 'voteLong', vote.longitude )
              Session.set( 'voteData', vote.placeDetails )
            } else {
              _$.oldMarkers.push( new RichMarker( voteLocation ) )
            }
          }
        }

      }
    }, 2000 )
  }
}();
