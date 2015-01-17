// ==========================
// profile-template-helper.js
// ==========================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ==========================
// Contains Template Helper and Events for the Profile Template

// ============
// Lint Globals
// ============
/* global addToAlerts */

+function () {
  'use strict';

  // =======
  // Helpers
  // =======
  Template.profile.helpers( {
    hasNotVerified : function () {
      var user = Meteor.user()

      return ! user.emails[0].verified;
    }
  } )

  // ======
  // Events
  // ======
  Template.profile.events( {
    'click .resend-verification-email' : function ( e ) {
      e.preventDefault()

      Meteor.call( 'resendVerificationEmail', addToAlerts() )
    }
  } )
}();
