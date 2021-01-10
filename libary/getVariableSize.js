

const getVariableSize = props =>
  {
      var minSizeMarker = 10;
	  var maxSizeMarker = 30;
	  
	  var min = 10;
	  var max = 20;
	  var clamped = clamp(min, max, parseInt(props.variableMarkerSize))
	  
	  var size = lerp(minSizeMarker, maxSizeMarker, (((clamped - min) * 100) / (max - min))/100);
	  
	  return size;
  }
  
  
  function lerp(start, end, value) {
      return start * (1 - value) + end * value
  }
  
  function clamp(min, max, value) {
	  if(min > value) return min
	  if(max < value) return max
      return value
  }
  

export { getVariableSize }