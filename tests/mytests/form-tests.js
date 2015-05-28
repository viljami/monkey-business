/* globals registerTest, equal */
'use strict';

var toArray = function(a){ return Array.prototype.slice.call(a); };
var isRequired = function(el){ return !! el.required; };
var isInputField = function(el){
  return ['select', 'input', 'textarea']
    .indexOf(el.tagName.toLowerCase()) !== -1;
};

registerTest ('Demo page test', {
    // not "before Each"
    setup: function() {
      // THESE ARE OLD AFTER PAGE LOAD..............
      this.form = this.workspace.document.forms[0];
      this.fields = toArray(this.form.children).filter(isInputField);
      this.defaultRequiredFields = this.fields.filter(isRequired);
    },

    load:function() {
        var self = this;
        var didFormSubmit = false;
        var fillField = function(el){
            if (el.tagName === 'INPUT') {
              el.value = 'a';
            } else if (el.tagName === 'SELECT'){
              el.value = el.children[1].value;
            }
        };

        this
        .test('A form is in the page?', function($) {
            equal($('form').length, 1, 'A form is in the page.');

            // Prepare for submit tests.
            // Setting event listeners should be done in "before each"
            $('form').on('submit', function(){
              didFormSubmit = true;
            });
        })
        .asyncTest('Empty form will not submit.', function($){
            didFormSubmit = false;
            $('input[type="submit"]').click();

            setTimeout(function(){
                equal(didFormSubmit, false, 'Form did not submit!');
                self.asyncTestDone();
            }, 10);
        })
        .asyncTest('Form did not submit for unfilled form.', function($){
            didFormSubmit = false;
            var $submit = $('input[type="submit"]');
            self.defaultRequiredFields.forEach(function(el, i){
              if (self.defaultRequiredFields.length === i + 1){ return; }
              fillField(el);
              $submit.click();
            });

            setTimeout(function(){
                equal(didFormSubmit, false, 'Form did not submit!');
                self.asyncTestDone();
            }, 10);
        })
        .waitForPageLoadAfter(function($){
            didFormSubmit = false;
            var $submit = $('input[type="submit"]');
            self.defaultRequiredFields.forEach(function(el){
              fillField(el);
              $submit.click();
            });
        })
        .test('Form submits for filled form.', function($){
            equal(didFormSubmit, true, 'Form did submit!');

            // Prepare for the newly loaded page
            $('form').on('submit', function(){
              didFormSubmit = true;
            });
        })
        .asyncTest('Form did not submits for a unfilled complaint.', function($){
            didFormSubmit = false;
            var $submit = $('input[type="submit"]');
            var $enquiry = $('#enquiryType');
            $enquiry.val('complaint');
            // jQuery change does not work
            $enquiry[0].dispatchEvent(new Event('change'));
            var complaintRequiredFields = $(':required');
            equal(complaintRequiredFields.length > self.defaultRequiredFields.length, true, 'Complaint has more required fields.');

            complaintRequiredFields.each(function(el, i){
              if (complaintRequiredFields.length === i + 1 ||
                  $enquiry[0] === el){ return; }
              fillField(el);
              $submit.click();
            });

            setTimeout(function(){
                equal(didFormSubmit, false, 'Form did not submit for unfilled complaint!');
                self.asyncTestDone();
            }, 10);
        })
        .waitForPageLoadAfter(function($){
            didFormSubmit = false;
            var $submit = $('input[type="submit"]');
            var $enquiry = $('#enquiryType');
            var fields = toArray($('form')[0].children)
                .filter(isInputField);
            $enquiry.val('complaint');
            $enquiry[0].dispatchEvent(new Event('change'));

            fields
            .forEach(function(el){
              if ($enquiry[0] === el){ return; }
              console.log(el);
              fillField(el);
              $submit.click();
            });
        })
        .test('Form submits for a filled complaint.', function(){
            equal(didFormSubmit, true, 'Form did submit for complaint.');
        });
    }
});