

Session.setDefault( 'alerts', [] )

// Template.home.created = function () {
//   'use strict';

//   if ( Accounts._verifyEmailToken ) {
//     Accounts.verifyEmail( Accounts._verifyEmailToken, function ( error ) {
//       var html = ''

//       if ( error != null) {
//         if ( error.message == 'Verify email link expired [403]' ) {
//           html += 'Sorry, this verification link has expired. '
//           html += '<a href="#" class="resend-verification-email">Click here to resend</a>. '
//         } else {
//           html += 'Something bad happend. '
//           html += '<a href="#" class="resend-verification-email">Click here to resend</a>. '
//         }
//       } else {
//         html += 'Thank you! Your email address has been confirmed. '
//       }

//       var alerts = Session.get( 'alerts' )
//       alerts.push( html )
//       Session.set( 'alerts', alerts )
//     } )
//   }
// };

Template.home.events( {
  'click .resend-verification-email' : function ( e ) {
    'use strict';

    e.preventDefault()

    Meteor.call( 'resendVerificationEmail' )

    var alerts = Session.get( 'alerts' )
    var index  = alerts.indexOf( this )
    alerts.splice( index, 1 )

    Session.set( 'alerts', alerts )
  }
} );
