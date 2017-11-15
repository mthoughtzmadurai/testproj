'use strict';
var express = require('express');
var path = require('path');

var http = require("http");

// var routes = require('./routes/index');
// var users = require('./routes/users');

// var debug = require('debug')('dear-pw:server');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost:27017/Confirmo');
// Production
// mongoose.connect('mongodb://heroku_ng2c7lzg:69f1an4v5e58ufj1rj8urg6mm8@ds037275-a0.mongolab.com:37275,ds037275-a1.mongolab.com:37275/heroku_ng2c7lzg?replicaSet=rs-ds037275');
// Development
// mongoose.connect('mongodb://heroku_gpfrError: No default engine was specified and no extension was provided.nzqx:89htrfodsesgkd8aui6moib235@ds039845-a0.mongolab.com:39845,ds039845-a1.mongolab.com:39845/heroku_gpfrnzqx?replicaSet=rs-ds039845');
var db = mongoose.connection;

var app = express();
// var engines = require('consolidate');
var bodyParser = require('body-parser');

// configure the app to use bodyParser()
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static( 'app'));
app.engine('html',  require('ejs').renderFile);
app.set('views', path.join(__dirname, './app'));
app.set('view engine', 'html');


app.use(function(req, res, next) {
  req.db = db; // Make our db accessible to our router
  res.header('Access-Control-Allow-Origin', '*'); // We can access from anywhere
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

db.on('error', function(err) {
  console.log('connection error', err);
});
db.once('open', function() {
  console.log('connected mogoose.');
});


var socketused;

var UserModel = require("./app/scripts/Models/User.js");
var ApplicationModel = require("./app/scripts/Models/Application.js");
var encrypt = require("speakeasy");

function getAuthenticationMethod(req,res){
     var data = req.body;
    ApplicationModel.findOne({'AppSecretID': data.appsecret }).exec(function(err, results) {
                    if(err)
                    {
                        var response = {};
                        response.StatusCode = 400;
                        response.msg = "Error occured. Please try again later.";
                        response.Result = returndata;
                        res.json(response);
                    }
                    else{
                        if(results != undefined && results != null){
                            if(results.BaseURL == data.baseurl){
                                UserModel.findOne({"UserName":data.username,AppID:results._id},function(err,userdata){
                                    var returndata = {"RedirectURL":results.RedirectURL,"AuthMethod":""};
                                    if(userdata != null){
                                        returndata.AuthMethod = userdata.AuthenticationMethod;
                                        if(userdata.AuthenticationMethod == "touchid"){
                                            //send push notification to devicetoken with socketid(data.socketid)
                                        }
                                    }
                                    
                                    // socketused.emit("redirect","http://www.google.com");
                                    var response = {};
                                    response.StatusCode = 200;
                                    response.msg = "";
                                    response.Result = returndata;
                                    res.json(response);
                                    
                                });
                            }
                            else{
                                 var returndata = {"RedirectURL":""};
                                var response = {};
                                response.StatusCode = 400;
                                response.msg = "Invalid App key.";
                                response.Result = returndata;
                                res.json(response);
                            }
                        }
                    }
                });
}


function registerfromDevice(req,res){
     var data = req.body;
    UserModel.findOne({'SecretBaseKey': data.qrcode, 'username':data.username }).exec(function(err, results) {
                    if(err)
                    {
                        var response = {};
                        response.StatusCode = 400;
                        response.msg = "Error occured. Please try again later.";
                        response.Result = returndata;
                        res.json(response);
                    }
                    else{
                        if(results != undefined && results != null){
                            
                            UserModel.findByIdAndUpdate(
                                results._id,
                                { "DeviceID": data.devicetoken},
                                function(err, model) {
                                    if(err){
                                                    var response = {};
                                                    response.StatusCode = 400;
                                                    response.msg = "Error occured. Please try again later.";
                                                    response.Result = {};
                                                    res.json(response);
                                    }	else{
                                        var response = {};
                                        var returndata = {"AuthMethod":results.AuthenticationMethod};
                                                        response.StatusCode = 200;
                                                        response.msg = "";
                                                        response.Result = returndata;
                                                        res.json(response);
                                    }
                                });

                               
                            }
                            else{
                                var response = {};
                                response.StatusCode = 400;
                                response.msg = "User not registered.";
                                response.Result = returndata;
                                res.json(response);
                            }
                        
                    }
                });
}


function checkcode(req,res){
    UserModel.findOne({'SecretBaseKey': data.qrcode, 'username':data.username }).exec(function(err, results) {
                    if(err)
                    {
                        var response = {};
                        response.StatusCode = 400;
                        response.msg = "Error occured. Please try again later.";
                        response.Result = returndata;
                        res.json(response);
                    }
                    else{
                        if(results != undefined && results != null){
                            if(results.BaseURL == data.baseurl){
                                
                                var userToken = data.token; // Verify the token the user gives

                                var verified = encrypt.totp.verify({
                                    secret: results.AppSecretID,
                                    encoding: 'base32',
                                    token: userToken
                                });
                            
                                if(verified){
                                    var response = {};
                                    response.StatusCode = 200;
                                    response.msg = "";
                                    response.Result = returndata;
                                    res.json(response);
                                }
                                else{
                                    var response = {};
                                    response.StatusCode = 400;
                                    response.msg = "Key is not valid.";
                                    response.Result = returndata;
                                    res.json(response);
                                }
                               
                            }
                            else{
                                var response = {};
                                response.StatusCode = 400;
                                response.msg = "User not registered.";
                                response.Result = returndata;
                                res.json(response);
                            }
                        }
                    }
                });
}

function TouchidAuthenticated(req,res){
    var data = req.body;
    UserModel.findOne({'SecretBaseKey': data.qrcode, 'username':data.username }).exec(function(err, results) {
                    if(err)
                    {
                        var response = {};
                        response.StatusCode = 400;
                        response.msg = "Error occured. Please try again later.";
                        response.Result = returndata;
                        res.json(response);
                    }
                    else{
                        if(results != undefined && results != null){

    ApplicationModel.findOne({'_id':  results.AppID }).exec(function(err, results) {
                    if(err)
                    {
                        var response = {};
                        response.StatusCode = 400;
                        response.msg = "Error occured. Please try again later.";
                        response.Result = returndata;
                        res.json(response);
                    }
                    else{
                        if(results != undefined && results != null){

                                socket.broadcast.to(data.socketid).emit("redirect",results.RedirectURL);
                            }
                            else{
                                 var returndata = {"RedirectURL":""};
                                var response = {};
                                response.StatusCode = 400;
                                response.msg = "Invalid App key.";
                                response.Result = returndata;
                                res.json(response);
                            }
                        
                    }
                });
                        }
                    }
    });
                
}

//********************* Mongoose Services - Start ************************//
var LoginApi = require('./app/scripts/controllers/LoginController.js');
app.post('/api/login', LoginApi.AdminUserLogin);
app.post('/api/register', LoginApi.AdminUserRegister);


var ApplicationApi = require('./app/scripts/controllers/ApplicationController.js');
app.post('/api/createapp', ApplicationApi.CreateApplication);
app.post("/api/updateapp",ApplicationApi.updateApp);
app.get('/api/allapplications/:creator', ApplicationApi.AllApplications);


var UserApi = require('./app/scripts/controllers/UserController.js');
app.post('/api/enableuserauthentication', UserApi.CreateUser);
// app.post('/api/getAuthenticationMethod',UserApi.getAuthenticationMethod);
app.post('/api/getAuthenticationMethod',getAuthenticationMethod);


app.post('/api/registerfromdevice',registerfromDevice);

//********************* Mongoose Services - End ************************//
// catch 404 and forward to error handler
app.use(function(req, res) {
    console.log("404 error"+req.path+res);

  var err = new Error('Not Found');
  err.status = 404;
//   next(err);
});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
  app.use(function(err, req, res) {

    console.log("405004 error");
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
    // next();
  });
//}

// production error handler
// no stacktraces leaked to user
// app.use(function(err, req, res, next) {
//   res.status(err.status || 500);
//   res.render('error', {
//     message: err.message,
//     error: {}
//   });
//   next();
// });

// app.route('/')
//     .get(function(req, res) {
//       res.render(__dirname+'/app/index.html');
//     });
// module.exports = app;

var server = http.createServer(app);
var io = require('socket.io')(server);
io.listen(server).on('connection', function (socket) {
  socketused = socket;
    console.log(socket.id);
    // sokcet.on("getid",function(data){
    //     data.id = "test";
    // });
    console.log('Connection to client established');
    // socket.on('testemo', function (data) {
        // console.log(data);
        socket.broadcast.emit('testemit', "asdasd");

    // });


    // socket.on('goalactionadded', function (data) {
    //     // console.log(data);
    //     socket.broadcast.emit('goalactionadded', data);

    // });


    // socket.on('journalcommentadded', function (data) {
    //     // console.log(data);
    //     socket.broadcast.emit('journalcommentadded', data);

    // });

    // socket.on('goalcommentadded', function (data) {
    //     // console.log(data);
    //     socket.broadcast.emit('journalcommentadded', data);

    // });

    // socket.on('checkinadded', function (data) {

    //     socket.broadcast.emit('checkinadded', data);

    // });

});
server.listen(9000);

