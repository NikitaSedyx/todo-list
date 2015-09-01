;(function(){
  angular
    .module("todo")

    .service("TrashResource", function($resource, API){
     return $resource(API.BASE + API.TRASH + ":id/", {id: "@id"}, {
        get: {
          method: "GET",
        },
        update: {
          method: "PATCH",
        },
        delete: {
          method: "DELETE"
        }
      })
    })
})()
