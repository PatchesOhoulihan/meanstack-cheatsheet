//-----------------------------------------------------------------
// Imports
//-----------------------------------------------------------------

var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});



//-----------------------------------------------------------------
// App init
//-----------------------------------------------------------------

//disable the the 
app.disable('x-powered-by');

app.engine('handlebars', handlebars.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.set('port' , process.env.PORT || 3000);

app.set('Schnitzel', 'Lecker');



//-----------------------------------------------------------------
// Defining Routes
//-----------------------------------------------------------------

app.get('/', function(req, res){
    res.render('home');
    console.log("Request for Home");
    
});

app.use(function(req,res,next){
    console.log('Looking for URL: ' + req.url);
    next();
});

app.get('/about', function(req, res){
    res.render('about');
    console.log("Request for About");
});



//-----------------------------------------------------------------
// Start App je
//-----------------------------------------------------------------

app.listen(app.get('port'), function(){
    console.log('Express started on Localhost:' + app.get('port') + ' press Ctrl-C to terminate');
})

console.log(app);