;(function(){
  angular
    .module("downloaders")

    .factory("XlsDownloader", XlsDownloader)

    XlsDownloader.$inject = ["$http", "$window"]

    function XlsDownloader($http, $window){
      function download(url){
        $http({
          url: url,
          method: "GET",
          responseType: "arraybuffer"
        }).then(function(response){
          var type = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          var blob = new Blob([response.data], {type: type})
          var objectUrl = URL.createObjectURL(blob)
          $window.open(objectUrl)
        })
      }
      return {
        download: download
      }
    }
})()
