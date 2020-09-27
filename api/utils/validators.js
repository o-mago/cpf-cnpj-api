module.exports = (document) => {
  let formatedDoc = document.replace(/\D/g,"");
  if(formatedDoc.length === 11 || formatedDoc.length === 14) {
    return calcDigit(formatedDoc, 1);
  } else if(formatedDoc.length === 0) {
    return true;
  } else {
    return false;
  }
} 

function calcDigit(document, digitPosition) {
  const slicePosition = -2/digitPosition;

  let digit = document.slice(slicePosition);
  let docRemainder = document.slice(0, slicePosition);

  let numberProportion = 0;
  const proportion = 9+digitPosition;
  const divider = 11;
  for(let i = 0; i < docRemainder.length; i++) {
    numberProportion += parseInt(docRemainder.charAt(i)) * (proportion-i); 
  }

  let reminder = numberProportion % divider;

  let comparisonDigit = divider - reminder;

  if(comparisonDigit >= 10) {
    comparisonDigit = 0;
  }

  if(comparisonDigit !== parseInt(digit.charAt(0))) {
    return false;
  }

  if(digitPosition === 1) {
    calcDigit(document, 2);
  } else {
    return true;
  }

  return true;
}