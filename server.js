var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var cors = require('cors');

const path = require('path');
var morgan = require('morgan');

require('./config/database');

var bodyParser = require('body-parser');

app.use(morgan('dev'));
app.use(cors());


//for application/json type request
app.use(bodyParser.json());


//for postman x-www-form-urlencoded type request
app.use(bodyParser.urlencoded({
  extended: true
}));



var apiRoutes = require('./api/api');


//static file
app.use(express.static(__dirname + '/public'));


//localos:3000/api/xxxxx
app.use('/api', apiRoutes);

//routes
require('./app/routes')(app);



//launch==================================================
app.listen(port, function () {
  console.log('Server is running on port ' + port + '..........');

});
