// ===============================
// alert-commons.js
// ===============================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ===============================
// Common global functionality for alerts

var _$ = this;

+function () {
  'use strict';

  _$.addToAlerts = function ( errorCallback, dataCallback ) {
    return function ( error, data ) {
      var alerts = Session.get( 'alerts' )
      if ( error ) {
        if ( errorCallback ) {
          errorCallback()
        }
        alerts.push( error.reason )
      } else {
        if ( dataCallback ) {
          dataCallback()
        }
        alerts.push ( data )
      }

      Session.set( 'alerts', alerts )
    }
  }
}();
