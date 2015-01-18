// ==================================
// _gravatar-badge-template-helper.js
// ==================================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ==================================
// Contains Template Helpers and Events for the Gravatar badges

// ============
// Lint Globals
// ============
/* global slugify */
/* global addToAlerts */

+function () {
  'use strict';

  // =================
  // Template Rendered
  // =================
  Template.gravatarBadge.rendered = function () {
    $('.delete-vote').holdToDelete( {
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

        /*
         * Hack to force Meteor to react to our
         * custom event.  Normally you would use:
         *
         * ```js
         * $(elem).on('htdsuccess')
         * ```
         */
        // var event = document.createEvent('Event');
        // event.initEvent('htdsuccess', true, true)

        //$( this )[0].dispatchEvent( event )
      }
    } )
  }

  // =======
  // Helpers
  // =======
  Template.gravatarBadge.helpers( {
    emailAsSlug : function () {
      return slugify( this.email )
    },
    isOwner : function () {
      return this.email === Meteor.user().emails[0].address.toLowerCase()
    }
  } )

  // ======
  // Events
  // ======
  Template.gravatarBadge.events( {
    'htdsuccess .delete-vote' : function ( e ) {
      e.preventDefault()
      e.stopPropagation();

      // Delete you own vote
      Meteor.call( 'meetupDeleteVote', this.meetupId, addToAlerts( null, function () {
        if ( window.voteMarker ) {
          window.voteMarker.setMap( null )
        }
      } ) )
    }
  } )
}();
