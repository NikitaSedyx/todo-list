angular
  .module('todo')
  .config(routeConf);

function routeConf($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');
  $stateProvider
    .state('login', {
      url: '/login',
      templateUrl: 'app/views/components/login/login.html',
      controller: 'LoginController'
    })
    .state('register', {
      url: '/register',
      templateUrl: 'app/views/components/register/register.html',
      controller: 'RegisterController'
    })
    .state('mytasks', {
      url: '/mytasks',
      templateUrl: 'app/views/components/groups/groups.html',
      controller: 'GroupsController'
    });
}
