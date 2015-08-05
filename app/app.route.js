;(function () {
  angular
    .module("todo")

  .config(RouterConfig)

  RouterConfig.$injector = ["$stateProvider", "$urlRouterProvider"]

  function RouterConfig($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/groups")

    $stateProvider
      .state("groups", {
        abstract: true,
        templateUrl: "app/views/components/groups/groups.html",
        controller: "GroupController"
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
      .state("edit-group", {
        url: "/edit_group/:id",
        templateUrl: "app/views/components/groups/group-edit/edit-group.html",
        controller: "EditGroupController"
      })
      .state("login", {
        url: "/login",
        templateUrl: "app/views/components/login/login.html",
        controller: "LoginController"
      })
      .state("registration", {
        url: "/registration",
        templateUrl: "app/views/components/register/register.html",
        controller: "RegisterController"
      })
  }
})()
