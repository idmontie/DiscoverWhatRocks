Router.configure( {
  layoutTemplate : 'defaultLayout'
} )

Router.route( '/', {
  name : 'home'
} )

Router.route( '/meetups/new', {
  name : 'meetupsNew'
} )
