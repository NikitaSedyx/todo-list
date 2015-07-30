;(function(){
  angular
    .module("cu-tree")

    .controller("CuTreeController", function($scope, CuTreeService){

      var tree = d3.layout.tree()
        .sort(null)

      var diagonal = d3.svg.diagonal()
          .projection(function(d) { return [d.y, d.x]; })

      var color = d3.scale.category20c()

      var sizeScale = d3.scale.linear()
        .domain([0, 1])
        .range([3, 40])

      var opacityScale = d3.scale.linear()
        .range([0.5, 0.8])

      var widthDepth = 200
      var id = 0
      var margin = {
        top: 20,
        right: 60,
        bottom: 20,
        left: 60
      }

      var sgv, max

      function draw(root){
        var duration = 1500

        var nodes = tree.nodes(root).reverse()
        var links = tree.links(nodes)

        nodes.forEach(function(d){
          d.y = d.depth * widthDepth
        })

        var node = svg.selectAll(".node")
          .data(nodes, function(d){ 
            return d.id || (d.id = ++id)
          })

        var update = node.transition()
          .duration(duration)
          .attr("transform", function(d){ 
            return "translate(" + d.y + "," + d.x + ")"
          })

        var enter = node.enter().append("g")
          .attr("class", "node")
          .attr("transform", function(d){ 
            if (d.parent){
              return "translate(" + d.parent.y + "," + d.parent.x + ")"
            }
            return "translate(" + d.y + "," + d.x + ")" 
          })
          .on("click", function(d){
            if (d.children){
              d.children = null
            } else{
              d.children = d._children
            }
            draw(root)                
          })
              
        enter.append("circle")
          .style("fill", defineCircleColor)
          .style("stroke", defineCircleColor)
          .attr("r", 0)

        enter.append("text")
          .attr("dx", function(d){ 
            return 0
          })
          .attr("dy", function(d){
            return -3 - sizeScale(d[$scope.treeConfig.field] / max)
          })
          .style("font-size", "0px")
          .text(function(d){
            return d.name
          }) 

        var enterTransition = enter.transition()
          .duration(duration)
          .attr("transform", function(d){ 
            return "translate(" + d.y + "," + d.x + ")"
          })

        enterTransition.selectAll("circle")
          .attr("r", function(d){
            return sizeScale(d[$scope.treeConfig.field] / max)
          })   

        enterTransition.selectAll("text")
          .style("font-size", "20px")

        exitTransition = node.exit().transition()
          .duration(duration)
          .attr("transform", function(d){
            return "translate(" + d.parent.y + "," + d.parent.x + ")" 
          })
          .remove()

        exitTransition.selectAll("circle")
          .attr("r", 0)

        exitTransition.selectAll("text")
          .style("font-size", "0px")

        node.exit()
          .transition()
          .duration(duration)
          .attr("transform", function(d){
            return "translate(" + d.parent.y + "," + d.parent.x + ")"
          })
          .remove()

        var link = svg.selectAll(".link")
          .data(links, function(d){ 
            return d.target.id
          })

        link.enter().append("path")
          .attr("class", "link")
          .attr("d", function(d){
            var tmp = Object.create(d)
            tmp.target = tmp.source
            return diagonal(tmp)
          })
          .style("stroke-opacity", function(d){
            return opacityScale(d.target.depth)
          })

        link.transition()
          .duration(duration)
          .attr("d", diagonal)
          .style("stroke-width", function(d){
            return sizeScale(d.target[$scope.treeConfig.field] / max) * 2
          })
          .style("stroke", function(d){
            return color(CuTreeService.findParentSize(d.target, $scope.treeConfig.field))
          }) 

        var exitLinks = link.exit()
          .transition()
          .duration(duration)
          .style("stroke-width", 0)
          .attr("d", function(d){
            var tmp = Object.create(d)
            tmp.target = tmp.source
            return diagonal(tmp)      
          })
      }

      function defineCircleColor(d){
        var size;
        if (d.parent){
          size = CuTreeService.findParentSize(d, $scope.treeConfig.field)
        } else{
          size = d[$scope.treeConfig.field]
        }
        return color(size)
      }

      $scope.$watch('treeConfig.data', function(){
        if ($scope.treeConfig.data){
          var depth = CuTreeService.getDepth($scope.treeConfig.data)
          var width = widthDepth * depth
          var height = 2000

          tree.size([height, width])
          opacityScale.domain([0, depth])

          svg = d3.select("cu-tree").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
          .append("g")
            .attr("width", width)
            .attr("height", height)
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

          var root = CuTreeService.countSizes($scope.treeConfig.data, $scope.treeConfig.field)
          root = CuTreeService.initData(root)
          max = root[$scope.treeConfig.field]
          draw(root)
        }
      })
      
    })
})()
