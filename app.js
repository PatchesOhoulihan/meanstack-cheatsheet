//-----------------------------------------------------------------
// Imports
//-----------------------------------------------------------------

var express = require('express');
var app = express();
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});
var formidable = require('formidable');
var credentials = require('./credentials');
var session = require('express-session');
var parseurl = require('parseurl');



//-----------------------------------------------------------------
// App init
//-----------------------------------------------------------------

app.use(session({
    resave: false,
    saveUninitializeled: true,
    secret: credentials.cookieSecret
}));

app.use(require('cookie-parser')(credentials.cookieSecret))
app.use(require('body-parser').urlencoded({extended: true}));

app.disable('x-powered-by');

app.engine('handlebars', handlebars.engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

app.set('port' , process.env.PORT || 3000);

app.set('Schnitzel', 'Lecker');



//-----------------------------------------------------------------
// Defining Route Pipeline
//-----------------------------------------------------------------

app.use(function(req, res, next){
    var views = req.session.views;

    if(!views){
        views = req.session.views = {}
    }

    var pathname = parseurl(req).pathname;

    views[pathname] = (views[pathname] || 0) + 1;

    next();
});

app.get('/viewcount', function(req, res, next){
    res.send('You viewed this page ' + req.session.views['/viewcount'] + ' times');
});

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

app.get('/file-upload', function(req,res){
    var now = new Date();
    res.render('upload', {
        year: now.getFullYear(),
        month: now.getMonth()
    });
});

app.post('/file-upload/:year/:month', function(req, res){
    //DB Mockup for later DB integration
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, file){
        if(err){
            return res.redirect(303, '/error');
        }
    console.log('Received File');
    console.log(file);
    res.redirect(303, '/thankyou');
    });
});

app.get('/about', function(req, res){
    res.render('about');
    console.log("Request for About");
});

app.get('/contact', function(req,res){
    res.render('contact', {csrf: 'CSRF token here'});
});

app.get('/thankyou', function(req,res){
    res.render('thankyou');
});

app.post('/process', function(req,res){
    //Mockup for later DB integration.
    console.log('Form : ' + req.query.form);
    console.log('CSRF token : ' + req.body._csrf);
    console.log('Email : ' + req.body.email);
    console.log('Question : ' + req.body.ques);
    res.redirect(303, '/thankyou');
});

app.get('/cookie' ,function(req, res){
    res.cookie('CookieKey', 'value12345', {expire: new Date() + 9999}).render('setcookie');
});

app.get('/listcookies', function(req, res){
    console.log(req.cookies);
    res.render('getcookies', {cookie: req.cookies.CookieKey});
});

app.get('/deletecookie', function(req,res){
    console.log('Delete Cookie (show nothing when deleted): ' +  req.cookies.CookieKey);
    res.clearCookie('CookieKey').render('deletecookie');
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
});

//console.log(app);