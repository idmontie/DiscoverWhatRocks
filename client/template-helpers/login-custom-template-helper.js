// ===============================
// login-custom-template-helper.js
// ===============================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ===============================
// Contains custom login template functions
// @see https://github.com/meteor/meteor/blob/3444da6d569d2352f7f638cb8bd2f69ce3b5bb3f/packages/accounts-ui-unstyled/login_buttons.js#L86

// ============
// Lint Globals
// ============
/* global Accounts */
/* global Tracker */

+function ( _$ ) {
  'use strict';

  // ===============
  // Local Variables
  // ===============
  var loginButtonsSession = Accounts._loginButtonsSession

  // ======
  // Events
  // ======
  Template.loginCustom.events( {
    'click #login-buttons-password' : function () {
      _$.loginOrSignup()
    },
    'keypress #forgot-password-email' : function ( event ) {
      if ( event.keyCode === 13 )
        _$.forgotPassword()
    },
    'click #login-buttons-forgot-password' : function () {
      _$.forgotPassword()
    },
    'click #signup-link' : function () {
      loginButtonsSession.resetMessages()

      // store values of fields before swtiching to the signup form
      var username        = _$.trimmedElementValueById( 'login-username' )
      var email           = _$.trimmedElementValueById( 'login-email' )
      var usernameOrEmail = _$.trimmedElementValueById( 'login-username-or-email' )
      var password        = _$.elementValueById( 'login-password' )

      loginButtonsSession.set( 'inSignupFlow', true )
      loginButtonsSession.set( 'inForgotPasswordFlow', false )
      // force the ui to update so that we have the approprate fields to fill in
      Tracker.flush()

      // update new fields with appropriate defaults
      if ( username !== null )
        document.getElementById( 'login-username' ).value = username
      else if ( email !== null )
        document.getElementById( 'login-email' ).value = email
      else if ( usernameOrEmail !== null )
        if ( usernameOrEmail.indexOf( '@' ) === -1 )
          document.getElementById( 'login-username' ).value = usernameOrEmail
      else
        document.getElementById( 'login-email' ).value = usernameOrEmail

      if (password !== null)
        document.getElementById( 'login-password' ).value = password

      // Force redrawing the `login-dropdown-list` element because of
      // a bizarre Chrome bug in which part of the DIV is not redrawn
      // in case you had tried to unsuccessfully log in before
      // switching to the signup form.
      //
      // Found tip on how to force a redraw on
      // http://stackoverflow.com/questions/3485365/how-can-i-force-webkit-to-redraw-repaint-to-propagate-style-changes/3485654#3485654
      var redraw = document.getElementById( 'login-dropdown-list' )
      redraw.style.display = 'none'
      redraw.offsetHeight; // it seems that this line does nothing but is necessary for the redraw to work
      redraw.style.display = 'block'
    },
    'click #forgot-password-link': function () {
      loginButtonsSession.resetMessages()

      // store values of fields before swtiching to the signup form
      var email           = _$.trimmedElementValueById( 'login-email' )
      var usernameOrEmail = _$.trimmedElementValueById( 'login-username-or-email' )

      loginButtonsSession.set( 'inSignupFlow', false )
      loginButtonsSession.set( 'inForgotPasswordFlow', true )
      // force the ui to update so that we have the approprate fields to fill in
      Tracker.flush()

      // update new fields with appropriate defaults
      if ( email !== null )
        document.getElementById( 'forgot-password-email' ).value = email
      else if ( usernameOrEmail !== null )
        if ( usernameOrEmail.indexOf( '@' ) !== -1 )
          document.getElementById( 'forgot-password-email' ).value = usernameOrEmail

    },
    'click #back-to-login-link': function () {
      loginButtonsSession.resetMessages()

      var username = _$.trimmedElementValueById( 'login-username' )
      var email = _$.trimmedElementValueById( 'login-email' )
               || _$.trimmedElementValueById( 'forgot-password-email' ) // Ughh. Standardize on names?
      // notably not trimmed. a password could (?) start or end with a space
      var password = _$.elementValueById( 'login-password' )

      loginButtonsSession.set( 'inSignupFlow', false )
      loginButtonsSession.set( 'inForgotPasswordFlow', false )
      // force the ui to update so that we have the approprate fields to fill in
      Tracker.flush()

      if ( document.getElementById( 'login-username' ) )
        document.getElementById( 'login-username' ).value = username
      if ( document.getElementById( 'login-email' ) )
        document.getElementById( 'login-email' ).value = email

      if ( document.getElementById( 'login-username-or-email' ) )
        document.getElementById( 'login-username-or-email' ).value = email || username

      if ( password !== null )
        document.getElementById( 'login-password' ).value = password
    },
    'keypress #login-username, keypress #login-email, keypress #login-username-or-email, keypress #login-password, keypress #login-password-again': function ( event ) {
      if ( event.keyCode === 13 )
        _$.loginOrSignup()
    }
  } )

  // =============
  // Login Helpers
  // =============
  _$.elementValueById = function ( id ) {
    var element = document.getElementById( id )
    if ( ! element )
      return null
    else
      return element.value
  }

  _$.trimmedElementValueById = function ( id ) {
    var element = document.getElementById( id )
    if ( ! element )
      return null
    else
      return element.value.replace( /^\s*|\s*$/g, '' ) // trim() doesn't work on IE8;
  }

  _$.loginOrSignup = function () {
    if (loginButtonsSession.get( 'inSignupFlow' ) )
      _$.signup()
    else
      _$.login()
  }

  _$.login = function () {
    loginButtonsSession.resetMessages()

    var username = _$.trimmedElementValueById( 'login-username' )
    var email = _$.trimmedElementValueById( 'login-email' )
    var usernameOrEmail = _$.trimmedElementValueById( 'login-username-or-email' )
    // notably not trimmed. a password could (?) start or end with a space
    var password = _$.elementValueById( 'login-password' )

    var loginSelector
    if ( username !== null ) {
      if ( ! _$.validateUsername( username ) )
        return
      else
        loginSelector = { username: username }
    } else if ( email !== null ) {
      if ( ! _$.validateEmail( email ) )
        return
      else
        loginSelector = { email: email }
    } else if ( usernameOrEmail !== null ) {
      // XXX not sure how we should validate this. but this seems good enough (for now),
      // since an email must have at least 3 characters anyways
      if ( ! _$.validateUsername( usernameOrEmail ) )
        return
      else
        loginSelector = usernameOrEmail
    } else {
      throw new Error( 'Unexpected -- no element to use as a login user selector' )
    }

    Meteor.loginWithPassword( loginSelector, password, function ( error ) {
      if ( error ) {
        loginButtonsSession.errorMessage( error.reason || 'Unknown error' );
      } else {
        loginButtonsSession.closeDropdown();
      }
    });
  };

  _$.signup = function () {
    loginButtonsSession.resetMessages()

    // to be passed to Accounts.createUser
    var options = {}

    var username = _$.trimmedElementValueById( 'login-username' )
    if ( username !== null ) {
      if ( ! _$.validateUsername( username ) )
        return
      else
        options.username = username
    }

    var email = _$.trimmedElementValueById( 'login-email' )
    if ( email !== null ) {
      if ( ! _$.validateEmail( email ) )
        return
      else
        options.email = email
    }

    // notably not trimmed. a password could (?) start or end with a space
    var password = _$.elementValueById( 'login-password' )
    if ( ! _$.validatePassword( password ) )
      return
    else
      options.password = password;

    if ( ! _$.matchPasswordAgainIfPresent() )
      return;

    Accounts.createUser(options, function ( error ) {
      if ( error ) {
        loginButtonsSession.errorMessage( error.reason || 'Unknown error' );
      } else {
        loginButtonsSession.closeDropdown();
      }
    });
  };

  _$.forgotPassword = function () {
    loginButtonsSession.resetMessages();

    var email = _$.trimmedElementValueById( 'forgot-password-email' );
    if ( email.indexOf( '@' ) !== -1 ) {
      Accounts.forgotPassword( { email: email }, function ( error ) {
        if (error)
          loginButtonsSession.errorMessage( error.reason || 'Unknown error' );
        else
          loginButtonsSession.infoMessage( 'Email sent' );
      });
    } else {
      loginButtonsSession.errorMessage( 'Invalid email' );
    }
  };

  _$.changePassword = function () {
    loginButtonsSession.resetMessages()

    // notably not trimmed. a password could (?) start or end with a space
    var oldPassword = _$.elementValueById( 'login-old-password' )

    // notably not trimmed. a password could (?) start or end with a space
    var password = _$.elementValueById( 'login-password' )
    if ( ! _$.validatePassword( password ) )
      return;

    if ( ! _$.matchPasswordAgainIfPresent() )
      return;

    Accounts.changePassword(oldPassword, password, function (error) {
      if (error) {
        loginButtonsSession.errorMessage( error.reason || 'Unknown error' );
      } else {
        loginButtonsSession.set( 'inChangePasswordFlow', false )
        loginButtonsSession.set( 'inMessageOnlyFlow', true )
        loginButtonsSession.infoMessage( 'Password changed' )
      }
    });
  };

  _$.matchPasswordAgainIfPresent = function () {
    // notably not trimmed. a password could (?) start or end with a space
    var passwordAgain = _$.elementValueById('login-password-again');
    if ( passwordAgain !== null ) {
      // notably not trimmed. a password could (?) start or end with a space
      var password = _$.elementValueById('login-password');
      if (password !== passwordAgain) {
        loginButtonsSession.errorMessage( 'Passwords don\'t match');
        return false;
      }
    }
    return true;
  };

  _$.correctDropdownZIndexes = function () {
    // IE <= 7 has a z-index bug that means we can't just give the
    // dropdown a z-index and expect it to stack above the rest of
    // the page even if nothing else has a z-index.  The nature of
    // the bug is that all positioned elements are considered to
    // have z-index:0 (not auto) and therefore start new stacking
    // contexts, with ties broken by page order.
    //
    // The fix, then is to give z-index:1 to all ancestors
    // of the dropdown having z-index:0.
    for ( var n = document.getElementById('login-dropdown-list').parentNode;
        n.nodeName !== 'BODY';
        n = n.parentNode )
      if (n.style.zIndex === 0)
        n.style.zIndex = 1;
  };

  // ===========
  // Validations
  // ===========

  _$.validateEmail = function (email) {
    if (email.indexOf('@') !== -1) {
      return true;
    } else {
      loginButtonsSession.errorMessage( 'Invalid email' );
      return false;
    }
  };

  _$.validatePassword = function (password) {
    if (password.length >= 6) {
      return true;
    } else {
      loginButtonsSession.errorMessage( 'Password must be at least 6 characters long' );
      return false;
    }
  };
}(this);

