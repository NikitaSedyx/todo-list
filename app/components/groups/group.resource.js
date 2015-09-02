;(function(){
  angular
    .module("todo")

    .service("GroupResource", function($resource, API){
      return $resource(API.BASE + API.GROUP + ":id/", {id: "@id"}, {
        get: {
          method: "GET"
        },
        create: {
          method: "POST"
        },
        update: {
          method: "PUT"
        },
        delete: {
          method: "DELETE"
        },
        patch: {
          method: "PATCH"
        }
      })
    })
})()
