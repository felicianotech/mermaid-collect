angular.module('mermaid.forms').directive('futureyear', function() {
  'use strict';
  return {
    require: 'ngModel',
    link: function(scope, elem, attr, ngModel) {
      var today = new Date().getTime();
      ngModel.validator_messages = ngModel.validator_messages || {};
      ngModel.validator_messages[
        window.appConfig.validatorPrefix + 'futureyear'
      ] = 'Date is in future';

      function validate() {
        var is_valid = true;
        var dateInput = new Date(ngModel.$modelValue).getTime();
        var dateDifference = Math.floor((today - dateInput) / 86400000);

        if (!isNaN(dateDifference) && dateDifference !== null) {
          is_valid = dateDifference >= 0;
        }
        ngModel.$setValidity(
          window.appConfig.validatorPrefix + 'futureyear',
          is_valid
        );
      }

      scope.$watch(function() {
        return ngModel.$modelValue;
      }, validate);
    }
  };
});
