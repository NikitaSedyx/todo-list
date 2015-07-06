;(function(){
  app = angular.module("todo", ['ngResource', 'ui.router'])

  app.config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
  }]);

  app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/list")

    $stateProvider
      .state("list", {
        url: "/list",
        templateUrl: "../task-list.html"
      })
      .state("edit", {
        url:"/edit/:id",
        templateUrl: "../edit-task.html"
      })
      .state("login", {
        url:"/login",
        templateUrl: "../login.html"
      })
  });

  app.config(function ($httpProvider, $injector) {
    $httpProvider.interceptors.push(function($q, $injector){
      return {
        responseError:function(rejection){
          if (rejection.status !== 401) {
            return rejection;
          }
          var state = $injector.get("$state")
          state.go("login")
          return $q.reject(rejection);
        }
      }
    })

    $httpProvider.defaults.xsrfCookieName = 'csrftoken'
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken'
  })

  app.constant("API", {
    BASE:"/api/v1",
    ITEM:"/item/",
    AUTH:"/auth/"
  })

  app.service("TaskResource", function($resource, API){
    return $resource(API.BASE + API.ITEM + ":id/", {id:"@id"}, {
      getAllTasks:{
        method:"GET",
        params: {id:null}
      },
      createTask:{
        method: "POST"
      },
      getTask:{
        method:"GET"
      },
      editTask:{
        method:"PUT"        
      }
    });
  })

  app.service("TaskStorage", function(){
    var tasks = []

    this.setTasks = function(initTasks){
      tasks = initTasks
    }

    this.getTasks = function(){
      return tasks
    }

    this.addTask = function(task){
      tasks.push(task)
    }
  })

  app.service("SessionUser", function($http, API){

    var user = null;

    this.getUser = function(){
      if (!user){
        $http.get(API.BASE + API.AUTH + "info/")
        .then(function(response){
          if (response.data !== "AnonymousUser"){
            user = response.data
          }
        })
      } 
      return user 
    }

    this.setUser = function(initUser){
      user = initUser
    }

  })

  app.service("TaskFilter", function(){
    var filterState = "all";

    var filters = {
      all: function(){return true},
      active: function(task){return !task.is_completed},
      completed: function(task){return task.is_completed}
    }

    this.filterTasks = function(tasks, state){
      filterState = state || filterState;
      return tasks.filter(filters[filterState]);
    }

  })

  app.controller("TaskController",function($scope, TaskResource, TaskFilter, TaskStorage, SessionUser){

    TaskResource.getAllTasks().$promise.then(function(res){
      TaskStorage.setTasks(res.objects)
      $scope.tasks = TaskStorage.getTasks()
    })

    $scope.addTask = function(){
      var newTask = {
        description:$scope.newTask
      };
      TaskResource.createTask(newTask).$promise.then(function(){
        TaskStorage.addTask(newTask)
        $scope.newTask = "";
        $scope.filter();  
      })
    }

    $scope.filter = function(state){
      $scope.tasks = TaskFilter.filterTasks(TaskStorage.getTasks(), state)
    }

  })

  app.controller("EditTaskController", function($scope, $state, $stateParams, TaskResource){

    var task = TaskResource.getTask({id: $stateParams.id}, function(){
      $scope.task = task
      $scope.task.deadline = new Date($scope.task.deadline);
    })

    $scope.saveEditing = function(){
      TaskResource.editTask($scope.task)
      $state.go("list")
    }

    $scope.deleteTask = function(){
      TaskResource.remove({id: $stateParams.id})
      $state.go("list")
    }

  })

  app.controller("LoginController", function($scope, $http, $state, API, SessionUser){

    if (SessionUser.getUser()){
      $state.go("list")
    }

    $scope.login = function(){
      $http.post(API.BASE + API.AUTH + "login/", {
        username:$scope.username, 
        password:$scope.password
      })
      .then(function(response){
        SessionUser.setUser(response.data)
        $state.go("list")
      })
      .catch(function(){
        $scope.username = ""
        $scope.password = ""
      })
    }

  })

  app.controller("LogoutController", function($scope, $http, $state, API, SessionUser){

    $scope.username = SessionUser.getUser();

    $scope.$watch(function(){return SessionUser.getUser()}, function(n, o){
      $scope.username = n
    })

    $scope.logout = function(){
      $http.get(API.BASE + API.AUTH + "logout/")
      .then(function(){
        SessionUser.setUser(null)
        $state.go("login")
      })
    }
  })

})();
