/**
 * STMP Setup
 */

Meteor.startup( function () {
  'use strict';

  var password = Assets.getText('email-password.txt');

  var smtp = {
    username : 'admin@mantarayar.com',
    password : password,
    server : 'smtp.gmail.com',
    port: 25
  }

  process.env.MAIL_URL = 'smtp://' +
    encodeURIComponent(smtp.username) +
    ':' + encodeURIComponent(smtp.password) +
    '@' + encodeURIComponent(smtp.server) +
    ':' + smtp.port;


  // =======================
  // Default Email Templates
  // =======================
  Accounts.emailTemplates.from = 'Discover What Rocks <help@mantarayar.com>'
  Accounts.emailTemplates.siteName = 'Discover What Rocks'
  Accounts.emailTemplates.verifyEmail.subject = function ( user ) {
    return 'Confirm Your Email Address'
  }

  Accounts.emailTemplates.verifyEmail.text = function ( user, url ) {
    return 'click on the following link to verify your email address: ' + url
  }

  // =============================
  // Circle Invite Email Templates
  // =============================
  Circles.emailTemplate = {}
  Circles.emailTemplate.from = 'Discover What Rocks <help@mantarayr.com>'
  Circles.emailTemplate.siteName = 'Discover What Rocks'
  Circles.emailTemplate.inviteEmail = {}
  Circles.emailTemplate.inviteEmail.subject = function ( email ) {
    return 'You\'ve Been Invited to A Circle!'
  }

  Circles.emailTemplate.inviteEmail.text = function ( email, url ) {
    return 'click on the following link to check out your circle: ' + url
  }
} );
