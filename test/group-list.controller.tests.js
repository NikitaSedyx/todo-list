;(function(){
  describe("GroupListController tests", function(){
    var createGroupListController, scope

    beforeEach(module("todo"))

    beforeEach(inject(function($rootScope, $controller){
      scope = $rootScope.$new()
      scope.params = {
        offset: 0
      }
      createGroupListController = function(){
        return $controller("GroupListController", {
          $scope: scope
        })
      }
    }))

    it("should set limit to 10", function(){
      var controller = createGroupListController()
      expect(scope.params.limit).toBe(10)
    })

    it("offset should be 10 when page is 2", function(){
      var controller = createGroupListController()
      scope.paginatorConfig.currentPage = 2
      scope.paginatorConfig.changePage()
      expect(scope.params.offset).toBe(10)
    })

    it("offset should be 0, next 20, 30 and 20", function(){
      var controller = createGroupListController()
      expect(scope.params.offset).toBe(0)
      scope.paginatorConfig.currentPage = 3
      scope.paginatorConfig.changePage()
      expect(scope.params.offset).toBe(20)
      scope.paginatorConfig.currentPage++
      scope.paginatorConfig.changePage()
      expect(scope.params.offset).toBe(30)
      scope.paginatorConfig.currentPage--
      scope.paginatorConfig.changePage()
      expect(scope.params.offset).toBe(20)
    })
  })
})()
