'use strict';

/**
 * @ngdoc overview
 * @name confirmoApp
 * @description
 * # confirmoApp
 *
 * Main module of the application.
 */
angular
  .module('confirmoApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngStorage'
  ])
  .config(function ($routeProvider,$locationProvider) {
    $routeProvider
      .when('/', {
         redirectTo: '/index'
      })
      .when('/index', {
        templateUrl: 'views/index/index.html',
        controller: 'IndexCtrl',
        controllerAs: 'Index'
      })
      .when('/signup', {
        templateUrl: 'views/signup/signup.html',
        controller: 'SignupCtrl',
        controllerAs: 'Index'
      })
      .when('/dashboard', {
        templateUrl: 'views/dashboard/dashboard.html',
        controller: 'DashboardCtrl',
        controllerAs: 'Dashboard'
      })
      .when('/applications', {
        templateUrl: 'views/applications/applications.html',
        controller: 'ApplicationCtrl',
        controllerAs: 'Application'
      })
      .otherwise({
        redirectTo: '/'
      });

        // use the HTML5 History API
        // $locationProvider.html5Mode(true);
  });
