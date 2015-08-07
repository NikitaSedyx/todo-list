;(function(){
  angular
    .module("todo")

    .controller("EditGroupController", EditGroupController)

    EditGroupController.$inject = ["API", "groupId", "$scope", "XlsDownloader"]

    function EditGroupController(API, groupId, $scope, XlsDownloader){
      $scope.xlsExport = xlsExport

      function xlsExport(){
        var url = API.BASE + API.EXPORT + "xls/" + groupId + "/"
        XlsDownloader.download(url)
      }
    }
})()
