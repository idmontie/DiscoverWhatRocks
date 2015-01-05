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
  'click #logout, click .logout' : function ( e ) {
    'use strict';

    e.preventDefault()

    Meteor.logout()

    Router.go( '/' )
  },
  'click .session-alert-box-close' : function ( e ) {
    'use strict';

    e.preventDefault()

    var alerts = Session.get( 'alerts' )
    var index  = alerts.indexOf( this )
    alerts.splice( index, 1 )

    Session.set( 'alerts', alerts )
  }
} );
