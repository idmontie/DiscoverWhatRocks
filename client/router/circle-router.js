// ==========================
// circle-router.js
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
   * Cirles Add
   * '/circles/add' => 'circlesAddForm'
   */
  Router.route( '/circles/add', function () {
    Session.set( 'breadcrumbs', [
      window.defaults.breadcrumbs.home,
      {
        name : 'Create A Circle',
        route : Router.path( 'circlesAddForm' )
      }
    ] )

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

    Session.set( 'breadcrumbs', [
      window.defaults.breadcrumbs.home,
      {
        name : circle.name,
        route : Router.path( 'circle', {
          slug : this.params.slug
        } )
      },
      {
        name : 'Update',
        route : Router.path( 'circlesUpdateForm', {
          slug : this.params.slug
        } )
      }
    ] )

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

        Session.set( 'breadcrumbs', [
          window.defaults.breadcrumbs.home,
          {
            name : circle.name,
            route : Router.path( 'circle', {
              slug : circle.slug
            } )
          }
        ] )

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
}();
