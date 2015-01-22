// ======================================
// circles-update-form-template-helper.js
// ======================================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ======================================
// Contains Template Helper and Events for the Circle Update Form

// ============
// Lint Globals
// ============
/* global addToAlerts */

+function () {
  'use strict';

  // =================
  // Template Rendered
  // =================
  Template.circlesUpdateForm.rendered = function () {
    $( '.delete-circle' ).holdToDelete( {
      cleanup : function () {
        if ( $( this ).data( 'original-background-color' ) &&
             ! ( this ).data( 'to-be-deleted' ) ) {
          var originalColor = $( this ).data( 'original-background-color' )
          $( this ).css( 'background', originalColor )
        }
      },
      increment : function ( count ) {
        var originalColor;


        if ( $( this ).data( 'original-background-color' ) ) {
          originalColor = $( this ).data( 'original-background-color' )
        } else {
          originalColor = $( this ).css( 'background-color' )
          $( this ).data( 'original-background-color', originalColor )
        }

        $( this ).css(
          'background',
          'linear-gradient(to right, ' +
          '#f00 0%, ' +
          '#f00 ' + count + '%, ' +
          originalColor + ' ' + count + '%, ' +
          originalColor + ' 100%)')
      },
      success : function () {
        $( this ).data( 'to-be-deleted', true )
        $( this ).css( 'background', '#f00' )
      },
      speed : 30
    } )
  }

  // ======
  // Events
  // ======
  Template.circlesUpdateForm.events( {
    'htdsuccess .delete-circle' : function ( e ) {
      e.preventDefault()
      e.stopPropagation()

      var circleId = this._id
      $( e.target ).hide()

      Meteor.call( 'circlesDelete', circleId, addToAlerts( function () {
        $( e.target ).show()
      }, function () {
        Router.go ( '/' )
      } ) )
    }
  } )

}();
