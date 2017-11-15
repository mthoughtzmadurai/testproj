'use strict';

/** 
 * @ngdoc function
 * @name confirmoApp.controller:IndexCtrl
 * @description
 * # IndexCtrl
 * Controller of the confirmoApp
 */
angular.module('confirmoApp')
  .controller('DashboardCtrl', function ($scope, $http,$location,$rootScope,$window) {
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

   if($rootScope.username == "" || $rootScope.uid == "" || access_token == ""){
      $location.path("/index");
    }
    


    $rootScope.logout = function (){
       
        $window.localStorage.setItem("AuthToken","");
        $window.localStorage.setItem("UID","");
        $window.localStorage.setItem("UName","");
        $rootScope.uid = $window.localStorage.getItem("UID") ? CryptoJS.AES.decrypt($window.localStorage.getItem("UID"),AppKey).toString(CryptoJS.enc.Utf8) : "";
    $rootScope.username = $window.localStorage.getItem("UName") ? CryptoJS.AES.decrypt($window.localStorage.getItem("UName"),AppKey).toString(CryptoJS.enc.Utf8) : "";
 if($rootScope.username == "" || $rootScope.uid == ""){
      $location.path("/index");
    }
    }

    $(function(){
      $('[data-toggle=dropdown]').dropdown();
    })
  }
  );