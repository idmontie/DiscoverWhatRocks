// ==========================
// friend-router.js
// ==========================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ==========================
// Contains routes for Iron Router configuration.

// ============
// Lint Globals
// ============
/* global Circles */
/* global Router */

+function () {
  'use strict';

  // ===================
  // Route Configuration
  // ===================

  /*
   * Friends Add
   * '/circles/friends/add/:slug' => 'friendsForm'
   */
  Router.route( '/circles/friends/add/:slug', function () {
    var circle = Circles.findOne( {
      slug : this.params.slug
    } )

    Session.set( 'breadcrumbs', [
      window.defaults.breadcrumbs.home,
      {
        name : circle.name,
        route : Router.path( 'circle', {
          slug : this.params.slug
        } )
      },
      {
        name : 'Add Friends',
        route : Router.path( 'friendsForm', {
          slug : this.params.slug
        } )
      }
    ] )

    this.render( 'friendsForm', {
      data : circle
    } )
  }, {
    name : 'friendsForm'
  } )
}();
