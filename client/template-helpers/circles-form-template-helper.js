
// Session gets reset in the router
Session.setDefault( 'invited-friends', [] );
var circles_context = Schema.circles.namedContext( 'circle' );

function create_circle_from_form () {
  'use strict';
  var name = $('input[name="name"]').val()

  var circle = Schema.circles.clean( {
    name : name
  } )

  return circle
}

function get_error_message_for_circle ( circle ) {
  'use strict';

  try {
    check( circle, Schema.circles )
  } catch ( ex ) {
    return ex
  }

  return null
}

// Circles Add Form
// ================

Template['circles-add-form'].helpers({
  'name_is_not_valid' : function () {
    'use strict';

    var errors = Session.get( 'form-errors' )

    if ( errors ) {
      var circle   = create_circle_from_form()
      var is_valid = circles_context.validateOne(
        circle, 'name'
      )

      return ! is_valid
    } else {
      return false
    }
  },
  'name_error_message' : function () {
    'use strict';
    var all_errors = circles_context.invalidKeys()

    if ( all_errors != null ) {
      for ( var i = 0; i < all_errors.length; i++ ) {
        if ( all_errors[i].name == 'name' ) {
          return 'Name is required'
        }
      }
    }

    return null;
  },
  'is_valid_form' : function () {
    'use strict';

    return Session.get( 'form-errors' ) == null
  }
});

Template['circles-add-form'].events({
  'keyup #circles_add_form input, change #circles_add_form input' : function ( e ) {

    var circle = create_circle_from_form()
    var errors = get_error_message_for_circle( circle )

    Session.set( 'form-errors', errors )
  },
  'submit #circles_add_form' : function ( e ) {
    e.preventDefault();

    var circle = create_circle_from_form()

    Circles.insert( circle );

    // redirect to the full view
    Router.go( 'circle', {
      slug : circle.slug
    });
  }
});

// Circles Update Form
// ===================

Template['circles-update-form'].helpers({
  'invited_friends' : function () {
    'use strict';
    return Session.get( 'invited-friends' );
  },
})

Template['circles-update-form'].events({
  'click #add_invited_friend' : function ( e ) {
    'use strict';

    var invited_friend = $('#invited_friend').val();

    // TODO check email
    var invited_friends = Session.get( 'invited-friends' );
    invited_friends.push( invited_friend );

    Session.set( 'invited-friends', invited_friends );

    // TODO clear input, close mobile keyboards
  },
  // TODO handle enter
  'click #invited_friends .remove' : function ( e ) {
    // Force 'this' to be a string
    var invited_friend = this.value + '';

    var invited_friends = Session.get( 'invited-friends' );

    for ( var i = invited_friends.length - 1; i >= 0; i-- ) {
      if ( invited_friends[i] === invited_friend ) {
        invited_friends.splice( i, 1 );
      }
    }

    Session.set( 'invited-friends', invited_friends );
  }
});