;(function(){
  angular
    .module("todo")

    .controller("EditGroupController", EditGroupController)

    EditGroupController.$inject = ["groupId", "GroupResource", "$modal", "$scope",
      "$state"]

    function EditGroupController(groupId, GroupResource, $modal, $scope, $state){
      getGroup()

      $scope.editContributors = editContributors

      function editContributors(){
        var contributorsModal = $modal.open({
          templateUrl: "app/views/components/groups/edit-contributors/edit-contributors.html",
          controller: "EditContributorsController",
          windowClass: "edit-contributors-modal",
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
        GroupResource.getGroup({id: groupId}).$promise
        .then(function(response){
          $scope.group = response
        })    
      }
    }
})()
