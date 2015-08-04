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
          templateUrl: "app/views/components/groups/groups.html",
          controller: "AddGroupController"
        })
        .state("groups.list", {
          url: "/groups",
          views: {
            "list": {
              templateUrl: "app/views/components/groups/group-list/group-list.html",
              controller: "GroupListController"
            },
            "panel": {
              templateUrl: "app/views/components/groups/group-panel/group-panel.html",
              controller: "GroupPanelController"
            }
          }
        })
    }
})()
