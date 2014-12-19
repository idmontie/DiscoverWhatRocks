/**
 * Home Logged In Template Helper
 *
 * Template helper for the home logged in template
 */

/* global Circles */

Template.home_logged_in.helpers({
  'circles' : function () {
    'use strict';

    return Circles.find( {
      // Nothing for now
    }, {
      sort: {
        date_created: -1  
      }
    } );
  }
})