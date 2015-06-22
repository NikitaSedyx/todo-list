;(function(){
  app = angular.module("todo",['ngResource', 'ui.router'])

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
    return $resource("/tasks/:id", {id:"@id"}, {
      getAllTasks:{
        method:"GET",
        isArray:true,
        params: {id:null}
      },
      createTask:{
        method: "POST",
        params: {id:null}
      },
      getTask:{
        method:"GET"
      },
      editTask:{
        method:"PUT"        
      }
    });
  })

  app.service("TaskFilter", function(){
    var filterState = "all";

    var filters = {
      all: function(){return true},
      active: function(task){return !task.isCompleted},
      completed: function(task){return task.isCompleted}
    }

    this.filterTasks = function(tasks, state){
      filterState = state || filterState;
      return tasks.filter(filters[filterState]);
    }

  })

  app.controller("TaskController",function($scope, $state, TaskResource, TaskFilter){

    var allTasks = [];

    var rTask = TaskResource.getAllTasks(function(){
      allTasks = rTask;
      $scope.tasks = allTasks
    })

    $scope.addTask = function(){
      var length = allTasks.length;
      var newTask = {description:$scope.newTask, deadline: new Date(), isCompleted: false, id:"id"+length};
      TaskResource.createTask(newTask).$promise.then(function(){
        allTasks.push(newTask)
        $scope.newTask = "";
        $scope.filter();          
      })
    }

    $scope.filter = function(state){
      $scope.tasks = TaskFilter.filterTasks(allTasks, state)
    }

    $scope.edit = function(task){
      $state.go("edit", {task:task})
    }

  })

  app.controller("EditTaskController", function($scope, $state, $stateParams, TaskResource){

    console.log($stateParams.id)

    var task = TaskResource.getTask({id: $stateParams.id}, function(){
      $scope.task = task
      $scope.task.deadline = new Date($scope.task.deadline);
    })

    $scope.saveEditing = function(){
      TaskResource.editTask($scope.task)
    }

  })

})();
