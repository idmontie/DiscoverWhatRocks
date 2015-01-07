/**
 * Meetup Template Helper
 */

/* global _$ */
/* global google */
/* global RichMarker */
/* global Meetups */
/* global PlaceTypes */
/* global Schema */
/* global ReactivityHelper */
/* global Gravatar */


// ================
// Session Defaults
// ================
Session.setDefault( 'voteLat', null );
Session.setDefault( 'voteLong', null );
Session.setDefault( 'voteData', null );


Template.meetup.helpers( {
  isOwner : function () {
    'use strict';
    var isSet = ReactivityHelper.reliesOn( this.meetup )

    if ( isSet ) {
      if ( this.meetup.ownerId === Meteor.userId() ) {
        return true
      }
    }

    return false
  },
  hasNotPinged : function () {
    'use strict';

    return ! this.meetup.pinged
  },
  placeType : function () {
    'use strict';

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
    'use strict';

    return Session.get( 'voteLat' ) === null &&
      Session.get( 'voteLong' ) === null
  },
  voteAlreadyCast : function () {
    'use strict';
    var isSet = ReactivityHelper.reliesOn( this.meetup )

    if ( isSet ) {
      var index = window.getPreviouslyCastVote( this.meetup, Meteor.userId() )
      return index !== -1
    } else {
      return false
    }
  },
  hasVotes : function () {
    'use strict';

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
    'use strict';
    var self = this

    Meteor.autorun( function () {
      Meteor.call(
        'meetupStructuredVotes',
        self.meetup._id,
        function ( error, result ) {
          Session.set( 'structuredVotes', result )

          window.updateMarkers( result )
        }
      )
    } )

    return Session.get( 'structuredVotes' )
  },
  invitees : function () {
    'use strict';

    var self = this
    var isSet = ReactivityHelper.reliesOn( this.meetup )

    if ( isSet ) {
      Meteor.autorun( function () {

        Meteor.call(
          'meetupInvitees',
          self.meetup._id,
          function ( error, result ) {
            console.log( error, result )
            Session.set( 'meetupInvitees', result )
          }
        )
      } )
    }

    return Session.get( 'meetupInvitees' )
  }
} )

Template.meetup.events( {
  'click #email-friends-about-meetup' : function ( e ) {
    'use strict';

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
    'use strict';

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
    newMeetup = Schema.meetups.clean( newMeetup )
    Meetups.update( parent.meetup._id, {
      $set : {
        votes : newMeetup.votes
      }
    } )

    _$.markersDirty = true
  },
  'click #vote:not(.disabled)' : function ( e ) {
    'use strict';

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
    newMeetup = Schema.meetups.clean( newMeetup )
    Meetups.update( this.meetup._id, {
      $set : {
        votes : newMeetup.votes
      }
    } )

    _$.markersDirty = true
  }
} )

// ============
// Vote Helpers
// ============

this.getPreviouslyCastVote = function ( meetup, userId ) {
  'use strict';
  var index = -1

  for ( var i = 0; i < meetup.votes.length; i++ ) {
    if ( meetup.votes[i].userId == userId ) {
      index = i
      break
    }
  }

  return index
}

this.createVote = function ( userId ) {
  'use strict';

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
this.run = function () {
  'use strict';

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

this.setVoteMarker = function ( lat, lon, placeData ) {
  'use strict';
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

this.setPlaceMarkers = function ( placeType ) {
  'use strict';

  // set markers
  var service   = new google.maps.places.PlacesService( _$.map )
  var placeRequest = {
    location : _$.meetupCircle.getCenter(),
    radius : _$.scale,
    types  : [placeType]
  }
  service.radarSearch( placeRequest, _$.nearbyCallback )
}

this.currentPositionCallback = function ( position ) {
  'use strict';

  _$.setCenter( position.coords.latitude,  position.coords.longitude );
}

this.createMarker = function ( place ) {
  'use strict';

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

this.updateMarker = function ( markerReference, placeId ) {
  'use strict';

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

this.updateMarkers = function ( votes ) {
  'use strict';

  if ( ! _.isEqual( votes, _$.votes ) ) {
    _$.markersDirty = true
    _$.votes = votes
  }
}

this.listenForMarkers = function () {
  'use strict';

  setInterval( function () {
    if ( _$.markersDirty && _$.map ) {
      _$.markersDirty = false

      var votes = _$.votes
      var i     = 0
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
