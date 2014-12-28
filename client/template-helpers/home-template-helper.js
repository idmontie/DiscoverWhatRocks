Template.home.created = function () {
  'use strict';

  if (Accounts._verifyEmailToken) {
    Accounts.verifyEmail(Accounts._verifyEmailToken, function(err) {
      if (err != null) {
        if (err.message = 'Verify email link expired [403]') {
          // TODO display to user
          // TODO resend email
          console.log('Sorry this verification link has expired.')
        }
      } else {
        // TODO display to user
        console.log('Thank you! Your email address has been confirmed.')
      }
    });
  } 
}
