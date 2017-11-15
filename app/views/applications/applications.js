'use strict';

/** 
 * @ngdoc function
 * @name confirmoApp.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the confirmoApp
 */
angular.module('confirmoApp')
  .controller('ApplicationCtrl', function ($scope, $http,$location,$rootScope,$window) {
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

   
    $scope.applications = [];
    $scope.getApplications = function(){
//         $http.get('/api/allapplications/'+$rootScope.uid).success(function(data){
//           alert("kjkjk");
//           // $scope.applications = data;
//         }).error(function(data){
// alert("ooo");
//         });

 $http({
                  method: 'GET',
                  url: '/api/allapplications/'+$rootScope.uid,               
              }).then(function(response) {
                var data = response.data;
                $scope.applications = data;
              
      }, function(response) {
      //  alert("error");
      });
    }

    if($rootScope.username == "" || $rootScope.uid == "" || access_token == ""){
      $location.path("/index");
    }
    else{
      $scope.getApplications();
    }
    
    $scope.clearForm = function(){
      
      $scope.application = {"ApplicationName":"","BaseURL":"","RedirectURL":"","CreatedBy":""};
    }

    $rootScope.logout = function (){
        $window.localStorage.setItem("AuthToken","");
        $window.localStorage.setItem("UID","");
        $window.localStorage.setItem("UName","");
        if($rootScope.username == "" || $rootScope.uid == "" || access_token == ""){
          $location.path("/index");
        }
    }

    $scope.application = {"ApplicationName":"","BaseURL":"","RedirectURL":"","CreatedBy":""};

    $scope.saveApplication = function(){
      $scope.application.CreatedBy = $rootScope.uid;
       $(".error").removeClass("error");
			$(".regerror_msg").hide();
      $("#regerror").html("");
	 	if($scope.application.ApplicationName == undefined || $scope.application.ApplicationName == "")
		{
             $("#applicationname").addClass("error");
		}
    else if($scope.application.BaseURL == undefined || $scope.application.BaseURL == ""){
             $("#applicationbase").addClass("error");
    }
    else if($scope.application.BaseURL != "" && /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test($scope.application.BaseURL) == false){
      $("#applicationbase").addClass("error");
      $("#regerror").html("Please enter valid base url");
      $(".regerror_msg").show()
    }
    else if($scope.application.RedirectURL == undefined || $scope.application.RedirectURL  == "")
		{
            $("#redirecturl").addClass("error");
		}
    else if($scope.application.RedirectURL != "" && /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/.test($scope.application.RedirectURL) == false){
      $("#applicationbase").addClass("error");
      $("#regerror").html("Please enter valid reirect url");
      $(".regerror_msg").show()
    }
		else{
            
                $http({
                  method: 'POST',
                  url: '/api/createapp',
                  data: $scope.application,
                  headers: {'Content-Type': 'application/json'},                 
              }).then(function(response) {
                var data = response.data;
                $("#successmsg").html("Application added successfully.");
                $(".success_msg").show();
                $scope.applications = data;
                $("#modal-add").modal("hide");
              
      }, function(response) {
        var data = response.data;
                       $('#regerror').html('<span class="label label-danger">'+data.Error+'</span>');
                          $('.regerror_msg').show();
      });
          
          }
    }
    
    $scope.activeordeactive = function(app){
      var status = "D";
      if(app.isActive == "D"){
        status = "A";
      }
      var title = "Are you sure to deactivate this app?";
      if(status== "A"){
        title = "Are you sure to activate this app?";
      }

      alertify.confirm(title,
		 function(){
		     $http({
                  method: 'POST',
                  url: '/api/updateapp',
                  data: {"appid":app._id,"status":status,"createdby":app.CreatedBy},
                  headers: {'Content-Type': 'application/json'},                 
              }).then(function(response) {
                var data = response.data;
                $("#successmsg").html("Application updated successfully.");
                $(".success_msg").show();
                $scope.applications = data;
              
      }, function(response) {
        var data = response.data;
                       $('#regerror').html('<span class="label label-danger">'+data.Error+'</span>');
                          $('.regerror_msg').show();
      });

		 },
		 function(){
		   
		 });

            }

    $scope.showdetail = function(app){
      $("#modal-detail .modal-title").html(app.ApplicationName);
      
      var innerhtml = `
       <div class="box-body form-horizontal">
                <div class="form-group">
                  <label class="col-sm-4 control-label">Application Name :</label>

                  <div class="col-sm-8">
                    <label class="control-label valuelbl">`+ app.ApplicationName +`</label>
                  </div>
                </div>
                <div class="form-group">
                  <label class="col-sm-4 control-label">Application Secret Key :</label>

                  <div class="col-sm-8">
                    <label class="control-label valuelbl">`+ app.AppSecretID +`</label>
                  </div>
                </div>
                 <div class="form-group">
                  <label class="col-sm-4 control-label">Base URL :</label>

                  <div class="col-sm-8">
                    <label class="control-label valuelbl">`+ app.BaseURL +`</label>
                  </div>
                </div>
                 <div class="form-group">
                  <label class="col-sm-4 control-label ">Redirect URL :</label>

                  <div class="col-sm-8">
                    <label class="control-label valuelbl">`+ app.RedirectURL +`</label>
                  </div>
                </div>
              </div>
      `;

      $("#modal-detail .modal-body").html(innerhtml);
    $("#modal-detail").modal("show");
  }

 });