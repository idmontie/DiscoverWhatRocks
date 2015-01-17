// ==========================
// home-router.js
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
   * Home
   * '/' => 'home'
   */
  Router.route( '/', function () {
    Session.set( 'breadcrumbs', [
      window.defaults.breadcrumbs.home
    ] )
    this.render( 'home' )
  }, {
    name : 'home'
  } )
  window.defaults.breadcrumbs.home = {
    name : 'Home',
    route : Router.path( 'home' )
  }
}();
