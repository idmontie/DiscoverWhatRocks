// ==============================
// breadcrumbs-template-helper.js
// ==============================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ==============================
// Contains Template Helper and Events for the breadrumbes partial

+function () {
  'use strict';

  // =======
  // Helpers
  // =======
  Template.breadcrumbs.helpers( {
    breadcrumbs : function () {
      var breadcrumbs = Session.get( 'breadcrumbs' );
      var stringified = '';

      for ( var i = 0; i < breadcrumbs.length; i++ ) {

        stringified += '<span class="crumb">'

        if (i !== breadcrumbs.length - 1 ) {
          stringified += '<a href="'
          stringified += breadcrumbs[i].route
          stringified += '">'
          stringified += breadcrumbs[i].name
          stringified += '</a>'
        } else {
          stringified += breadcrumbs[i].name
        }

        stringified += '</span>'
      }

      return stringified;
    }
  } )

}();
