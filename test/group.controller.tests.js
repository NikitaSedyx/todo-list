;(function(){
  describe("GroupController tests", function(){
    var createGroupController, scope, GroupStorage
    var data = [
      {
        id: 1,
        title: "first"
      },
      {
        id: 2,
        title: "second"
      }
    ]
    beforeEach(module("todo"))

    beforeEach(inject(function($rootScope, $controller, $injector){
      GroupStorage = $injector.get("GroupStorage")
      scope = $rootScope.$new()
      createGroupController = function(){
        return $controller("GroupController", {
          $scope: scope
        })
      }
    }))

    it("groups should be defined", function(){
      var controller = createGroupController()
      expect(scope.groups).toBeDefined()
    })

    it("groups should be changed", function(){
      var controller = createGroupController()
      GroupStorage.groups.data = data
      GroupStorage.groups.totalItems = data.length
      expect(scope.groups.data.length).toBe(2)
      expect(scope.groups.totalItems).toBe(GroupStorage.groups.totalItems)
    })

    it("params should be 0", function(){
      var controller = createGroupController()
      expect(scope.params.offset).toBe(0)
    })

    it("should delete groups", function(){
      var controller = createGroupController()
      GroupStorage.groups.data = data
      GroupStorage.groups.totalItems = data.length
      scope.changeGroupView()
      expect(scope.groups.data.length).toBe(0)
    })

    it("should change offset to 0", function(){
      var controller = createGroupController()
      scope.params.offset = 10
      scope.changeGroupView()
      expect(scope.params.offset).toBe(0)
    })
  })
})()
