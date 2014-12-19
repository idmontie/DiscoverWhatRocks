/**
 * Navigation Template Helpers
 *
 * Template helpers for navigation
 */

/* global Circles */

Template.navigation.helpers( {
  circles : function () {
    'use strict';

    return Circles.find()
  },
  meteorLoggedIn : function () {
    'use strict';
    return ! ! Meteor.user()
  }
} );

Template.navigation.events( {
  /**
   * Close the navigation
   */
  'click .left-off-canvas-menu li a' : function () {
    'use strict';

    $('.off-canvas-wrap').removeClass('move-right')
  },
  'click .logout' : function ( e ) {
    'use strict';

    e.preventDefault()

    Meteor.logout()

    Router.go( '/' )
  }
} );
