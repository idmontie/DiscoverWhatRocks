
TwitterTokens = new Meteor.Collection( 'twitter_tokens' );

//100 Tweet limit
var Twitter = {
  urls : {
    auth : 'https://api.twitter.com/oauth2/token',
  }
}

/**
 * Credentials
 *
 * Get Twitter Credentials and put them in the database
 */
function credentials () {
  'use strict';

  var textBlob = Assets.getText( 'configuration-twitter.json' )
  var twitterConfig = JSON.parse( textBlob )

  var creds = twitterConfig.consumerKey + ":" + twitterConfig.consumerSecret

  var base64Creds = Base64.encode( creds )

  var bearer = HTTP.call(
    'POST', 
    Twitter.urls.auth,
    {
      'headers' : {
        'Authorization' : 'Basic ' + base64Creds,
        'Content-Type' : 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      'content' : 'grant_type=client_credentials'
  });

  var response = JSON.parse( bearer.content )
  var accessToken = response.access_token

  TwitterTokens.insert( {
    accessToken : accessToken,
    dateCreated : Date.now()
  } )
}

/**
 * Get the latest bearer token
 * 
 * @return bearer Object
 */
function getBearer () {
  'use strict';

  return TwitterTokens.findOne( { 
    dateCreated : { 
      $exists : true 
    } 
  },  { 
    sort: { 
      dateCreated : 1 
    } 
  } )
}

function getFriends( userTwitterId, bearer, count, cursor ) {
  var url = 'https://api.twitter.com/1.1/friends/list.json?cursor=' + cursor + 
      '&user_id=' + userTwitterId + '&count=' + count;
  HTTP.call(
    'GET',
    url,
    {
      'headers' : {
        'Authorization' : 'Bearer ' + bearer.accessToken
      }
    }, function ( error, result ) {
      if ( result && result.content ) {
        console.log( result.content );
        var response = JSON.parse( result.content );
        for ( var i = 0; i < response.users.length; i++ ) {
         TwitterDetails.insert( {
            twitterId : userTwitterId,
            friend : response.users[i],
            dateCreated: Date.now()
          }, {
            validate: false
          }, function () {
            // Do nothing, just dont be synchonous!
          } );
        }

        if ( response.next_cursor > 0 ) {
          // run the HTTP Call again with the cursor=next_cursor
          getFriends( userTwitter, bearer, count, response.next_cursor );
        }
      }
    }
  );
}

Meteor.methods( {
  twitterFriends : function () {
    console.log( '===== start =====');
    if ( ! this.userId ) {
      throw new Meteor.Error( 'not-logged-in', 'You must be logged in to resend your verification email.' )
    }

    var user = Meteor.users.findOne( {
      _id : this.userId
    } )
    var userTwitterId = user.services.twitter.id

    // See if there are past twitter friends saved in TwitterDetails
    var pastFriends = TwitterDetails.findOne( {
      twitterId : userTwitterId
    }, {
      sort : {
        dateCreated : -1
      }
    } );

    // If there is an entry in the past 30 minutes, use that.
    if ( pastFriends && 
         parseInt( pastFriends.dateCreated ) > Date.now() - 1000 * 60 * 30 ) {
      console.log( '=========== already ==========' );
      return [];
    }

    console.log( '===== start call =====');

    // Else, request
    var bearer = getBearer();
    var count  = 50;

    getFriends( userTwitterId, bearer, count, -1 );
    
    return [];
  },
  twitterSearch : function ( term ) {
    if ( ! this.userId ) {
      throw new Meteor.Error( 'not-logged-in', 'You must be logged in to resend your verification email.' )
    }

    var user = Meteor.users.findOne( {
      _id : this.userId
    } )

    var regex = new RegExp( '.*' + term + '.*', 'i' )

    // TODO only grab the ones from the latest 30 minutes
    var pastFriends = TwitterDetails.find( {
      twitterId : user.services.twitter.id,
      'friend.screen_name' : regex,
      dateCreated: {
        $gt : Date.now() - 1000 * 60 * 30
      }
    });

    console.log( '=========== return ==========' );
    pastFriends = pastFriends.fetch()
    
    pastFriends = _.map( pastFriends, function ( item ) {
      return item.friend
    } );

    return pastFriends
  }
} )

/**
 * Server Boot
 * ===========
 *
 * Runs once on load.
 *
 * Create a Circular Buffer for throttling. Set up methods
 * for the client to access.  Grab credentials and what is
 * currently trending, then set up 15 minute intervals for each. 
 */
Meteor.startup(function () {
  'use strict';

  // Boot up reoccuring credentials check
  credentials ()
  Meteor.setInterval (credentials, 1000 * 60 * 15 /* 15 minutes */ )
} )