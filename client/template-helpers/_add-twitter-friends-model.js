Template._addTwitterFriendsModal.created = function () {
  Session.set( 'twitterFriends', null );
  Session.set( 'twitterFriendsSearch', null );
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
    // TODO throttle

    var search = $( e.target ).val();
    var friends = Session.get( 'twitterFriends' );

    filtered = _.filter( friends, function ( item ) {
      var con = item.description + item.name + item.screen_name;
      con = con.toLowerCase();
      if ( con.indexOf( search ) != -1 ) {
        return item;
      }

      return null;
    } );

    Session.set( 'twitterFriendsSearch', filtered );
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