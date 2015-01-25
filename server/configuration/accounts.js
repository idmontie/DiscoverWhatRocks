
var textBlob = Assets.getText( 'configuration-twitter.json' )
var twitterConfig = JSON.parse( textBlob )

ServiceConfiguration.configurations.upsert({
    service: "twitter"
  }, { 
    $set : {
      consumerKey: twitterConfig.consumerKey,
      secret: twitterConfig.consumerSecret,
      loginStyle: 'redirect'
    }
  });