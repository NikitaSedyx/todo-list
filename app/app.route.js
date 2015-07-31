angular.module('todo').config(routeConf);

function routeConf($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'components/login/login.html',
      controller: 'LoginController'
    })
    .state('register', {
      url: "/register",
      templateUrl: 'components/register/register.html',
      controller: 'RegisterController'
    })
    .state('mytasks', {
      url: '/mytasks',
      templateUrl: 'views/main.html',
      controller: 'TasksController'
    });
}
