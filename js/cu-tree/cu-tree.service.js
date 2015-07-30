;(function(){
  angular
    .module("cu-tree")
    
  .service("CuTreeService", function(){
    this.getDepth = getDepth
    this.initData = initData
    this.findParentSize = findParentSize
    this.countSizes = countSizes

    function getDepth(obj) {
      var depth = 0;
      if (obj.children) {
        _.forEach(obj.children, function(child){
          var tmpDepth = getDepth(child)
          if (tmpDepth > depth) {
            depth = tmpDepth
          }      
        })
      }
      return 1 + depth
    }

    function initData(source){
      if (source.children){
        _.forEach(source.children, function(child){
          return initData(child)
        })
        source._children = source.children
        source.children = null
      }
      return source
    }

    function countSizes(obj, field){
      function recurce(){
        if (obj.children){
          sizeArray = obj.children.map(function(child){
            countSizes(child, field)
            return child[field]
          })
          obj[field] = arraySumRec(sizeArray)
        }
      }

      recurce()
      return obj
    }

    function findParentSize(d, field){
      if (d.parent.parent){
        return findParentSize(d.parent, field)
      } else{
        return d[field]
      }
    }    

    function arraySumRec(array){
      var sum=0
      var length = array.length
      for (var i = 0; i < length; i++){
        if (array[i] instanceof Array){
          sum += arraySumRec(array[i])
        }
        else{
          sum += array[i]
        }
      }
      return sum
    }
  })

})()
