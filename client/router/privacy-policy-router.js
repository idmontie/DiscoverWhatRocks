// ==========================
// privacy-policy-router.js
// ==========================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ==========================
// Contains routes for Iron Router configuration.

// ============
// Lint Globals
// ============
/* global Circles */
/* global Meetups */
/* global Router */

+function () {
  'use strict';

  // ===================
  // Route Configuration
  // ===================

  /*
   * Privacy Policy
   * '/privacy-policy' => 'privacyPolicy'
   */
  Router.route( '/privacy-policy', function () {
    Session.set( 'breadcrumbs', [
      window.defaults.breadcrumbs.home,
      window.defaults.breadcrumbs.privacyPolicy
    ] )
    this.render( 'privacyPolicy' );
  }, {
    name : 'privacyPolicy'
  } )
  window.defaults.breadcrumbs.privacyPolicy = {
    name : 'Privacy Policy',
    route : Router.path( 'privacyPolicy' )
  }
}();
