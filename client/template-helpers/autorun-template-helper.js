

Meteor.autorun( function () {
  Session.set( 'meteor_loggedin', ! ! Meteor.user() );
} );