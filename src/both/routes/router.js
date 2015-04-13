Router.configure( {
  layoutTemplate : 'defaultLayout'
} );

Router.route( '/', {
  name : 'home'
} );

Router.route( '/meetups/new', {
  name : 'newMeetup'
} );

Router.route( '/meetups/:shortcode/:userShortcode', {
  name : 'showMeetup',
  waitOn : function () {
    return Meteor.subscribe( 'meetups', this.params.shortcode )
  }
} );