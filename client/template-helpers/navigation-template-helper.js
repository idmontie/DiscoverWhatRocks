Template.navigation.helpers( {
  circles : function () {
    'use strict';

    return Circles.find()
  },
  meteor_loggedin : function () {
    'use strict';
    return !! Meteor.user()
  }
} );

Template.navigation.events( {
  'click ' : function ( e ) {
    // TODO close the navigation
  },
  'click .logout' : function ( e ) {
    'use strict';

    e.preventDefault()

    Meteor.logout()

    Router.go( '/' )
  }
} );