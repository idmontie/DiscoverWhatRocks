/**
 * STMP Setup
 */

/* global console */
/* global process */
/* global Assets */
/* global Accounts */
/* global Circles */

Meteor.startup( function () {
  'use strict';
  var password = null

  try {
    password = Assets.getText('email-password.txt')
  } catch ( e ) {
    console.log( 'put an email-password.txt file in the private directory!' )
    throw e;
  }

  var smtp = {
    username : 'help@mantarayar.com',
    password : password,
    server : 'smtp.gmail.com',
    port: 465
  }

  process.env.MAIL_URL = 'smtp://' +
    encodeURIComponent(smtp.username) +
    ':' + encodeURIComponent(smtp.password) +
    '@' + encodeURIComponent(smtp.server) +
    ':' + smtp.port


  // =======================
  // Default Email Templates
  // =======================
  Accounts.emailTemplates.from = 'Discover What Rocks <help@mantarayar.com>'
  Accounts.emailTemplates.siteName = 'Discover What Rocks'
  Accounts.emailTemplates.verifyEmail.subject = function ( /* user */ ) {
    return 'Confirm Your Email Address'
  }

  Accounts.emailTemplates.verifyEmail.text = function ( user, url ) {
    // TODO import an html file
    return 'Click on the following link to verify your email address: ' + url
  }

  // =============================
  // Circle Invite Email Templates
  // =============================
  Circles.emailTemplate = {}
  Circles.emailTemplate.from = 'Discover What Rocks <help@mantarayr.com>'
  Circles.emailTemplate.siteName = 'Discover What Rocks'
  Circles.emailTemplate.inviteEmail = {}
  Circles.emailTemplate.inviteEmail.subject = function ( /* email */ ) {
    return 'You\'ve Been Invited to A Circle!'
  }

  Circles.emailTemplate.inviteEmail.text = function ( email, url ) {
    // TODO import an html file
    return 'Click on the following link to check out the circle you\'ve been invited to: ' + url
  }
} );
