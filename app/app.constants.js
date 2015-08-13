;(function(){
  angular
    .module("todo")

    .constant("API", {
      BASE: "/api/v1",
      AUTH: "/auth/",
      REGISTRATION:"/registration/",
      GROUP: "/group/",
      EXPORT: "/export/",
      USER: "/user/",
      ITEM: "/item/",
      INFO: "info/",
      FILE: "/file/",
      UPLOAD: "upload/",
      LOGOUT: "/logout/",
      LOGIN: "/login/"
    })
})()
