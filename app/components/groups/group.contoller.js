;(function(){
  angular
    .module("todo")

    .controller("GroupController", GroupController)

    GroupController.$inject = ["$scope"]

    function GroupController($scope){
      $scope.groupView = "list"
      $scope.groups = [{
          title: "First",
          tasks: [{description: "firstklrgsdgsdgfkdgfkldgfkdgf sadasdsasddas asdasdasd godgfpodgf po asdp[odasokdfigjdfisuj dfsihuodf shjuodhfisjl] description"}],
          view: false,
          created_at: "2015-10-06"
        },
        {
          title: "Second",
          tasks: [
            {description: "first description", is_completed: true}, 
            {description: "second description", is_completed: true}
          ],
          view: true,
          created_at: "2015-10-06"
        },
        {
          title: "First",
          tasks: [{description: "firstklrgsdgsdgfkdgfkldgfkdgf sadasdsasddas asdasdasd godgfpodgf po asdp[odasokdfigjdfisuj dfsihuodf shjuodhfisjl] description"}],
          view: false,
          created_at: "2015-10-06"
        },
        {
          title: "Second",
          tasks: [
            {description: "first description", is_completed: true}, 
            {description: "second description", is_completed: true}
          ],
          view: true,
          created_at: "2015-10-06"
        },
        {
          title: "First",
          tasks: [{description: "firstklrgsdgsdasdkpasodkas;dlkas;dl asdlk;sldk;lasdk asldk ;asldk;asldkas;l dkas;ldk;laskd;laskd;l kas;ldkas;ldkas;ldk ;laskd ;laskd;lasdk ;lasskd ;lkasd;l kas d;lkas;ldk ;lkfidj fs jhoidfsj ohijso hpo hsjuis hjoids hjoisj hoisju hoifjsdohi dfjuohidjus fohijd h gfkldgfkdgf sadasdsasddas asdasdasd godgfpodgf po asdp[odasokdfigjdfisuj dfsihuodf shjuodhfisjl] description"}],
          view: false,
          created_at: "2015-10-06"
        },
        {
          title: "Second",
          tasks: [
            {description: "first description", is_completed: true}, 
            {description: "second description", is_completed: true},
            {description: "second description", is_completed: true},
            {description: "second description", is_completed: true},
            {description: "second description", is_completed: true},
            {description: "second description", is_completed: true}
          ],
          view: true,
          created_at: "2015-10-06"
        },
        {
          title: "Second",
          tasks: [
            {description: "first description", is_completed: true}, 
            {description: "second description", is_completed: true}
          ],
          view: true,
          created_at: "2015-10-06"
        },
        {
          title: "Second",
          tasks: [
            {description: "first description", is_completed: true}, 
            {description: "second description", is_completed: true}
          ],
          view: true,
          created_at: "2015-10-06"
        },
        {
          title: "Second",
          tasks: [
            {description: "first description", is_completed: true}, 
            {description: "second description", is_completed: true}
          ],
          view: true,
          created_at: "2015-10-06"
        },
        {
          title: "Second",
          tasks: [
            {description: "first description", is_completed: true}, 
            {description: "second description", is_completed: true}
          ],
          view: true,
          created_at: "2015-10-06"
        }]
      $scope.changeGroupView = changeGroupView

      function changeGroupView(view){
        $scope.groupView = view
      }
    }
})()
