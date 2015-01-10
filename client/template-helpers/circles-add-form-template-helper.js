// ===================================
// circles-add-form-template-helper.js
// ===================================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ===================================
// Contains Template Helper and Events for the Circle Add Form

// ============
// Lint Globals
// ============
/* global check */
/* global Circles */
/* global Schema */

+function () {
  'use strict';

  // ===================
  // Local Configuration
  // ===================
  var circlesContext = Schema.circles.namedContext( 'circle' )

  // ========
  // Sessions
  // ========
  Session.setDefault( 'circleAddFormErrors', {} )

  // ================
  // Template Created
  // ================
  Template.circlesAddForm.created = function () {
    Session.set( 'circleAddFormErrors', {} )
  }

  // ==============
  // Schema Helpers
  // ==============
  Template.circlesAddForm.schemaHelpers = {
    name : function () {
      var name = $( 'input[name=name]' ).val()

      try {
        check( name, Schema.circles._schema.name.type )
      } catch ( e ) {
        return {
          valid : false,
          message : 'Please enter a valid name'
        }
      }

      if ( name.trim() === '' ) {
        return {
          valid : false,
          message : 'Please enter a name'
        }
      }

      return {
        valid : true
      }
    },
    /*
     * Common Schema Helper functionality
     */
    forceCheck : function () {
      var forceCheck = {
        name : Template.circlesAddForm.schemaHelpers.name()
      }

      Session.set( 'circleAddFormErrors', forceCheck )

      return forceCheck
    },
    forceCheckDirty : function () {
      var forceCheck = Template.circlesAddForm.schemaHelpers.forceCheck()

      var dirty = false
      for ( var check in forceCheck ) {
        if ( ! forceCheck[check].valid ) {
          dirty = true
          break;
        }
      }

      return dirty
    }
  }

  // =======
  // Helpers
  // =======
  Template.circlesAddForm.helpers( {
    nameIsNotValid : function () {
      var session = Session.get( 'circleAddFormErrors' )
      return ( ! ! session.name ) && ! session.name.valid
    },
    nameErrorMessage : function () {
      var session = Session.get( 'circleAddFormErrors' )
      return session.name.message
    },
    genericIsNotValid : function () {
      var session = Session.get( 'circleAddFormErrors' )
      return ( ! ! session.generic ) && ! session.generic.valid
    },
    genericErrorMessage : function () {
      var session = Session.get( 'circleAddFormErrors' )
      return session.generic.message
    }
  } )

  // ======
  // Events
  // ======
  Template.circlesAddForm.events( {
    'keyup input[name=name], change input[name=name]' : function () {
      var session  = Session.get( 'circleAddFormErrors' )
      session.name = Template.circlesAddForm.schemaHelpers.name()
      Session.set( 'circleAddFormErrors', session ) 
    },
    'submit form' : function ( e ) {
      e.preventDefault()

      // Client side validate
      var dirty = Template.circlesAddForm.schemaHelpers.forceCheckDirty()

      if ( dirty ) {
        return;
      }

      var name = $( 'input[name=name]' ).val()

      /*
       * Data should be a circle slug
       */
      Meteor.call( 'circlesAdd', name, function ( error, data ) {
        if ( error ) {
          console.log ( error )
          var session     = Session.get( 'circleAddFormErrors' )
          session.generic = {
            valid : false,
            message : error.reason
          }
          Session.set( 'circleAddFormErrors', session )
          return;
        } else {
          Router.go( 'circle', {
            slug : data
          } )
        }
      } )
    }
  } )
}();
