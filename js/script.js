;(function(){
  app = angular.module("todo", ['ngResource', 'ui.router', 'ui.bootstrap', 'ui.validate'])

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
        url: "/edit/:id",
        templateUrl: "../edit-task.html"
      })
      .state("login", {
        url: "/login",
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

  app.service("SessionUser", function($http, $q, API){

    var user = null;

    this.getUser = function(){
      if (user) {
        return $q.when(user)
      }
      return $http.get(API.BASE + API.AUTH + "info/")
      .then(function(response){
          if (response.data !== "AnonymousUser"){
            user = response.data
          }
          return user
      })
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

  app.controller("TaskController",function($scope, TaskResource, TaskFilter, TaskStorage){

    $scope.pageConfig = new PageConfig()

    $scope.$watch('pageConfig.currentPage', function(){
      var params = getParams()
      TaskResource.getAllTasks(params).$promise.then(function(res){
        processGettingTasks(res.objects, res.meta.total_count)
      })
    })

    $scope.$watch('pageConfig.limit', function(){
      var params = getParams()
      TaskResource.getAllTasks(params).$promise.then(function(res){
        processGettingTasks(res.objects, res.meta.total_count)
      })      
    })

    $scope.addTask = function(){
      var newTask = {
        description:$scope.newTask
      };
      TaskResource.createTask(newTask).$promise.then(function(){
        var params = getParams()
        TaskResource.getAllTasks(params).$promise.then(function(res){
          processGettingTasks(res.objects, res.meta.total_count)
          $scope.newTask = "";
        })
      })
    }

    $scope.filter = function(state){
      $scope.tasks = TaskFilter.filterTasks(TaskStorage.getTasks(), state)
    }

    var processGettingTasks = function(tasks, countItems){
      TaskStorage.setTasks(tasks) 
      $scope.pageConfig.countItems = countItems
      $scope.filter(); 
    }

    var getParams = function(){
      var page = $scope.pageConfig.currentPage
      var offset = page * $scope.pageConfig.limit
      return {
        offset: offset,
        limit: $scope.pageConfig.limit
      }
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
      TaskResource.remove({id: $stateParams.id}).$promise
      .then(function(){
        $state.go("list")
      })
    }

  })

  app.controller("LoginController", function($scope, $http, $state, API, SessionUser){

    SessionUser.getUser().then(function(user){
      if (user){
        $state.go("list")
      }
    })

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
    
    SessionUser.getUser().then(function(user){
      $scope.username = user
    })

    $scope.logout = function(){
      $http.get(API.BASE + API.AUTH + "logout/")
      .then(function(){
        SessionUser.setUser(null)
        $state.go("login")
      })
    }
  })

  //pagination
  app.directive("paginator", function(){
    return {
      restrict: "E",
      templateUrl:"../paginator.html",
      scope: {
        pageConfig: "="
      },
      controller: function($scope){

        $scope.$watch("pageConfig.countItems", function(){
          $scope.pages = _.range($scope.pageConfig.countPages())
        })

        $scope.changePage = function(page){
          $scope.pageConfig.currentPage = page
        }

        $scope.nextPage = function(){
          $scope.pageConfig.next()
        }

        $scope.prevPage = function(){
          $scope.pageConfig.prev()
        }

        $scope.isActive = function(page){
          return $scope.pageConfig.currentPage == page
        }

        $scope.changeLimit = function(limit){
          $scope.pageConfig.limit = limit
          $scope.pages = _.range($scope.pageConfig.countPages())
          $scope.pageConfig.currentPage = 0
        }

      }
    }
  })

  var PageConfig = (function(){

    var PageConfig = function (){
      var countPages = 0
      this.currentPage = 0
      this.countItems = 0
      this.limit = 10
    }

    PageConfig.prototype.countPages = function(){
      countPages = Math.ceil(this.countItems/this.limit)
      return countPages
    }

    PageConfig.prototype.hasNext = function(){
      return this.currentPage < countPages-1
    }

    PageConfig.prototype.next = function(){
      if (this.hasNext()){
        this.currentPage++
      } else{
        this.currentPage = 0
      }
      return this.currentPage
    }

    PageConfig.prototype.hasPrev = function(){
      return this.currentPage > 0
    }

    PageConfig.prototype.prev = function(){
      if (this.hasPrev()){
        this.currentPage--
      } else{
        this.currentPage = countPages-1
      }
    }

    return PageConfig
  })()

  //registration
  app.controller("RegistrationController", function($scope, $state, $http, API){

    $scope.register = function(){
      $http.post(API.BASE + API.REGISTRATION, $scope.user)
      .then(function(response){
        if (response.status == 200){
          $scope.user = null
          $state.go("login")
        }
      })
    }

  })

})();
