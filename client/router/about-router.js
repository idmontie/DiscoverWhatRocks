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
/* global Router */

+function () {
  'use strict';

  // ===================
  // Route Configuration
  // ===================

  /*
   * About
   * '/about' => 'about'
   */
  Router.route( '/about', function () {
    Session.set( 'breadcrumbs', [
      window.defaults.breadcrumbs.home,
      window.defaults.breadcrumbs.about
    ] )
    this.render( 'about' );
  }, {
    name : 'about'
  } )
  window.defaults.breadcrumbs.about = {
    name : 'About',
    route : Router.path( 'about' )
  }
}();
