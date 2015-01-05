
/* global Accounts */

Meteor.methods( {
  resendVerificationEmail : function () {
    'use strict';

    Accounts.sendVerificationEmail( this.userId )
  }
} )
