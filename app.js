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

//Experimental code
app.use(function(req,res,next){
    console.log('Looking for URL 1: ' + req.url);
    next();
});

app.get('/', function(req, res){
    res.render('home');
    console.log("Request for Home");
    
});

//Experimental code
app.use(function(req,res,next){
    console.log('Looking for URL 2: ' + req.url);
    next();
});

app.get('/junk', function(req, res, next){
    console.log('Try to access /junk');
    //If Error is raised Express automatically sends 404
    throw new Error('/junk doesn\'t exists');
    res.render('404');
});

app.use(function(err, req, res, next){
    console.log('Error: ' + err.message);
    next();
});


app.get('/about', function(req, res){
    res.render('about');
    console.log("Request for About");
});



//-----------------------------------------------------------------
// HTTP Error Handling
//-----------------------------------------------------------------

app.use(function(req,res){
    res.type('text/html');
    res.status(404);
    res.render('404');
    console.log('I catch everything')
});

app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500);
    res.render('500');
})



//-----------------------------------------------------------------
// Start App je
//-----------------------------------------------------------------

app.listen(app.get('port'), function(){
    console.log('Express started on Localhost:' + app.get('port') + ' press Ctrl-C to terminate');
})

//console.log(app);