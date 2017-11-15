"use strict";
var AdminUser = require("../Models/AdminUser.js");
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var hash = require("node_hash");

var settings = require('../../../core/settings');

var salt = settings.nodeSalt;
var jwtSecret = settings.jwtSecret;


exports.AdminUserLogin = function(req, res) {
    AdminUser.findOne({'AdminUsername': req.body.username }).exec(function(err, results) {
		 if(err)
		 {
              var response = {};
              response["Error"] = "Invalid Username or Password";
              response["Result"] = [];
              res.json(response);
		 }
		 else{
             if(results != undefined && results != null){
                var result = results;
             
                bcrypt.compare(req.body.password, result.AdminPassword, function(err, compareres) {

                            var response = {};
                    // res evaluates to `true` if successfull login
                    if(err){
                        response["ResponseCode"] = 400;
                        response["Error"] = "Invalid Username or Password";
                        response["Result"] = [];
                        res.json(response);
                    }
                    else{
                        if(compareres){

                            AdminUser.findByIdAndUpdate(
		result._id,
		{ $push: {"LastLogged": {"LoggedInAt":new Date().toISOString()}}},
		function(err, model) {
		if(err){
		console.log(err);
		return res.send(err);
    }	
        });

AdminUser.findById(result._id.toString())
    .select({ "LastLogged": { "$slice": -1 }})
    .exec(function(err,doc) {
 response["ResponseCode"] = 200;
                            response["Error"] = "";
                            response["Result"] = doc;
                            generateToken(req,res,response);
    })

                           
                        }
                        else{
                            response["ResponseCode"] = 400;
                            response["Error"] = "Invalid Username or Password";
                            response["Result"] = [];
                            
                        res.json(response);
                        }
                    }

                });
             }
             else{
                  var response = {};
                    response["ResponseCode"] = 400;
                    response["Error"] = "Invalid Username or Password";
                    response["Result"] = [];
                    res.json(response);
             }
		 }		
   });
 };

exports.AdminUserRegister = function(req, res) {
    var testdata = new AdminUser(req.body);
    AdminUser.findOne({'AdminUsername': req.body.AdminUsername }).exec(function(err, results) {
		 if(err)
		 {
              var response = {};
              response["ResponseCode"] = 400;
              response["Error"] = "Request failed. Please try again later.";
              response["Result"] = [];
              res.json(response);
		 }
		 else{
            //  console.log(results);
             if(results != undefined && results != null){

              var response = {};
              response["ResponseCode"] = 400;
              response["Error"] = "Username already taken.Please try different one.";
              response["Result"] = [];
              res.json(response);
             }
             else{
     testdata.save(function(error, user){
        AdminUser.findOne({'AdminUsername': req.body.AdminUsername }).exec(function(err, results) {
		 if(err)
		 {
              var response = {};
              response["ResponseCode"] = 400;
              response["Error"] = "Invalid Username or Password";
              response["Result"] = [];
              res.json(response);
		 }
		 else{
             
             if(results != undefined && results != null){
                var result = results;
             
                bcrypt.compare(req.body.AdminPassword, result.AdminPassword, function(err, compareres) {

                            var response = {};
                    // res evaluates to `true` if successfull login
                    if(err){
                        response["ResponseCode"] = 400;
                        response["Error"] = "Invalid Username or Password";
                        response["Result"] = [];

                        res.json(response);
                    }
                    else{
                        if(compareres){
                            response["ResponseCode"] = 200;
                            response["Error"] = "";
                            response["Result"] = result;
                            
                            generateToken(req,res,response);
                        }
                        else{
                            response["ResponseCode"] = 400;
                            response["Error"] = "Invalid Username or Password";
                            response["Result"] = [];
                            
                        res.json(response);
                        }
                    }

                });
             }
             else{
                  var response = {};
                    response["ResponseCode"] = 400;
                    response["Error"] = "Invalid Username or Password";
                    response["Result"] = [];
                    res.json(response);
             }
		 }
        });		
   });
             }
         }
    });
    
 };

 
function generateToken(req, res, data){
    var id = data.Result._id;
	var token = jwt.sign(id.toString(), jwtSecret);
	var md5_accessToken = hash.md5(token);
            res.header('token', md5_accessToken);
            res.json(data);
};