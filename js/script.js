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

  app.factory("IdGenerator", function(){
    var generateId = function(tasks){
      var ids = _.map(tasks, function(task){
        return +task.id.slice(2,task.id.length)
      })
      var maxId = _.max(ids)
      if (maxId === -Infinity) maxId = 0
      return maxId
    }

    return {
      generateId : generateId
    }
  })

  app.controller("TaskController",function($scope, TaskResource, TaskFilter, IdGenerator){

    var allTasks = [];

    var rTask = TaskResource.getAllTasks(function(){
      allTasks = rTask;
      $scope.tasks = allTasks
    })

    $scope.addTask = function(){
      var newTask = {
        description:$scope.newTask, 
        deadline: new Date(), 
        isCompleted: false, 
        id:"id"+ (IdGenerator.generateId(allTasks) + 1)
      };
      TaskResource.createTask(newTask).$promise.then(function(){
        allTasks.push(newTask)
        $scope.newTask = "";
        $scope.filter();      
      })
    }

    $scope.filter = function(state){
      $scope.tasks = TaskFilter.filterTasks(allTasks, state)
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
