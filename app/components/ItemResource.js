;(function(){
  angular
    .module("todo")

    .service("ItemResource", ItemResource)

    ItemResource.$inject = ["API", "$resource"]

    function ItemResource(API, $resource){
      return $resource(API.BASE + API.ITEM + "/:id/", {id: "@id"}, {
        getItem: {
          method: "GET"
        },
        createItem: {
          method: "POST"
        },
        updateItem: {
          method: "PUT"
        },
        deleteItem: {
          method: "DELETE"
        }
      })
    }
})()
