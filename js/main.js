;(function(document, undefined){
  var COMPLAINT = 'Product complaint';

  var enquiryTypeInput = document.getElementById('enquiryType');
  var required = [
    'productName',
    'productSize',
    'useByDate',
    'batchCode'
  ].map(function(s){
    return document.getElementById(s);
  });
  var makeRequired = function(el){ el.required = true; };
  var undoRequired = function(el){ el.required = false; };

  enquiryTypeInput.addEventListener('change', function(e){
    var selected = this.children[this.selectedIndex];
    if (selected.innerHTML === COMPLAINT){
      required.forEach(makeRequired);
    } else {
      required.forEach(undoRequired);
    }
  });
})(document);
