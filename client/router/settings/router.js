// ==========================
// router.js
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

  // ====================
  // Global Configuration
  // ====================
  if ( ! window.defaults ) {
    window.defaults = {}
  }

  window.defaults.breadcrumbs = []

  window.defaults.router = {
    layoutTemplate : 'applicationLayout',
    exceptionPages : [
      'home',
      'about',
      'privacyPolicy'
    ]
  }

  Router.hierarchy = []

  /**
   * Set a base layout template.
   */
  Router.configure( {
    layoutTemplate: window.defaults.router.layoutTemplate
  } );

  /**
   * Redirect to log in pages
   */
  Router.onBeforeAction( function () {
    if ( ! Meteor.userId() ) {
      this.render( 'home' )
    } else {
      this.next();
    }
  }, {
    except: window.defaults.router.exceptionPages
  } )
}();
