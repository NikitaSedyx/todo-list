;(function () {
  angular
    .module("todo")

  .controller("AddFilesController", AddFilesController)

  AddFilesController.$inject = ["files", "$modalInstance", "$scope"]

  function AddFilesController(files, $modalInstance, $scope) {
    $scope.filesToUpload = files.slice();
    $scope.addFiles = addFiles;
    $scope.apply = apply;
    $scope.cancel = cancel;
    $scope.$watch("newFiles", addFiles);
    $scope.deleteFile = deleteFile;

    function addFiles() {
      var files = $scope.newFiles;
      if (files) {
        $scope.filesToUpload = $scope.filesToUpload.concat(files)
      }
    }

    function apply() {
      $modalInstance.close($scope.filesToUpload)
    }

    function cancel() {
      $modalInstance.dismiss("cancel")
    }

    function deleteFile(index) {
      $scope.filesToUpload.splice(index, 1);
    }

  }
})()
