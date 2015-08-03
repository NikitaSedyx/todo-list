;(function(){
  angular
    .module("nm-widgets")

    .directive("masonry", function(){
      return{
        restrict: "A",
        link: link,
        controller: "MasonryController"
      }
    })

    function link($scope, element, attrs){
      var container = element[0]
      var options = ""
      return $scope.masonry = new Masonry(container, options)
    }
})()
