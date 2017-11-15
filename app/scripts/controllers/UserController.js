"use strict";
var UserModel = require("../Models/User.js");
var ApplicationModel = require("../Models/Application.js");
var encrypt = require("speakeasy");
var qrcode = require('qrcode');

exports.CreateUser = function(req, res) {
    var data = req.body;
    ApplicationModel.findOne({'AppSecretID': data.appsecret }).exec(function(err, results) {
                    if(err)
                    {
                        // res.json(applications);
                    }
                    else{
                        if(results != undefined && results != null){
                            if(results.BaseURL == data.baseurl){
                                // console.log(results);
                                data.appid = results._id;
                                data.redirecturl = results.RedirectURL;
                                generateSecret(data,res);
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

function generateSecret(data,res){
    var secret = encrypt.generateSecret({length: 20});
    // return secret;
    var check = checkSecret(data,secret,res);
    
}

function checkSecret(data,secret,res){
   

    UserModel.findOne({'SecretBaseKey': secret.base32 }).exec(function(err, results) {
		 if(err)
		 {
             res.json(results);
		 }
		 else{
            if(results == undefined || results == null || results.length == 0){

               data["SecretBaseKey"] =  secret.base32; //console.log(data); 
               qrcode.toDataURL(data["SecretBaseKey"], function (err, url) {
    
                     var userdata = {"QRPath":url,"AppID":data.appid,"SecretBaseKey":data.SecretBaseKey,"UserName":data.username,"AuthenticationMethod":data.authmethod}
                            var datauser = new UserModel(userdata);
                            datauser.save(function(err,data){
                                var returndata = {"RedirectURL":data.redirecturl,"QRcode":url};
                                var response = {};
                                response.StatusCode = 200;
                                response.msg = "Enabled successfully.";
                                response.Result = returndata;
                                res.json(response);
                            });
                    });

                
            }
            else{
                generateSecret(data,res);
            }
         }
    });
}


exports.getAuthenticationMethod = function(req,res){
     var data = req.body;
    ApplicationModel.findOne({'AppSecretID': data.appsecret }).exec(function(err, results) {
                    if(err)
                    {
                        // res.json(applications);
                    }
                    else{
                        if(results != undefined && results != null){
                            if(results.BaseURL == data.baseurl){
                                UserModel.findOne({"UserName":data.username,AppID:results._id},function(err,userdata){
                                    var returndata = {"RedirectURL":results.RedirectURL,"AuthMethod":""};
                                    if(userdata != null){
                                        returndata.AuthMethod = userdata.AuthenticationMethod;
                                    }

                                    socket.emit("fromsser","asdadasdasd");
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