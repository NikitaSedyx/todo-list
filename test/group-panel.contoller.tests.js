;(function(){
  describe("GroupPanelController tests", function(){
    var createGroupPanelController, scope

    beforeEach(module("todo"))

    beforeEach(inject(function($rootScope, $controller){
      scope = $rootScope.$new()
      scope.params = {
        offset: 0
      }
      scope.groups = {
        data: []
      }
      createGroupPanelController = function(){
        return $controller("GroupPanelController", {
          $scope: scope
        })
      }
    }))

    it("should set limit to 50", function(){
      var controller = createGroupPanelController()
      expect(scope.params.limit).toBe(50)
    })

    it("should set offset to 50, next 70", function(){
      var controller = createGroupPanelController()
      scope.groups.data.length = 50
      scope.loadData()
      expect(scope.params.offset).toBe(50)
      scope.groups.data.length = 70
      scope.loadData()
      expect(scope.params.offset).toBe(70)
    })
  })
})()
