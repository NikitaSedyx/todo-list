;(function(){
  angular
    .module("todo")

    .config(RouterConfig)

    RouterConfig.$injector = ["$stateProvider", "$urlRouterProvider"]

    function RouterConfig($stateProvider, $urlRouterProvider){
      $urlRouterProvider.otherwise("/groups")

      $stateProvider
        .state("groups", {
          abstract: true,
          templateUrl: "",
          controller: "GroupController"
        })
        .state("groups.list", {
          url: "/groups",
          views: {
            "list": {
              templateUrl: "",
              controller: "GroupListController"
            },
            "panel": {
              templateUrl: "",
              controller: "GroupPanelController"
            }
          }
        })
    }
})()
