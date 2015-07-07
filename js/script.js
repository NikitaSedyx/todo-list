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
      /*if (!user){
        $http.get(API.BASE + API.AUTH + "info/")
        .then(function(response){
          if (response.data !== "AnonymousUser"){
            user = response.data
            return user
          }
        })
      } 
      return user */
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

  app.service("PageService", function(TaskResource){

    var limit = 10, totalCount, currentPage = 0, orderBy, filterBy

    this.getLimit = function(){
      return limit
    }

    this.setLimit = function(initLimit){
      limit = initLimit
    }

    this.getTotalCount = function(){
      return totalCount
    }

    this.setTotalCount = function(initTotalCount){
      totalCount = initTotalCount
    }

    this.incrementTotalCount = function(){
      totalCount++
    }

    this.decrementTotalCount = function(){
      totalCount--
      if ((currentPage+1) > Math.ceil(totalCount/limit)){
        currentPage--
      }
    }

    this.getCurrentPage = function(){
      return current_page
    }

    this.setCurrentPage = function(initCurrentPage){
      currentPage = initCurrentPage
    }

    this.getPages = function(){
      return _.range(Math.ceil(totalCount/limit))
    }

    var getOffset = function(){
      return currentPage*limit
    }

    this.setOrdering = function(initOrderBy){
      orderBy = initOrderBy
    }

    this.setFilterBy = function(initFilterBy){
      filterBy = initFilterBy
    }

    this.getPartitionTasks = function(){
      var params = {offset:getOffset()}
      if (orderBy){
        params.order_by = orderBy
      }
      if (filterBy){
        params.description__contains = filterBy
      }
      return TaskResource.getAllTasks(params).$promise
    }

  })

  app.controller("TaskController",function($scope, TaskResource, TaskFilter, TaskStorage, PageService){

    PageService.getPartitionTasks().then(function(res){
      TaskStorage.setTasks(res.objects)
      PageService.setTotalCount(res.meta.total_count)
      $scope.pages = PageService.getPages()
      $scope.filter()
    })

    $scope.addTask = function(){
      var newTask = {
        description:$scope.newTask
      };
      TaskResource.createTask(newTask).$promise
      .then(function(){
        PageService.incrementTotalCount()
        $scope.pages = PageService.getPages()
        PageService.getPartitionTasks().then(function(res){
          TaskStorage.setTasks(res.objects) 
          $scope.newTask = "";
          $scope.filter();      
        })
      })
    }

    $scope.filter = function(state){
      $scope.tasks = TaskFilter.filterTasks(TaskStorage.getTasks(), state)
    }

    var getPartitionTasks = function(){
      PageService.getPartitionTasks().then(function(res){
        TaskStorage.setTasks(res.objects)
        $scope.filter();       
      })     
    }

    $scope.changePage = function(page){
      PageService.setCurrentPage(page)
      getPartitionTasks()
    }

    $scope.sortTasks = function(orderBy){
      PageService.setOrdering(orderBy)
      getPartitionTasks()
    }

    $scope.filterTasks = function(){
      PageService.setFilterBy($scope.filterBy)
      PageService.getPartitionTasks().then(function(res){
        TaskStorage.setTasks(res.objects)
        PageService.setTotalCount(res.meta.total_count)
        $scope.pages = PageService.getPages()
        $scope.filter();       
      }) 
    }

  })

  app.controller("EditTaskController", function($scope, $state, $stateParams, TaskResource, PageService){

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
        PageService.decrementTotalCount()
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

    /*$scope.$watch(function(){return SessionUser.getUser()}, function(n, o){
      $scope.username = n
    })*/

    $scope.logout = function(){
      $http.get(API.BASE + API.AUTH + "logout/")
      .then(function(){
        SessionUser.setUser(null)
        $state.go("login")
      })
    }
  })

})();
