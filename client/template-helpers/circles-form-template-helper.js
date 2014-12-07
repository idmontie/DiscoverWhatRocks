
// Session gets reset in the router
Session.setDefault( 'invited-friends', [] );

Template['circles-form'].helpers({
  'invited_friends' : function () {
    'use strict';
    return Session.get( 'invited-friends' );
  },
});

Template['circles-form'].events({
  'click #add_invited_friend' : function ( e ) {
    'use strict';

    var invited_friend = $('#invited_friend').val();

    // TODO check email
    var invited_friends = Session.get( 'invited-friends' );
    invited_friends.push( invited_friend );

    Session.set( 'invited-friends', invited_friends );

    // TODO clear input, close mobile keyboards
  },
  // TODO handle enter
  'click #invited_friends .remove' : function ( e ) {
    // Force 'this' to be a string
    var invited_friend = this.value + '';

    var invited_friends = Session.get( 'invited-friends' );

    for ( var i = invited_friends.length - 1; i >= 0; i-- ) {
      if ( invited_friends[i] === invited_friend ) {
        invited_friends.splice( i, 1 );
      }
    }

    Session.set( 'invited-friends', invited_friends );
  }
});

AutoForm.hooks({
  'circle-form' : {
    before : {
      "insert_circle" : function ( doc ) {
        Schema.circles.clean( doc );
        return doc;
      }
    }
  }
})