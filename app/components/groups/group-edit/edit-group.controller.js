;(function(){
  angular
    .module("todo")

    .controller("EditGroupController", EditGroupController)

    EditGroupController.$inject = ["API", "groupId", "GroupResource", 
      "ItemResource", "$modal", "$scope", "$state", "XlsDownloader"]

    function EditGroupController(API, groupId, GroupResource, 
      ItemResource, $modal, $scope, $state, XlsDownloader){
      getGroup()

      $scope.newTask = {}
      $scope.addTask = addTask
      $scope.apply = apply
      $scope.deleteGroup = deleteGroup
      $scope.deleteTask = deleteTask
      $scope.editContributors = editContributors
      $scope.updateGroup = updateGroup
      $scope.xlsExport = xlsExport

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

      function updateGroup(){
        GroupResource.editGroup($scope.group).$promise
        .then(function(response){
          getGroup()
        })
      }

      function xlsExport(){
        var url = API.BASE + API.EXPORT + "xls/" + groupId + "/"
        XlsDownloader.download(url)
      }
    }
})()
