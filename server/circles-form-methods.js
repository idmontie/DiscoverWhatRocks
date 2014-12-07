SimpleSchema.debug = true
if ( Meteor.isServer ) {
  Meteor.methods({
    'insert_circle' : function ( doc ) {
      // TODO autoform is complaining and throwing
      // useless errors
      // check( doc, Schema.circles );
      console.log ( this.userId ); 

      Schema.circles.clean( doc );
      console.log ( doc );
      // insert the document
      Circles.insert( doc );

      this.unblock();
      return true;
    }
  });
}