var express = require('express'); //Ensure our express framework has been added
var axios = require('axios');
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
//app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));// Set the relative path; makes accessing the resource directory easier

const dev_dbConfig = {
	host: 'db',
	port: 5432,
	database: process.env.POSTGRES_DB,
	user:  process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD
};

/** If we're running in production mode (on heroku), the we use DATABASE_URL
 * to connect to Heroku Postgres.
 */
const isProduction = process.env.NODE_ENV === 'production';
const dbConfig = isProduction ? process.env.DATABASE_URL : dev_dbConfig;

// Heroku Postgres patch for v10
// fixes: https://github.com/vitaly-t/pg-promise/issues/711
if (isProduction) {
  pgp.pg.defaults.ssl = {rejectUnauthorized: false};
}

const db = pgp(dbConfig);

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
			  .then(response => {
				// TODO: Return the reviews to the front-end (e.g., res.render(...);); Try printing 'items' to the console to see what the GET request to the Twitter API returned.
				// Did console.log(items) return anything useful? How about console.log(items.data.results)?
				// Stuck? Look at the '/' route above
				console.log(response.data);
				console.log(response.data[0].show.name);
				console.log(response.data[0].show.genres);
				console.log(response.data[0].show.summary);
				console.log(response.data[0].show.rating);
				console.log(response.data[0].show.image.medium);
				//const obj = JSON.parse(res.data);
				//console.log(obj);
				res.render('pages/showsdisplay',{
					name: response.data[0].show.name,
					genres: response.data[0].show.genres,
					summary: response.data[0].show.summary,
					ratings: response.data[0].show.rating.average,
					image: response.data[0].show.image.medium
				})

			  })
			  .catch(error => {
				console.log(error);	
			  })
  
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

app.post('/addreview', function(req, res) {
	var showId = req.body.show_label;
	var showTitle = req.body.show_label;
	var showReview = req.body.review_label;
	var showDate = req.body.show_label;
	var insert_into_table = "INSERT INTO reviews(id, tv_show, review, review_date) VALUES('" + 1 + "','" + showTitle  + "','" + showTitle + "','" + '18760401'+ "');";
	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_into_table), // info[0]
        ]);
    })
    .then(info => {
        res.render('reviews.ejs',{
                my_title: "Review page",
				/*
                First_name: info[1][0].first_name,
                Last_name: info[1][0].last_name,
                Username: info[1][0].username,
                Email: info[1][0].email,
                Password: info[1][0].password,
				*/
            })
    })
    .catch(err => {
            console.log('error', err);
            res.render('reviews.ejs', {
                my_title: "Review page",
                first_name: '',
                Last_name: '',
                Username: '',
                Email: '',
                Password: '',
            })
    });
});

app.get('/reviews', function(req, res) {
	var query = 'SELECT * FROM reviews;';
	db.any(query)
		.then(function (rows) {
			console.log(data);
			res.render('reviews.ejs',{
				my_title: "Reviews Table",
				reviewData: data
			})

		})
		.catch(function (err) {
			// display error message in case an error
			console.log('error', err);
			res.render('reviews.ejs',{
				my_title: "Reviews Table",
				data: ''
			})
		})
});

const server = app.listen(process.env.PORT || 3000, () => {
	console.log(`Express running → PORT ${server.address().port}`);
  });