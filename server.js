var express = require('express'); //Ensure our express framework has been added
//var session = require('express-session');
var axios = require('axios');
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
//app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));// Set the relative path; makes accessing the resource directory easier

app.get('/', function(req, res){
    res.render('index.ejs');
});

app.get('/reviews', function(req, res){
    res.render('reviews.ejs');
});

app.post('/get_feed', function(req, res) {
	var tvshow = req.body.searchBar; //TODO: Remove null and fetch the param (e.g, req.body.param_name); Check the NYTimes_home.ejs file or console.log("request parameters: ", req) to determine the parameter names
	console.log(`https://api.tvmaze.com/search/shows?q=${tvshow}`);
	//res.redirect(`https://www.tvmaze.com/search/shows?q=${tvshow}`);
	if(tvshow) {
		axios({
			url: `https://api.tvmaze.com/search/shows?q=${tvshow}`,
			  method: 'GET',
			  dataType:'json',
			})
			  .then(res => {
				// TODO: Return the reviews to the front-end (e.g., res.render(...);); Try printing 'items' to the console to see what the GET request to the Twitter API returned.
				// Did console.log(items) return anything useful? How about console.log(items.data.results)?
				// Stuck? Look at the '/' route above
				console.log(res.data);
			  })
			  .catch(error => {
				console.log(error);
				
			  }); 

	  /*axios({
		url: `https://www.tvmaze.com/search/shows?q=${tvshow}`,
		  method: 'GET',
		  dataType:'json',
		})
		  .then(items => {
			// TODO: Return the reviews to the front-end (e.g., res.render(...);); Try printing 'items' to the console to see what the GET request to the Twitter API returned.
			// Did console.log(items) return anything useful? How about console.log(items.data.results)?
			// Stuck? Look at the '/' route above
			console.log(items.data.results);
			res.render('pages/main',{
			my_title: "TV Show Results",
			heading: items.data.results[0].name,
			items: items.data,
			error: false,
			message: ''
			})
		  })
		  .catch(error => {
			console.log(error);
			res.render('pages/main', {
			my_title: "TV Show Results",
			items: '',
			error: true,
			message: error
			})
			
		  }); */
  
  
	}
	else {
	  // TODO: Render the home page and include an error message (e.g., res.render(...);); Why was there an error? When does this code get executed? Look at the if statement above
	  // Stuck? On the web page, try submitting a search query without a search term
	  res.render('pages/main', {
		my_title: "TV Show Results",
		items: '',
		error: true,
		message: 'No tv shows found!'
	  })
	}
	
  });  

app.get('/showsdisplay', function(req, res){
	res.render('showsdisplay.ejs');
});

app.listen(3000);
console.log('3000 is the magic port');