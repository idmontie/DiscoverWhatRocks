// ==========================
// user-router.js
// ==========================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ==========================
// Contains routes for Iron Router configuration.

// ============
// Lint Globals
// ============
/* global Router */

+function () {
  'use strict';

  // ===================
  // Route Configuration
  // ===================

  /*
   * Self Profile
   * '/me' => 'me'
   */
  Router.route( '/me', function () {
    Session.set( 'breadcrumbs', [
      window.defaults.breadcrumbs.home,
      window.defaults.breadcrumbs.profile
    ] )
    this.render( 'profile' );
  }, {
    name : 'profile'
  } )
  window.defaults.breadcrumbs.profile = {
    name : 'User Profile',
    route : Router.path( 'profile' )
  }
}();
