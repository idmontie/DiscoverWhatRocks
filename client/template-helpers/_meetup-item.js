Template._meetupItem.helpers( {
  avatarUrl : function () {
    // TODO
  }
} )

Template._meetupItem.events( {
  'click button[data-action=navigate]' : function ( e ) {
    e.preventDefault();
    e.stopPropagation();

    Router.go(
        'meetupsShow', 
        { 
          slug : this.slug
        }
    );
  }
} );