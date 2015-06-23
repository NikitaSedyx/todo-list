describe("Unit test", function(){

  beforeEach(module('todo'));

  describe("for IdGenerator", function(){

    var IdGenerator;

    beforeEach(inject(function($injector){
      IdGenerator = $injector.get("IdGenerator")
    }))

    it("It should return a max number of id", function(){
      var data = [
        {
          desc:123,
          id:"id1"
        },
        {
          desc:1232,
          id:"id3"
        },
        {
          desc:12,
          id:"id7"
        },
        {
          desc:23,
          id:"id2"
        },
        {
          desc:13,
          id:"id10"
        },
        {
          desc:1234,
          id:"id11"
        }
      ]
      expect(IdGenerator.generateId(data)).toBe(11)
    })

    it("It should return a 0", function(){
      var data = []
      expect(IdGenerator.generateId(data)).toBe(0)
    })
  })

  describe("for TaskFilter", function(){
    var TaskFilter;

    var data = [
        {
          desc:123,
          id:"id1",
          isCompleted : true
        },
        {
          desc:1232,
          id:"id3",
          isCompleted : false
        },
        {
          desc:12,
          id:"id7",
          isCompleted : false
        },
        {
          desc:23,
          id:"id2",
          isCompleted : true
        },
        {
          desc:13,
          id:"id10",
          isCompleted : false
        },
        {
          desc:1234,
          id:"id11",
          isCompleted : true
        }
      ]

    beforeEach(inject(function($injector){
      TaskFilter = $injector.get("TaskFilter")
    }))

    it("It should return all tasks without state", function(){
      expect(TaskFilter.filterTasks(data).length).toBe(data.length)
    })

    it("It should return only completed tasks", function(){
      var completed = [
          {
            desc:123,
            id:"id1",
            isCompleted : true
          },
          {
            desc:23,
            id:"id2",
            isCompleted : true
          },
          {
            desc:1234,
            id:"id11",
            isCompleted : true
          }
        ]    
      expect(TaskFilter.filterTasks(data, "completed")).toEqual(completed)
    })

    it("It should return only completed tasks without state", function(){
      var completed = [
          {
            desc:123,
            id:"id1",
            isCompleted : true
          },
          {
            desc:23,
            id:"id2",
            isCompleted : true
          },
          {
            desc:1234,
            id:"id11",
            isCompleted : true
          }
        ]  
      TaskFilter.filterTasks(data, "completed")  
      expect(TaskFilter.filterTasks(data)).toEqual(completed)
    })

    it("It should return only active tasks", function(){ 
      var active = [
          {
            desc:1232,
            id:"id3",
            isCompleted : false
          },
          {
            desc:12,
            id:"id7",
            isCompleted : false
          },
          {
            desc:13,
            id:"id10",
            isCompleted : false
          }
        ]
      expect(TaskFilter.filterTasks(data, "active")).toEqual(active)
    })

    it("It should return all tasks", function(){
      expect(TaskFilter.filterTasks(data, "all")).toEqual(data)
    })

  })

  describe("for state", function(){
    var $rootScope, $state, $injector;

    beforeEach(inject(function(_$rootScope_, _$state_, _$injector_, $templateCache){
      $rootScope = _$rootScope_;
      $state = _$state_;
      $injector = _$injector_;  
    }))

    it("It should be list page", function() {
      var state = "list"; 
      expect($state.href(state)).toEqual("#/list");
    });

    it("It should be clear edit page", function() {
      var state = "edit"; 
      expect($state.href(state)).toEqual("#/edit/");
    });

    it("It should be edit page for id6", function() {
      var state = "edit"; 
      expect($state.href(state, {id:"id6"})).toEqual("#/edit/id6");
    });

  })

  describe("for TaskController", function(){
    var createTaskController, $rootScope, httpBackend

    beforeEach(inject(function($controller, $injector, $httpBackend){
      httpBackend = $httpBackend
      $rootScope = $injector.get('$rootScope');
      createTaskController = function(){
        return $controller("TaskController", {'$scope' : $rootScope })
      }
      httpBackend.whenGET("/tasks").respond([{id:1}, {id:2}])
    }))

    it("should get tasks", function(){
      httpBackend.expectGET("/tasks")
      var controller = createTaskController();
      httpBackend.flush()
      expect($rootScope.tasks.length).toBe(2)
    })

    it("should add task", function(){
      var controller = createTaskController();
      $rootScope.newTask = "new task"
      httpBackend.expectPOST("/tasks", {description:$rootScope.newTask, id:"id1", deadline:new Date(), isCompleted:false}).respond(200)
      $rootScope.addTask()
      httpBackend.flush()
      expect($rootScope.tasks).toBeDefined()
    })
  })
})