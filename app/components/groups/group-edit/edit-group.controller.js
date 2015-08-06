;(function(){
  angular
    .module("todo")

    .controller("EditGroupController", EditGroupController)

    EditGroupController.$inject = ["GroupResource", "$modal", "$scope",
      "$state", "$stateParams"]

    function EditGroupController(GroupResource, $modal, $scope, $state, $stateParams){
      getGroup()

      $scope.editContributors = editContributors

      function editContributors(){
        var contributorsModal = $modal.open({
          templateUrl: "app/views/components/groups/group-edit/edit-contributors.html",
          controller: "EditContributorsController",
          resolve: {
            contributors: function(){
              return $scope.group.users
            }
          }
        })
        contributorsModal.result
        .then(function(contributors){
          $scope.group.users = contributors
          updateGroup()
        })
      }

      function getGroup(){
        GroupResource.getGroup({id: $stateParams.id}).$promise
        .then(function(response){
          $scope.group = response
        })    
      }
    }
})()
