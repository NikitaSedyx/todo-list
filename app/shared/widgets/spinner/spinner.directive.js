;(function(){
  angular
    .module("nm-widgets")

    .directive("nmSpinner", function(){
      return {
        restrict: "E",
        templateUrl: "app/views/shared/widgets/spinner/spinner.html",
        scope: {
          isEnable: "=enable"
        }
      }
    })
})()
