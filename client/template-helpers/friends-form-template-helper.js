/**
 * Friends Form Template Helper
 */

Template.friendsForm.helpers( {
  users : function () {
    'use strict';
    var self = this

    return _.map( this.users, function ( user ) {
      return _.extend( user, {
        circleId : self._id
      })
    })
  }
} );

Template.friendsForm.events( {
  'submit #friendsAddForm' : function ( e ) {
    'use strict';

    e.preventDefault();
    e.stopPropagation();

    // TODO validate

    var email = $( '#friendsAddForm' ).find( '[name=email]' ).val()

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
