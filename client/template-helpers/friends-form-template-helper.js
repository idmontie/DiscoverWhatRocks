// ===============================
// friends-form-template-helper.js
// ===============================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ===============================
// Contains Template Helper and Events for the Friends Form

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

  // ==============
  // Schema Helpers
  // ==============
  Template.friendsForm.schemaHelpers = {
    email : function () {
      var email = $( 'input[name=email]' ).val()

      try {
        check( name, String )
      } catch ( e ) {
        return {
          valid : false,
          message : 'Please enter a valid email'
        }
      }

      if ( email.trim() === '' ) {
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
    forceCheck : function () {
      var forceCheck = {
        email : Template.friendsForm.schemaHelpers.email()
      }

      Session.set( 'friendsFormErrors', forceCheck )

      return forceCheck
    },
    forceCheckDirty : function () {
      var forceCheck = Template.friendsForm.schemaHelpers.forceCheck()

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
      return ( ! ! session.email ) && ! session.email.valud
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
      session.email = Template.friendsForm.schemaHelpers.name()
      Session.set( 'friendsFormErrors', session )
    },
    'submit form' : function ( e ) {
      e.preventDefault()
      
      var email =  $( 'input[name=email]' ).val()

      Meteor.call( 'friendsInvite', function ( error, data ) {
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

}();


Template.friendsForm.events( {
  'submit #friendsAddForm' : function ( e ) {
    'use strict';

    e.preventDefault();
    e.stopPropagation();

    var email = $( 'input[name=email]' ).val()

    Meteor.call( 'invite', email, this._id, function ( error ) {
      // Tell the user whether they were successful or not
      var html = '';
      var alerts = Session.get( 'alerts' )

      if ( error ) {
        html = 'We could not send out an email to ' + email + '.'
      } else {
        html = 'Email successfully sent to ' + email + '.'
      }

      alerts.push( html )

      Session.set( 'alerts', alerts )
    } )

    // Reset form
    $( '#friendsAddForm' )[0].reset()
  },
  'click .resendInvitation:not(.disabled)' : function ( e ) {
    'use strict';

    e.preventDefault();
    e.stopPropagation();

    $( e.target ).addClass( 'disabled' )
    var email = this.email

    Meteor.call( 'invite', email, this.circleId, function ( error ) {
      // Tell the user whether they were successful or not
      var html = '';
      var alerts = Session.get( 'alerts' )

      if ( error ) {
        html = 'We could not send out an email to ' + email + '.'
      } else {
        html = 'Email successfully sent to ' + email + '.'
      }

      alerts.push( html )

      Session.set( 'alerts', alerts )

      $( e.target ).removeClass( 'disabled' )
    } )
  },
  'click .deleteEmail' : function ( e ) {
    'use strict';

    e.preventDefault()
    e.stopPropagation()

    var email = this.email

    Meteor.call( 'uninvite', email, this.circleId, function ( error ) {
      var html = '';
      var alerts = Session.get( 'alerts' )

      if ( error ) {
        html = 'We could not remove ' + email + ', try again later'
      } else {
        html = email + ' removed.'
      }

      alerts.push( html )

      Session.set( 'alerts', alerts )
    } )
  }
} );
