;(function(){
  angular
    .module("todo")

    .constant("API", {
      BASE: "/api/v1",
      AUTH: "/auth/",
      REGISTRATION: "/registration/",
      LOGIN: "/login/",
      GROUP: "/group/",
      LOGOUT: "/logout/",
      EXPORT: "/export/",
      USER: "/user/",
      ITEM: "/item/",
      INFO: "info/"
    })
})()
