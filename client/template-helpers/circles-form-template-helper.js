/**
 * Circles Form Template Helper
 *
 * Template Helper for the circles form, including `circles-add-form` and
 * `circles-update-form`.
 */

// A special function defined by Meteor
/* global check */

/* global Circles */
/* global Schema */

// Session gets reset in the router
Session.setDefault( 'invited-friends', [] );
var circlesContext = Schema.circles.namedContext( 'circle' );

function createCircleFromForm () {
  'use strict';
  var name = $('input[name="name"]').val()

  var circle = Schema.circles.clean( {
    name : name
  } )

  return circle
}

function getErrorMessageForCircle ( circle ) {
  'use strict';

  try {
    check( circle, Schema.circles )
  } catch ( ex ) {
    return ex
  }

  return null
}

// ================
// Circles Add Form
// ================

Template['circles-add-form'].helpers({
  nameIsNotValid : function () {
    'use strict';

    var errors = Session.get( 'form-errors' )

    if ( errors ) {
      var circle   = createCircleFromForm()
      var isValid = circlesContext.validateOne(
        circle, 'name'
      )

      return ! isValid
    } else {
      return false
    }
  },
  nameErrorMessage : function () {
    'use strict';
    var allErrors = circlesContext.invalidKeys()

    if ( allErrors != null ) {
      for ( var i = 0; i < allErrors.length; i++ ) {
        if ( allErrors[i].name == 'name' ) {
          return 'Name is required'
        }
      }
    }

    return null;
  },
  isValidForm : function () {
    'use strict';

    return Session.get( 'form-errors' ) == null
  }
});

Template['circles-add-form'].events({
  'keyup #circles_add_form input, change #circles_add_form input' : function () {
    'use strict';

    var circle = createCircleFromForm()
    var errors = getErrorMessageForCircle( circle )

    Session.set( 'form-errors', errors )
  },
  'submit #circles_add_form' : function ( e ) {
    'use strict';

    e.preventDefault();

    var circle = createCircleFromForm()

    Circles.insert( circle );

    // redirect to the full view
    Router.go( 'circle', {
      slug : circle.slug
    });
  }
});

// ===================
// Circles Update Form
// ===================

// TODO

Template['circles-update-form'].helpers({
  invitedFriends : function () {
    'use strict';
    return Session.get( 'invited-friends' );
  }
})

Template['circles-update-form'].events({
  'click #add_invited_friend' : function ( e ) {
    'use strict';

    e.preventDefault();

    var invitedFriend = $('#invited_friend').val();

    // TODO check email
    var invitedFriends = Session.get( 'invited-friends' );
    invitedFriends.push( invitedFriend );

    Session.set( 'invited-friends', invitedFriends );

    // TODO clear input, close mobile keyboards
  },
  // TODO handle enter
  'click #invitedFriends .remove' : function ( e ) {
    'use strict';

    e.preventDefault();

    // Force 'this' to be a string
    var invitedFriend = this.value + '';

    var invitedFriends = Session.get( 'invited-friends' );

    for ( var i = invitedFriends.length - 1; i >= 0; i-- ) {
      if ( invitedFriends[i] === invitedFriend ) {
        invitedFriends.splice( i, 1 );
      }
    }

    Session.set( 'invited-friends', invitedFriends );
  }
});
