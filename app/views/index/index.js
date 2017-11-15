'use strict';

/** 
 * @ngdoc function
 * @name confirmoApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the confirmoApp
 */
angular.module('confirmoApp')
  .controller('IndexCtrl', function ($scope, $http,$location,$rootScope,$window) {
    $rootScope.username = "";
    $rootScope.uid = "";
    var access_token = $window.localStorage.getItem("AuthToken") ? $window.localStorage.getItem("AuthToken") : "";
        $rootScope.uid = $window.localStorage.getItem("UID") ? CryptoJS.AES.decrypt($window.localStorage.getItem("UID"),AppKey).toString(CryptoJS.enc.Utf8) : "";
    $rootScope.username = $window.localStorage.getItem("UName") ? CryptoJS.AES.decrypt($window.localStorage.getItem("UName"),AppKey).toString(CryptoJS.enc.Utf8) : "";

      if(access_token.length > 0 ){
            $rootScope.token = CryptoJS.AES.decrypt($window.localStorage.getItem("AuthToken"), AppKey);
          $http.defaults.headers.common.Token = $rootScope.token.toString(CryptoJS.enc.Utf8);
      }
      else{
          $http.defaults.headers.common.Token = "";
      }
    if($rootScope.username != "" && $rootScope.uid != "" && access_token != ""){
      $location.path("/dashboard");
    }

    $scope.clearForm = function(){

      $scope.user = {"username":"","password":""};
      $scope.reguser = {"name":"","email":"","username":"","password":""};
    }
    $scope.user = {"username":"","password":""};
    $scope.reguser = {"name":"","email":"","username":"","password":""};
    $scope.loginPressed = function(){
        $(".error").removeClass("error");
        
      var user = $scope.user.username.toLowerCase();
      var pass = $scope.user.password.toLowerCase();
      $scope.loginDetail = {"username":"","password":""};
      if(user == undefined || user == "")
      {
              $("#username").addClass("error");
      }
      else if(pass == undefined || pass == ""){
              $("#password").addClass("error");
      }
      else{
        $scope.loginDetail.username = user;
            $scope.loginDetail.password = pass;
            $http({
              method: 'POST',
              url: '/api/login',
              data: $scope.loginDetail,
              headers: DefHeader,                 
          }).then(function(response) {
            var data = response.data;
          
              if(data.length != 0 && data.ResponseCode == 200)
                  {
                  $window.localStorage.setItem("AuthToken", CryptoJS.AES.encrypt(response.headers('token'), AppKey));
                  $window.localStorage.setItem("UID",CryptoJS.AES.encrypt(data.Result._id,AppKey));
                  $window.localStorage.setItem("UName",CryptoJS.AES.encrypt(data.Result.AdminName,AppKey));
                 
                  // AuthHeader.authorization = $localStorage.AuthToken;
                 var access_token = $window.localStorage.getItem("AuthToken") ? $window.localStorage.getItem("AuthToken") : "";

                  if(access_token.length > 0 ){
                        $rootScope.token = CryptoJS.AES.decrypt(localStorage.getItem('AuthToken'), AppKey);
                      $http.defaults.headers.common.Token = $rootScope.token.toString(CryptoJS.enc.Utf8);
                  }
                  else{
                      $http.defaults.headers.common.Token = "";
                  }
                  
                      $("#username").val('');
                      $("#password").val('');
                    $rootScope.username = data.Result.AdminName;
                    $rootScope.uid = data.Result._id;
                    $rootScope.Tag = data.AdminType;
                    $location.path("/dashboard");
                    }
                else{
                      //$location.path('/');
                      $('#error').html('<span class="label label-danger">'+data.Error+'</span>');
                      $('.error_msg').show();
                      $("#username,#password").addClass("error");
                      $("#username").val("");
                      $("#password").val("");
                }
          
      }, function(response) {
                      $('#error').html('<span class="label label-danger">'+data.Error+'</span>');
      $('.error_msg').show();
                      $("#username,#password").addClass("error");
                      $("#username").val("");
                      $("#password").val("");
      });;
        
      }
    }
    
    $scope.createPressed = function(){
       $(".error").removeClass("error");
			$(".regerror_msg").hide();
      $("#regerror").html("");
	  $scope.userDetail = {"AdminType":"UA","AdminName":$scope.reguser.name,"AdminEmail":$scope.reguser.email,"AdminUsername":$scope.reguser.username,"AdminPassword":$scope.reguser.password};
		if($scope.reguser.name == undefined || $scope.reguser.name == "")
		{
             $("#name").addClass("error");
		}
    else if($scope.reguser.email == undefined || $scope.reguser.email == ""){
             $("#email").addClass("error");
    }
    else if($scope.reguser.email != "" && /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test($scope.reguser.email.trim()) == false){
         $("#email").addClass("error");$(".regerror_msg").show();
      $("#regerror").html("Please enter valid email id");
    }
    else if($scope.reguser.username == undefined || $scope.reguser.username  == "")
		{
            $("#regusername").addClass("error");
		}
    else if($scope.reguser.password == undefined || $scope.reguser.password == ""){
            $("#regpassword").addClass("error");
    }
    else if($scope.reguser.password != "" && $scope.reguser.password != $("#confpass").val().trim() ){
            $("#confpass").addClass("error");
            $(".regerror_msg").show();
            $("#regerror").html("Password mismatch.");
    }
		else{
            $scope.userDetail = 
                $http({
                  method: 'POST',
                  url: '/api/register',
                  data: $scope.userDetail,
                  headers: {'Content-Type': 'application/json'},                 
              }).then(function(response) {
                var data = response.data;
              
                if(data.length != 0 && data.ResponseCode == 200)
                    {
                         $window.localStorage.setItem("AuthToken", CryptoJS.AES.encrypt(response.headers('token'), AppKey));
                  $window.localStorage.setItem("UID",CryptoJS.AES.encrypt(data.Result._id,AppKey));
                  $window.localStorage.setItem("UName",CryptoJS.AES.encrypt(data.Result.AdminName,AppKey));
                 
                  // AuthHeader.authorization = $localStorage.AuthToken;
                 var access_token = $window.localStorage.getItem("AuthToken") ? $window.localStorage.getItem("AuthToken") : "";

                  if(access_token.length > 0 ){
                        $rootScope.token = CryptoJS.AES.decrypt(localStorage.getItem('AuthToken'), AppKey);
                      $http.defaults.headers.common.Token = $rootScope.token.toString(CryptoJS.enc.Utf8);
                  }
                  else{
                      $http.defaults.headers.common.Token = "";
                  }
                  
                    $rootScope.username = data.Result.AdminName;
                    $rootScope.uid = data.Result._id;
                    $rootScope.Tag = data.AdminType;

                          $scope.reguser = {"name":"","email":"","username":"","password":""};
                          $location.path("/dashboard");
                      }
                    else{
                        //$location.path('/');
                        $('#regerror').html('<span class="label label-danger">'+data.Error+'</span>');
                          $('.regerror_msg').show();
                    }
              
      }, function(response) {
                       $('#regerror').html('<span class="label label-danger">'+data.Error+'</span>');
                          $('.regerror_msg').show();
      });;
          
          }
    }

});
