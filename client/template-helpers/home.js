Template.home.events( {
  'click #facebook-signin' : function ( e ) {
    Meteor.loginWithTwitter();
  }
} )