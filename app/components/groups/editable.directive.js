angular
  .module("todo")
  .directive("contenteditable", contenteditable);

function contenteditable() {
  return {
    restrict: "A",
    require: "ngModel",
    link: function (scope, elm, attrs, ctrl) {
      elm.bind("keydown", function () {
        scope.$apply(function () {
          ctrl.$setViewValue(elm[0].innerText);
        });
      });

      ctrl.$render = function () {
        if(ctrl.$viewValue){
        elm[0].innerHTML=ctrl.$viewValue;
        }else{
          elm[0].innerHTML="";
        }
      };

      function formatter(value) {
        if (value) {
          var reg=/\n/g;
          var result=value.replace(reg,"<br>");
          return result;
        }
      }
      ctrl.$formatters.push(formatter);
    }
  };
}
