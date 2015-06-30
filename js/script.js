;(function(){
  app = angular.module("todo",['ngResource', 'ui.router'])

  app.config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
  }]);

  app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/list")

    $stateProvider
      .state('list', {
        url: '/list',
        templateUrl: '../task-list.html'
      })
      .state('edit', {
        url:"/edit/:id",
        templateUrl: '../edit-task.html'
      })
  });

  app.service("TaskResource", function($resource){
    return $resource("/api/v1/item/:id/", {id:"@id"}, {
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

  app.service("TaskStorage", function(TaskResource){
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

    TaskResource.getAllTasks().$promise.then(function(res){
      TaskStorage.setTasks(res.objects)
      $scope.tasks = TaskStorage.getTasks()
    })

    $scope.addTask = function(){
      var newTask = {
        description:$scope.newTask, 
        user: "/api/v1/user/1/"
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

})();