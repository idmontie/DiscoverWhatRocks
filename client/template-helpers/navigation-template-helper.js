// =============================
// navigation-template-helper.js
// =============================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// =============================

// ============
// Lint Globals
// ============
/* global Circles */

+function () {
  'use strict';

  // =======
  // Helpers
  // =======
  Template.navigation.helpers( {
    circles : function () {
      return Circles.find()
    },
    meteorLoggedIn : function () {
      return ! ! Meteor.user()
    }
  } )

  // ======
  // Events
  // ======
  Template.navigation.events( {
    /**
     * Close the navigation
     */
    'click .left-off-canvas-menu li a' : function () {
      $( '.off-canvas-wrap' ).removeClass( 'move-right' )
    },
    'click #logout, click .logout' : function ( e ) {
      e.preventDefault()

      Meteor.logout()

      Router.go( '/' )
    },
    'click .session-alert-box-close' : function ( e ) {
      e.preventDefault()

      var alerts = Session.get( 'alerts' )
      var index  = alerts.indexOf( this )
      alerts.splice( index, 1 )

      Session.set( 'alerts', alerts )
    }
  } )
}();

