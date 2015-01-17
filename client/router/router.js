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
/* global Circles */
/* global Meetups */
/* global Router */

+function () {
  'use strict';

  // ====================
  // Global Configuration
  // ====================
  if ( ! window.defaults ) {
    window.defaults = {}
  }

  window.defaults.router = {
    layoutTemplate : 'applicationLayout',
    exceptionPages : [
      'home',
      'about',
      'privacy'
    ]
  }

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

  // ===================
  // Route Configuration
  // ===================

  /*
   * Home
   * '/' => 'home'
   */
  Router.route( '/', function () {
    this.render( 'home' )
  }, {
    name : 'home'
  } )

  /*
   * About
   * '/about' => 'about'
   */
  Router.route( '/about', function () {
    this.render( 'about' );
  }, {
    name : 'about'
  } )

  /*
   * Meetups Add
   * '/circles/meetups/add/:slug' => 'meetupsAddForm'
   */
  Router.route( '/circles/meetups/add/:slug', function () {
    var circle = Circles.findOne( {
      slug : this.params.slug
    } )

    this.render( 'meetupsAddForm', {
      data : circle
    } )
  }, {
    name : 'meetupsAddForm'
  } )

  /*
   * Meetups Update
   * '/circles/meetups/update/:slug' => 'meetupsUpdateForm'
   */
  Router.route( '/circles/meetups/update/:slug', function () {
    var meetup = Meetups.findOne( {
      slug : this.params.slug
    } )

    this.render( 'meetupsUpdateForm', {
      data : meetup
    } )
  }, {
    name : 'meetupsUpdateForm'
  } )

  /*
   * Meetup View
   * '/circle/meetups/:slug' => 'meetup'
   */
  Router.route( '/circles/meetups/:slug', function () {
    var renderData = {
      data : function () {
        var circle = null
        var meetup = Meetups.findOne( {
          slug : this.params.slug
        } )

        if ( meetup ) {
          circle = Circles.findOne( {
            _id : meetup.circleId
          } )
        }

        return {
          circle : circle,
          meetup : meetup
        }
      }
    }

    this.render( 'meetup', renderData )
  }, {
    name : 'meetup',
    action : function () {
      if ( this.ready() ) {
        this.render()
      }
    }
  } )

  /*
   * Cirles Add
   * '/circles/add' => 'circlesAddForm'
   */
  Router.route( '/circles/add', function () {
    this.render( 'circlesAddForm' )
  }, {
    name : 'circlesAddForm'
  } )

  /*
   * Circles Update
   * '/circles/update/:slug' => 'circlesUpdateForm'
   */
  Router.route( '/circles/update/:slug', function () {
    var circle = Circles.findOne( {
      slug : this.params.slug
    } )

    this.render( 'circlesUpdateForm', {
      data : circle
    } )
  }, {
    name : 'circlesUpdateForm'
  } )

  /*
   * Circles View
   * '/circles/:slug' => 'circle'
   */
  Router.route( 'circles/:slug', function () {
    var renderData = {
      data : function () {
        var meetups = null
        var circle  = Circles.findOne( {
          slug : this.params.slug
        } )

        if ( circle ) {
          meetups = Meetups.find( {
            circleId : circle._id
          } )
        }

        return {
          circle : circle,
          meetups : meetups
        }
      }
    }

    this.render( 'circle', renderData )
  }, {
    name : 'circle'
  } )

  /*
   * Friends Add
   * '/circles/friends/add/:slug' => 'friendsForm'
   */
  Router.route( '/circles/friends/add/:slug', function () {
    var circle = Circles.findOne( {
      slug : this.params.slug
    } )

    this.render( 'friendsForm', {
      data : circle
    } )
  }, {
    name : 'friendsForm'
  } )
}();
