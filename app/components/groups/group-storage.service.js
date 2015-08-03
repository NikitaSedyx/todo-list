;(function(){
  angular
    .module("todo")

    .service("GroupStorage", function(){
      var groups = []

      this.getGroups = getGroups
      this.setGroups = setGroups

      function getGroups(){
        return groups
      }

      function setGroups(_groups){
        if (_groups){
          groups = _groups
        } else{
          groups = []
        }
        return this
      }
    })
})()
