Router.configure( {
  layoutTemplate : 'defaultLayout'
} );

Router.route( '/', {
  name : 'home',
  waitOn : function () {
    return Meteor.subscribe( 'meetups' )
  }
} );

Router.route( '/meetups/new', {
  name : 'meetupsNew'
} );

Router.route( '/meetups/:slug', {
  loadingTemplate : 'loading',
  name : 'meetupsShow',
  waitOn : function () {
    return Meteor.subscribe( 'meetups', this.params.slug )
  }
} );