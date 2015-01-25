
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
    access_token : accessToken,
    date_created : Date.now ()
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
    date_created : { 
      $exists : true 
    } 
  },  { 
    sort: { 
      date_created : 1 
    } 
  } )
}



Meteor.methods( {
  twitterFriends : function () {
    'use strict';

    if ( ! this.userId ) {
      throw new Meteor.Error( 'not-logged-in', 'You must be logged in to resend your verification email.' )
    }

    // TODO throttle
    // if it's only been 15 minutes since the last request, just return the old
    // set of twitter friends.
    // TODO store friends

    var user = Meteor.users.findOne( {
      _id : this.userId
    } )

    var bearer = getBearer();
    var result = HTTP.call(
      'GET',
      'https://api.twitter.com/1.1/friends/list.json?user_id=' + user.services.twitter.id + '&count=200',
      {
        'headers' : {
          'Authorization' : 'Bearer ' + bearer.access_token
        }
      } 
    );

    // TODO store f
    // TODO page through and get all of the friends

    return JSON.parse( result.content ).users;
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