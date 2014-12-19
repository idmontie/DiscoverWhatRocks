/**
 * Home Logged In Template Helper
 *
 * Template helper for the home logged in template
 */

/* global Circles */

// normally the template name will be dashed
// But this one needs to be used as a partial

Template.homeLoggedIn.helpers({
  circles : function () {
    'use strict';

    return Circles.find( {
      // Nothing for now
    }, {
      sort: {
        dateCreated: -1
      }
    } )
  }
});
