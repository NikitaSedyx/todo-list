;(function(){
  angular
    .module("todo")

    .controller("EditGroupController", EditGroupController)

    EditGroupController.$inject = ["GroupResource", "ItemResource",
      "$scope", "$state", "$stateParams"]

    function EditGroupController(GroupResource, ItemResource, $scope, $state, $stateParams){
      getGroup()

      $scope.newTask = {}

      $scope.addTask = addTask
      $scope.apply = apply
      $scope.deleteGroup = deleteGroup
      $scope.deleteTask = deleteTask
      $scope.updateGroup = updateGroup

      function addTask(){
        $scope.group.items.push($scope.newTask)
        $scope.newTask = {}
        updateGroup()
      }

      function apply(){
        updateGroup()
        $state.go("groups.list")
      }

      function deleteGroup(){
        $scope.group.is_deleted = true
        apply()
      }

      function deleteTask(item){
        ItemResource.deleteItem(item).$promise
        .then(function(response){
          getGroup()
        })
      }

      function getGroup(){
        GroupResource.getGroup({id: $stateParams.id}).$promise
        .then(function(response){
          $scope.group = response
        })    
      }

      function updateGroup(){
        GroupResource.editGroup($scope.group).$promise
        .then(function(response){
          getGroup()
        })   
      }
    }
})()
