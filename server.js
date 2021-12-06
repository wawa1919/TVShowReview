var express = require('express'); //Ensure our express framework has been added
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(session({secret: 'ssshhhhh',saveUninitialized: true,resave: true}));
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();

// set the view engine to ejs
app.set('views', '/home/node/app/views');
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'ejs');
app.use(express.static('resources/styles'));
app.use(express.static(__dirname + '/'));

const dev_dbConfig = {
    host: 'ec2-52-0-114-209.compute-1.amazonaws.com',
	port: 5432,
	database: "d6kushg2shkeat",
	user:  "guiuokmmdjtphs",
	password: "5893f10f2075df912fffd4cdf7009697fa587f1a19343ace208c7f89782a60e7"
	/*host: 'ec2-52-0-114-209.compute-1.amazonaws.com',
	port: 5432,
	database: "d6kushg2shkeat",
	user:  "guiuokmmdjtphs",
	password: "5893f10f2075df912fffd4cdf7009697fa587f1a19343ace208c7f89782a60e7"*/
};

//add code from lab 10 
const dbConfig = dev_dbConfig;

//configure port
/*
const server = app.listen(process.env.PORT || 3000, () => {
    console.log(`Express running → PORT ${server.address().port}`);
  });
*/

// Heroku Postgres patch for v10
// fixes: https://github.com/vitaly-t/pg-promise/issues/711

pgp.pg.defaults.ssl = {rejectUnauthorized: false};


var db = pgp(dbConfig);

app.get('/', function(req, res){
    res.render('main.ejs')
});

app.get('/about', function(req, res) {
	res.render('reviews.ejs');
  });

app.listen(3000);
console.log('3000 is the magic port');