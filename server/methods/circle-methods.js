// ==================================
// circle-methods.js
// ==================================
// Copyright 2014 Mantaray AR
// Licenced under BSD
// ==================================
// Contains server-side methods for dealing with circle requests
// TODO handle throttling

// =======
// Methods
// =======
Meteor.methods( {
  circlesAdd : function ( name ) {
    var circle = Schema.circles.clean( {
      name : name
    } )
    
    var id = Circles.insert( circle )

    var realCircle = Circles.findOne( {
      _id : id
    } )

    return realCircle.slug
  }
} )