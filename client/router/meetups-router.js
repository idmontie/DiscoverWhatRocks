// ==========================
// meetups-router.js
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
   * Meetups Add
   * '/circles/meetups/add/:slug' => 'meetupsAddForm'
   */
  Router.route( '/circles/meetups/add/:slug', function () {
    var circle = Circles.findOne( {
      slug : this.params.slug
    } )

    if ( this.ready() ) {
      Session.set( 'breadcrumbs', [
        window.defaults.breadcrumbs.home,
        {
          name : circle.name,
          route : Router.path( 'circle', {
            slug : this.params.slug
          } )
        },
        {
          name : 'Add Meetup',
          route : Router.path( 'meetupsAddForm', {
            slug : this.params.slug
          } )
        }
      ] )

      this.render( 'meetupsAddForm', {
        data : circle
      } )
    }
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

    if ( this.ready() ) {
      var circle = Circles.findOne( {
        _id : meetup.circleId
      } )
      Session.set( 'breadcrumbs', [
        window.defaults.breadcrumbs.home,
        {
          name : circle.name,
          route : Router.path( 'circle', {
            slug : circle.slug
          } )
        },
        {
          name : meetup.name,
          route : Router.path( 'meetup', {
            slug : this.params.slug
          } )
        },
        {
          name : 'Update',
          route : Router.path( 'meetupsUpdateForm', {
            slug : this.params.slug
          } )
        }
      ] )

      this.render( 'meetupsUpdateForm', {
        data : meetup
      } )
    }
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

          Session.set( 'breadcrumbs', [
            window.defaults.breadcrumbs.home,
            {
              name : circle.name,
              route : Router.path( 'circle', {
                slug : circle.slug
              } )
            },
            {
              name : meetup.name,
              route : Router.path( 'meetup', {
                slug : this.params.slug
              } )
            }
          ] )
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
}();
