
/* global Accounts */

Meteor.methods( {
  resendVerificationEmail : function () {
    'use strict';

    if ( ! this.userId ) {
      throw new Meteor.Error( 'not-logged-in', 'You must be logged in to resend your verification email.' )
    }

    var user = Meteor.users.findOne( {
      _id : this.userId
    } )

    if ( user.emails[0].verified ) {
      throw new Meteor.Error( 'already-verified', 'Your email has already been verified.' )
    }

    Accounts.sendVerificationEmail( this.userId )

    return 'Verification email successfully sent to ' + user.emails[0].addres;
  }
} )
