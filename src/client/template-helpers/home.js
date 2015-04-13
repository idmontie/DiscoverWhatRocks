Template.home.events( {
  'click [data-action="newMeetup"]' : function ( e ) {
    Router.go('newMeetup');
  }
} )