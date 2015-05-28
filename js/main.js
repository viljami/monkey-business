;(function(document, undefined){
  'use strict';

  var COMPLAINT = 'complaint';

  var enquiryTypeInput = document.getElementById('enquiryType');
  var required = [
    'productName',
    'productSize',
    'useByDate',
    'batchCode'
  ].map(function(s){
    return document.getElementById(s);
  });
  var makeRequired = function(el){ el.required = 'required'; };
  var undoRequired = function(el){ el.required = false; };

  enquiryTypeInput.addEventListener('change', function(){
    var selected = this.children[this.selectedIndex];
    if (selected.value === COMPLAINT){
      required.forEach(makeRequired);
    } else {
      required.forEach(undoRequired);
    }
  });
})(document);
