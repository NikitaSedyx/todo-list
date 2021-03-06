;(function(){
  app = angular.module("todo", ['ngResource', 'ui.router', 'ui.bootstrap', 
    'ui.validate', 'ui.grid', 'ui.grid.pagination', 'cu-grid', 'high-chart',
    'cu-tree'])

  app.config(['$resourceProvider', function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
  }]);

  app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/tasks")

    $stateProvider
      .state("tasks", {
        abstract:true,
        templateUrl: "../tasks.html",
        controller: function($scope, SessionUser){

          SessionUser.getUser().then(function(user){
            $scope.taskView = user.taskView
          })

          $scope.changeView = function(view){
            SessionUser.getUser().then(function(user){
              user.taskView = view
            })
          }

        }
      })
      .state("tasks.list", {
        url: "/tasks",
        views: {
          "list": {
            //templateUrl: "../task-list.html"
            templateUrl: "../task-cu-grid.html"
          },
          "table": {
            templateUrl: "../task-grid.html"
          }
        }
      })
      .state("stats", {
        url: "/stats",
        templateUrl: "../task-chart.html"
      })
      .state("tree", {
        url: "/tree",
        templateUrl: "../tree.html"
      })
      .state("edit", {
        url: "/edit/:id",
        templateUrl: "../edit-task.html"
      })
      .state("login", {
        url: "/login",
        templateUrl: "../login.html"
      })
      .state("registration", {
        url: "/registration",
        templateUrl: "../registration.html"
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
    AUTH:"/auth/",
    REGISTRATION:"/registration/"
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
          if (response.status == 200){
            user = response.data
            user.taskView = 'list'
          }
          return user
      })
    }

    this.setUser = function(initUser){
      user = initUser
      if (user){
        user.taskView = 'list'
      }
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
      $state.go("tasks.list")
    }

    $scope.deleteTask = function(){
      TaskResource.remove({id: $stateParams.id}).$promise
      .then(function(){
        $state.go("tasks.list")
      })
    }

  })

  app.controller("LoginController", function($scope, $http, $state, API, SessionUser){

    SessionUser.getUser().then(function(user){
      if (user){
        $state.go("tasks.list")
      }
    })

    $scope.login = function(){
      $http.post(API.BASE + API.AUTH + "login/", {
        username:$scope.username, 
        password:$scope.password
      })
      .then(function(response){
        if (response.status == 200) {
          SessionUser.setUser(response.data)
          $state.go("tasks.list")
        }
        $scope.password = null
      })   
    }

  })

  app.controller("LogoutController", function($scope, $http, $state, API, SessionUser){
    
    SessionUser.getUser().then(function(user){
      $scope.username = user.username
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

  //grid
  app.controller("TaskGridController", function($scope, TaskResource, uiGridConstants){

    TaskResource.getAllTasks({limit: 0}).$promise.then(function(res){
      $scope.gridOptions.data = res.objects
    })

    $scope.gridOptions = {
      enableSorting: true,
      enableFiltering: true,
      showColumnFooter: true,
      paginationPageSizes: [5, 10, 20],
      paginationPageSize: 10,
      columnDefs: [
        {
          field: "description",
          aggregationType: uiGridConstants.aggregationTypes.count,
          cellTooltip: true
        },
        {
          field: "is_completed",
          aggregationType: uiGridConstants.aggregationTypes.sum,
          enableSorting: false,
          filter: {
            type: uiGridConstants.filter.SELECT,
            selectOptions: [
              {
                value: true,
                label: "completed"
              },
              {
                value: false,
                label: "active"
              }
            ]
          }
        },
        {
          field: "created_at",
          cellFilter: "date: 'yyyy-MM-dd HH:mm'",
          enableFiltering: false
        },
        {
          field: "deadline",
          cellFilter: "date: 'yyyy-MM-dd HH:mm'"
        }
      ],
      onRegisterApi: function(gridApi) {
        $scope.gridaApi = gridApi
      }
    }
  })

  //controller for grid config
  app.controller("TaskCuGridController", function($scope, TaskResource, cuGridConstants){

    $scope.gridConfig = {
      gridName: "Tasks",
      paginationConfig:{
        enablePagination: true,
        totalItems: $scope.totalItems,
        changePage: changePage,
      },
      sortingConfig:{
        enableSorting:true,
        changeOrder: changeOrder
      },
      filteringConfig: {
        enableFiltering: true,
        addFilter: addFilter,
      },
      columns: [
        {
          name: "description",
          field: "description",
          enableSorting: false,
          filter:{
            enableFiltering: true,
            type: cuGridConstants.ICONTAINS
          }
        },
        {
          name: "Is completed",
          field: "is_completed",
          filter: {
            enableFiltering: false
          }
        },
        {
          field: "deadline",
          filter: {
            enableFiltering: false
          }
        }
      ],
      data: $scope.tasks
    }

    var queryParams = {
      limit: 10,
      offset: 0,
      order_by: null
    }

    loadData()

    function changePage(page){
      queryParams.offset = (page - 1) * queryParams.limit
      loadData()
    }

    function changeOrder(orderBy){
      queryParams.order_by = orderBy
      loadData()
    }

    function addFilter(filter){
      queryParams[filter.key] = filter.value
      loadData()
    }

    function loadData(){
      TaskResource.getAllTasks(queryParams).$promise.then(function(response){
        bindData(response)
      })
    }

    function bindData(response){
      $scope.gridConfig.data = response.objects
      $scope.gridConfig.paginationConfig.totalItems = response.meta.total_count
    }
  })

  //controller for chart
  app.controller("ChartController", function($scope, TaskResource, API){

    $scope.config = {
      chart: {
        renderTo: "task-chart",
        backgroundColor: "#d3dee3",
        spacingTop: 50
      },
      title: {
        text: "Tasks"
      },
      credits: {
        enabled: false
      },
      plotOptions: {
        line:{
          cursor: "pointer",
          lineWidth: 3
        }
      },
      yAxis: {
        title: {
          text: "Tasks"
        },
        gridLineColor: "#bfbfbf"
      },
      xAxis: {
        type: "datetime",
        startOnTick: true,
        dateTimeLabelFormats: {
          day: "%b %e"
        },
        tickPositioner: function() {
          if (!this.dataMax || !this.dataMin){
            return []
          }
          var positions = []
          var tick = this.dataMin
          if (this.dataMax == this.dataMin){
            return [tick]
          }
          /*the first tick is equal min date 
            each next tick is equal prev + increment (max - min)/(n-1)
            the last is equal or greater than max date
          */
          var increment = Math.ceil((this.dataMax - this.dataMin) / 4)
          for (tick; tick - increment <= this.dataMax; tick += increment) {
            positions.push(tick);
          }
          positions.info = {
            unitName: "day",
            higherRanks: {} 
          }  
          return positions
        }
      },
      series: []
    }

    TaskResource.getAllTasks({deadline__gt:"2015-07-01", limit:0}).$promise
    .then(function(response){
      var data = _.map(response.objects, function(item){
        var date = new Date(item.deadline)
        date = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2)
        return new Date(date).getTime()
      })
      data = _.groupBy(data, function(date){
        return date
      })
      data = _.sortBy(data, function(value, key){
        return key
      })
      data = _.map(data, function(value){
        return [value[0], value.length]
      })
      $scope.config.series[0] = {
        name: "tasks",
        data: data
      }
    })
  })

  app.controller("TreeController", function($scope, $http, $httpBackend, API){

    $http.get("../data.json")
    .then(function(response){
      $scope.treeConfig.data = response.data
    })

    $scope.treeConfig = {
      field: "size"
    }

  })
})();
