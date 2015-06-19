(function(){
  app = angular.module("todo",['ngResource'])

  app.service("TaskService", function($http){

    this.getAllTasks = function(){
      return $http.get("/tasks").then(function(res){
        return _.reduceRight(res.data, function(a, b) { return a.concat(b); }, []);
      })
      
    }

    this.addNewTask = function(newTask){
      return $http.post("/tasks", newTask);
    }

    this.changeTaskState = function(task){
      return $http.put("/tasks", task);
    }

  })

  app.service("TaskResource", function($resource){
    return $resource("/tasks", {}, {
      getAllTasks:{
        method:"GET",
        isArray:true,
        transformResponse: function(data, headers){
          return _.reduceRight(JSON.parse(data), function(a, b) { return a.concat(b); }, []);
        }
      },
      changeTaskState:{
        method:"PUT"        
      }
    });
  })

  app.controller("TaskController",function($scope, TaskResource){

    var allTasks = [];

    var rTask = TaskResource.getAllTasks(function(){
      allTasks = rTask;
      $scope.tasks = allTasks
    })

    var filters = {
      all: function(){return true},
      active: function(task){return !task.isCompleted},
      completed: function(task){return task.isCompleted}
    }

    $scope.filterState = "all";

    $scope.addTask = function(event){
      if(event.keyCode == 13) {
        var length = allTasks.length;
        var newTask = {description:$scope.newTask, isCompleted: false, id:"id"+length};
        TaskResource.save(newTask).$promise.then(function(){
          allTasks= [newTask].concat(allTasks);
          $scope.newTask = "";
          $scope.filter();          
        })

        /*TaskService.addNewTask(newTask).then(function(){
          allTasks= [newTask].concat(allTasks);
          $scope.newTask = "";
          $scope.filter();
        })*/
      }
    }

    $scope.filter = function(state){
      $scope.filterState = state || $scope.filterState;
      $scope.tasks = allTasks.filter(filters[$scope.filterState]);
    }

    $scope.changeState = function(id){
      var task = _.find(allTasks, function(task) { return task.id === id });
      TaskResource.changeTaskState(task).$promise.then(function(){
        task.isCompleted = !task.isCompleted;
        $scope.filter();        
      })
      /*TaskService.changeTaskState(task).then(function(){
        task.isCompleted = !task.isCompleted;
        $scope.filter();
      })*/
    }
  })

})();
