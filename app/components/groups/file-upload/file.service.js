;(function(){
  angular
    .module("todo")
    .service("FileService", FileService);

  FileService.$inject=["Upload", "API", "$http"];

  function FileService(Upload, API, $http) {
    var self = this;
    self.upload = upload;
    self.deleteFile = deleteFile;
    function upload(files, group) {
      return Upload.upload({
        url: API.BASE + API.FILE +API.UPLOAD,
        file: files,
        fields: {'group': group.id}
      });
    }

    function deleteFile(file) {
      return $http.delete(file.resource_uri);
    }
  }
})()
