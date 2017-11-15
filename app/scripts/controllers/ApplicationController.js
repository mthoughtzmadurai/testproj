"use strict";
var ApplicationModel = require("../Models/Application.js");
var encrypt = require("speakeasy");

exports.AllApplications = function(req,res){
    var creatorid = req.params.creator;
    // console.log(creatorid);
    ApplicationModel.find({'CreatedBy': creatorid}).exec(function(err, results) {
		if(err)
		{
			console.log("err: " + err);
		}
		else{
            res.send(results);   
		}  
  });

}

exports.CreateApplication = function(req, res) {
    var data = req.body;
    var secret = generateSecret(data,res);
}

function generateSecret(data,res){
    var secret = encrypt.generateSecret({length: 20});
    // return secret;
    var check = checkSecret(data,secret,res);
    
}

function checkSecret(data,secret,res){
    var applications = [];
    ApplicationModel.findOne({'AppSecretID': secret.base32 }).exec(function(err, results) {
		 if(err)
		 {
             res.json(applications);
		 }
		 else{
            if(results == undefined || results == null || results.length == 0){
               data["AppSecretID"] =  secret.base32; 
                var appdata = new ApplicationModel(data);
                appdata.save(function(err,data){
                    var creatorid = data.CreatedBy;
                    ApplicationModel.find({'CreatedBy': creatorid},function(err,applications){
                        res.json(applications);
                    });
                });
            }
            else{
                generateSecret(data,res);
            }
         }
    });
}


exports.updateApp = function(req,res){
    ApplicationModel.findByIdAndUpdate(req.body.appid,{"isActive":req.body.status},function(err,model){
        ApplicationModel.find({'CreatedBy': req.body.createdby},function(err,applications){
            res.json(applications);
        });
    });
}