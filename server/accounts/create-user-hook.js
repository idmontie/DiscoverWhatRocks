Accounts.onCreateUser( function ( options, user ) {
  'use strict';

  user.profile = {};

  /*
   * wait for Meteor to create the user before sending the email
   */
  Meteor.setTimeout( function () {
    Accounts.sendVerificationEmail( user._id )
  }, 2000 /* 2 seconds */)

  return user
} )
