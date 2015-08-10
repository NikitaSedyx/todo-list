;(function(){
  describe("EditGroupController tests", function(){
    var createEditGroupController, scope, httpBackend, 
      API, state, url
    var groupId = 35
    var group = {
        id: groupId,
        is_deleted: false,
        items: [
          {
            id: 1,
            description: "test item"
          }
        ],
        creator: {
          id: 1,
          username: "admin"
        },
        contributros: [
          {
            id: 1,
            username: "admin"        
          }
        ]
      }

    beforeEach(module("todo"))
    beforeEach(module("stateMock"))

    beforeEach(inject(function($rootScope, $controller, 
      $httpBackend, $injector, $state){

      state = $state
      API = $injector.get("API")
      httpBackend = $httpBackend
      groupUrl = API.BASE + API.GROUP + groupId + "/"

      scope = $rootScope.$new()
      createEditGroupController = function(){
        return $controller("EditGroupController", {
          $scope: scope,
          groupId: groupId
        })
      }

      httpBackend.whenGET(groupUrl).respond(group)
      httpBackend.whenPUT(groupUrl, scope.group).respond(200, "OK")
    }))

    it("should get group", function(){
      httpBackend.expectGET(groupUrl)
      var controller = createEditGroupController()
      httpBackend.flush()
      expect(scope.group).toBeDefined()
      expect(scope.group.id).toBe(35)
    })

    it("should update group", function(){
      var controller = createEditGroupController()
      httpBackend.flush()
      httpBackend.expectPUT(groupUrl, scope.group)
      scope.group.items[0].description = "put test"
      scope.updateGroup()
      group = scope.group
      httpBackend.flush()
      expect(group.items[0].description).toBe("put test")
    })

    it("should delete group", function(){
      state.expectTransitionTo("groups.list")
      var controller = createEditGroupController()
      httpBackend.flush()
      scope.deleteGroup()
      group = scope.group
      httpBackend.flush()
      expect(group.is_deleted).toBe(true)
    })

    it("should create new task", function(){
      var controller = createEditGroupController()
      scope.newTask = {
        description: "create item test"
      }
      httpBackend.flush()
      httpBackend.expectPUT(groupUrl, scope.group)
      expect(scope.group.items.length).toBe(1)
      scope.addTask()
      group = scope.group
      httpBackend.flush()
      expect(group.items.length).toBe(2)
      expect(group.items[1]).toEqual({
        description: "create item test"
      })
    })
  })
})()
