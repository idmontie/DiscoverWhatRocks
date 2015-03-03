Template._addTwitterFriendsModal.created = function () {
  Session.set( 'twitterFriends', null );
  Session.set( 'twitterFriendsSearch', null );

  Template._addTwitterFriendsModal.search = throttle( function ( search ) {
    // Call for search results
    $('#loader').show();
    Meteor.call( 'twitterSearch', search, function ( error, result ) {
      $('#loader').hide();

      if ( error ) {
        // TODO error message
      } else {
        Session.set( 'twitterFriendsSearch', result );
      }
    } );
  }, 1000 ); 
}

Template._addTwitterFriendsModal.rendered = function () {
  $('#loader').show();

  Meteor.call( 'twitterFriends', function ( error, obj ) {
    $('#loader').hide();

    if ( error ) {
      // TODO handle error
    }

    Session.set( 'twitterFriends', obj );
    Session.set( 'twitterFriendsSearch', obj );
  } );
};

Template._addTwitterFriendsModal.helpers( {
  twitterFriends : function () {
    return Session.get( 'twitterFriendsSearch' );
  },
  twitterFriendIsSelected : function () {
    // true if twitterInvites has this friend, then true
    var invites = Session.get( 'twitterInvites' );

    for ( var i = 0; invites != null && i < invites.length; i++ ) {
      if ( this.id === invites[i].id ) {
        return true;
      }
    }

    return false;
  }
} );

Template._addTwitterFriendsModal.events( {
  'keyup .twitter-friends-search, change .twitter-friends-search' : function ( e ) {
    var search = $( e.target ).val();
    
    // Ignore 1 or less characters
    if ( search.length < 2 ) {
      return
    }

    Template._addTwitterFriendsModal.search( search );
  },
  'click .twitter-badges li:not(.selected)' : function ( e ) {
    var friends = Session.get( 'twitterInvites' );

    if ( friends ) {
      friends.push ( this );
    } else {
      friends = [ this ];
    }

    Session.set( 'twitterInvites', friends );
  },
  'click .twitter-badges li.selected' : function ( e ) {
    var invites = Session.get( 'twitterInvites' );

    for ( var i = 0; i < invites.length; i++ ) {
      if ( this.id === invites[i].id ) {
        invites.splice( i, 1 );
      }
    }

    Session.set( 'twitterInvites', invites );
  }
} )