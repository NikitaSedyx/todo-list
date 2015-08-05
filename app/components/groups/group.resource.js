;(function(){
  angular
    .module("todo")
    .service("GroupResource",GroupResource)

  GroupResource.$inject=["$resource", "API"]

  function GroupResource($resource, API) {
    return $resource(API.BASE + API.GROUP + ":id/", {id: "@id"}, {
      getGroups: {
        method: "GET",
        params: {id:null}
      },
      getGroup: {
        method: "GET"
      },
      createGroup: {
        method: "POST"
      },
      editGroup: {
        method: "PUT"
      },
      deleteGroup: {
        method: "DELETE"
      }
    })
  }
})()
