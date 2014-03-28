var request = require('request');

/** 
 * Call Twitter API
 *
 * See: https://dev.twitter.com/docs/auth/application-only-auth
 */
function twitter(req,res){
	var TWITTER_CONSUMER_KEY = 'CONSUMER_KEY';
	var TWITTER_CONSUMER_SECRET = 'CONSUMER_SECRET';
	var SCREEN_NAME = 'SCREEN_NAME';
	var COUNT = req.param('count') || 1;

	// Twitter OAuth settings
	var oauth = { 
		consumer_key: TWITTER_CONSUMER_KEY,
		consumer_secret: TWITTER_CONSUMER_SECRET
    	};

	//encode keys
	oauth.consumer_key = encodeURIComponent(oauth.consumer_key);
	oauth.consumer_secret = encodeURIComponent(oauth.consumer_secret);

	var opts = {
		method: 'POST',
		url: 'https://api.twitter.com/oauth2/token',
		headers: {
			'Authorization': 'Basic ' + new Buffer(oauth.consumer_key + ':' + oauth.consumer_secret).toString('base64'),
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		},
		form: {
			'grant_type': 'client_credentials'
		}
	};

	//GET TOKEN
	request.post(opts, function (error, response, body) {
		var bearer_token = JSON.parse(body).access_token.toString('utf8');
		var timelineOpts = {
			method: 'GET',
			url: 'https://api.twitter.com/1.1/statuses/user_timeline.json?count=' + COUNT + '&screen_name=' + SCREEN_NAME,
			headers: {
				'Authorization': 'Bearer ' + bearer_token
			}
		}
		//GET TWEETS
		request(timelineOpts, function(error, response, body){
			var tweets = JSON.parse(body);

			//set full URL
			tweets.map(function(tweet){
				tweet.full_url = 'https://twitter.com/'+ tweet.user.screen_name +'/status/' + tweet.id_str
			});

			res.json(tweets);
		});
	});

}
