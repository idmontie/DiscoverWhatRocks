// ===============================
// friends-form-template-helper.js
// ===============================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ===============================
// Contains Template Helper and Events for the Friends Form

// ============
// Lint Globals
// ============
/* global check */

+function () {
  'use strict';

  // ========
  // Sessions
  // ========
  Session.setDefault( 'friendsFormErrors', {} )

  // ================
  // Template Created
  // ================
  Template.friendsForm.created = function () {
    Session.set( 'friendsFormErrors', {} )
  }

  // =================
  // Template Rendered
  // =================
  Template.friendsFormEach.rendered = function () {
    $('.delete-email').holdToDelete( {
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
        var event = document.createEvent('Event');
        event.initEvent('htdsuccess', true, true)

        $( this )[0].dispatchEvent( event )
      }
    } )
  }

  // ==============
  // Schema Helpers
  // ==============
  Template.friendsForm.schemaHelpers = {
    email : function ( worry ) {
      var email = $( 'input[name=email]' ).val()

      try {
        check( email, String )
      } catch ( e ) {
        return {
          valid : false,
          message : 'Please enter a valid email'
        }
      }

      if ( email.trim() === '' && worry === true ) {
        return {
          valid : false,
          message : 'Please enter an email'
        }
      }

      return {
        valid : true
      }
    },
    /*
     * Common Schema Helper functionality
     */
    forceCheck : function ( worry ) {
      var forceCheck = {
        email : Template.friendsForm.schemaHelpers.email( worry )
      }

      Session.set( 'friendsFormErrors', forceCheck )

      return forceCheck
    },
    forceCheckDirty : function ( worry ) {
      var forceCheck = Template.friendsForm.schemaHelpers.forceCheck( worry )

      var dirty = false
      for ( var check in forceCheck ) {
        if ( ! forceCheck[check].valid ) {
          dirty = true
          break;
        }
      }

      return dirty
    }
  }

  // =======
  // Helpers
  // =======
  Template.friendsForm.helpers( {
    /*
     * Extent users to have a circleId so that
     * we can access the circleId in events.
     *
     * This is because when we use the #each
     * helper, our template context changes!
     */
    users : function () {
      var self = this

      return _.map( this.users, function ( user ) {
        return _.extend( user, {
          circleId : self._id
        } )
      } )
    },
    emailIsNotValid : function () {
      var session = Session.get( 'friendsFormErrors' )
      return ( ! ! session.email ) && ! session.email.valid
    },
    emailErrorMessage : function () {
      var session = Session.get( 'friendsFormErrors' )
      return session.email.message
    },
    genericIsNotValid : function () {
      var session = Session.get( 'friendsFormErrors' )
      return ( ! ! session.generic ) && ! session.generic.valid
    },
    genericErrorMessage : function () {
      var session = Session.get( 'friendsFormErrors' )
      return session.generic.message
    }
  } )

  // ======
  // Events
  // ======
  Template.friendsForm.events( {
    'keyup input[name=email], change input[name=email]' : function () {
      var session = Session.get( 'friendsFormErrors' )
      session.email = Template.friendsForm.schemaHelpers.email()
      Session.set( 'friendsFormErrors', session )
    },
    'submit form' : function ( e ) {
      e.preventDefault()

      // Client side validate
      var dirty = Template.friendsForm.schemaHelpers.forceCheckDirty( true )

      if ( dirty ) {
        return;
      }

      var email =  $( 'input[name=email]' ).val()
      $( 'input[name=email]' ).val( '' )

      Meteor.call( 'friendsInvite', email, this._id, function ( error, data ) {
        if ( error ) {
          var session     = Session.get( 'friendsFormErrors' )
          session.generic = {
            valid : false,
            message : error.reason
          }
          Session.set( 'friendsFormErrors', session )
        } else {
          var alerts = Session.get( 'alerts' )
          alerts.push( data )
          Session.set( 'alerts', alerts )
        }
      } )
    },
    'click .resend-invitation:not(.disabled)' : function ( e ) {
      e.preventDefault()

      $( e.target ).addClass( 'disabled' )
      var email = this.email

      Meteor.call( 'friendsInvite', email, this.circleId, function ( error, data ) {
        if ( error ) {
          var session     = Session.get( 'friendsFormErrors' )
          session.generic = {
            valid : false,
            message : error.reason
          }
          Session.set( 'friendsFormErrors', session )
        } else {
          var alerts = Session.get( 'alerts' )
          alerts.push( data )
          Session.set( 'alerts', alerts )
        }
      } )
    }
  } )

  Template.friendsFormEach.events( {
    'htdsuccess .delete-email' : function ( e ) {
      e.preventDefault()
      e.stopPropagation()

      var email = this.email
      $( e.target ).hide()

      Meteor.call( 'friendsUninvite', email, this.circleId, function ( error, data ) {
        var alerts = Session.get( 'alerts' )
        if ( error ) {
          $( e.target ).show()
          alerts.push( error.reason )
        } else {
          alerts.push ( data )
        }

        Session.set( 'alerts', alerts )
      } )
    }
  } )
}();
