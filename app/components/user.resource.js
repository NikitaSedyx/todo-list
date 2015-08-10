;(function(){
  angular
    .module("todo")

    .factory("UserResource", UserResource)

    UserResource.$inject = ["API", "$resource"]

    function UserResource(API, $resource){
      return $resource(API.BASE + API.USER + ":id/", {id: "@id"}, {
        getUsers: {
          method: "GET",
          params: {id: null}
        },
        getUser: {
          method: "GET"
        },
        createUser: {
          method: "POST"
        },
        updateUser: {
          method: "PUT"
        },
        deleteUser: {
          method: "DELETE"
        }
      })
    }
})()
