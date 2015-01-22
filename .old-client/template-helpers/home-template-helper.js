// ==========================
// home-template-helper.js
// ==========================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ==========================
// Contains Template Helper and Events for the Home Template

+function () {
  'use strict';

  // ========
  // Sessions
  // ========
  Session.setDefault( 'alerts', [] )

  // ======
  // Events
  // ======
  Template.home.events( {
    'click .resend-verification-email' : function ( e ) {
      e.preventDefault()

      Meteor.call( 'resendVerificationEmail' )

      var alerts = Session.get( 'alerts' )
      var index  = alerts.indexOf( this )
      alerts.splice( index, 1 )

      Session.set( 'alerts', alerts )
    }
  } )
}();

