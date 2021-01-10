
const getColor = props =>
  {
	  var minA = 40;
	  var maxA = 80;
	  var minB = 0.5;
	  var maxB = 3;
	  
	  var minColorA = 50;
	  var maxColorA = 200;
	  var minColorB = 100;
	  var maxColorB = 200;
	  
	  var colA = lerp(minColorA, maxColorA, (((clamp(minA, maxA,    props.un) - minA) * 100) / (maxA - minA))/100 );
	  var colB = lerp(minColorB, maxColorB, (((clamp(minB, maxB, props.incon) - minB) * 100) / (maxB - minB))/100  );
	  
	  var res = valueToHex(colB);
	  
	  var endCol = 'FFFF' + /*valueToHex(colA) + */ res
	  
	  return endCol;
  }

  function valueToHex(val) {
	  
	  var lastDigit = val % 16;
	  var firstDigit = Math.ceil((val-lastDigit) / 16);
	  
	  var res = ''+singleToHex(firstDigit)+''+singleToHex(lastDigit)
	  
	  return res;
  }
  
  
  function lerp(start, end, value) {
      return start * (1 - value) + end * value
  }
  
  function clamp(min, max, value) {
	  if(min > value) return min
	  if(max < value) return max
      return value
  }
  
  
  function singleToHex(val) {
	  
	  if(val === 15) return 'F'
	  if(val === 14) return 'E'
	  if(val === 13) return 'D'
	  if(val === 12) return 'C'
	  if(val === 11) return 'B'
	  if(val === 10) return 'A'
	  
	  return val;
  }
  

export { getColor }