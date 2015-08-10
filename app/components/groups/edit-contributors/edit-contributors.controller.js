;(function(){
  angular
    .module("todo")

    .controller("EditContributorsController", EditContributorsController)

    EditContributorsController.$inject = ["contributors",
      "$modalInstance", "$scope", "UserResource"]

    function EditContributorsController(contributors, $modalInstance, $scope, UserResource){
      $scope.contributors = contributors.slice()

      $scope.addContributor = addContributor
      $scope.apply = apply
      $scope.cancel = cancel
      $scope.deleteContributor = deleteContributor
      $scope.findUsers = findUsers

      function addContributor(contributor){
        if (!_.find($scope.contributors, {id: contributor.id})){
          $scope.contributors.push(contributor)
        }
      }

      function apply(){
        $modalInstance.close($scope.contributors)
      }

      function cancel(){
        $modalInstance.dismiss("cancel")
      }

      function deleteContributor(index){
        $scope.contributors.splice(index, 1)
      }

      function findUsers(){
        var params = {
          limit: 0,
          username__icontains: $scope.username
        }
        UserResource.getUsers(params).$promise
        .then(function(response){
          $scope.users = response.objects
        })
      }
    }
})()
