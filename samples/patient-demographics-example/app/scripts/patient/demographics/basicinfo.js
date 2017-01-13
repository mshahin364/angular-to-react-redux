'use strict';

angular.module('patientDemographicsExampleApp')
  .directive('basicInfo', function() {
    return {
      template: '<div>' +
                '  <table class="table" ng-show="vm.inReadMode()">' +
                '    <tr>' +
                '      <td><strong>Name:</strong> {{vm.basic.name}}</td>' +
                '      <td><strong>DOB:</strong> {{vm.basic.dob}}</td>' +
                '    </tr>' +
                '    <tr>' +
                '      <td><strong>S.S.:</strong> {{vm.basic.ss | ssnFilter}}</td>' +
                '      <td><strong>Martial Status:</strong> {{vm.basic.martialStatus}}</td>' +
                '    </tr>' +
                '    <tr>' +
                '      <td><strong>Gender:</strong> {{vm.basic.gender}} </td>' +
                '      <td><strong>Address:</strong> {{vm.basic.address}}</td>' +
                '    </tr>' +
                '    <tr>' +
                '      <td><strong>City:</strong> {{vm.basic.city}}</td>' +
                '      <td><strong>Postal:</strong> {{vm.basic.postal}}</td>' +
                '    </tr>' +
                '    <tr>' +
                '      <td><strong>State:</strong> {{vm.basic.state}}</td>' +
                '      <td><strong>Country:</strong> {{vm.basic.country}}</td>' +
                '    </tr>' +
                '    <tr>' +
                '      <td><strong>Phone:</strong> {{vm.basic.phone | telFilter }}</td>' +
                '      <td><strong>Email:</strong> {{vm.basic.email}}</td>' +
                '    </tr>' +
                '    <tr>' +
                '      <td><strong>Billing Note:</strong>{{vm.basic.billingNote}}</td>' +
                '      <td><strong>Other Note:</strong>{{vm.basic.otherNote}}</td>' +
                '    </tr>' +
                '  </table>' +
                '  <form name="basicInfoForm" class="basic-info-form" ng-show="vm.inEditMode()" ng-submit="vm.changeMode(vm.MODES.SAVE)" novalidate>' +
                '    <table class="table">' +
                '      <tr>' +
                '        <td><strong>Name:</strong> <input type="text" name="fullname" ng-model="vm.basic.name" required/>' +
                '         <div><p ng-show="basicInfoForm.fullname.$invalid && !basicInfoForm.fullname.$pristine" class="help-block">A name is required</p></div></td>' +

                '        <td><strong>DOB:</strong><datepicker date-set="{{vm.initialDate}}" date-format="yyyy-MM-dd">' +
                '           <input ng-model="vm.basic.dob" type="text" required/></datepicker></td>' +
                '      </tr>' +
                '      <tr>' +
                '        <td><strong>SSN:</strong> <input type="text" name=ssn ng-model="vm.basic.ss" ng-minlength="9" ui-mask="999-99-9999" required/>' +
                '         <div><p ng-show="basicInfoForm.ssn.$invalid && !basicInfoForm.ssn.$pristine" class="help-block">9 digits are required for SSN</p></div></td>' +
                '        <td><strong>Martial Status:</strong> <input type="text" ng-model="vm.basic.martialStatus" required/></td>' +
                '      </tr>' +
                '      <tr>' +
                '        <td><strong>Gender:</strong>' +
                '          <select ng-model="vm.basic.gender" required>' +
                '            <option ng-repeat="gender in vm.genders" value="{{gender}}">{{gender}}</option>' +
                '          </select>' +
                '        </td>' +
                '        <td><strong>Address:</strong> <input type="text" ng-model="vm.basic.address" required/></td>' +
                '      </tr>' +
                '       <tr>' +
                '        <td><strong>City:</strong> <input type="text" ng-model="vm.basic.city" required/></td>' +
                '        <td><strong>Postal:</strong> <input type="text" ng-model="vm.basic.postal" required/></td>' +
                '      </tr>' +
                '      <tr>' +
                '        <td><strong>State:</strong> <input type="text" ng-model="vm.basic.state" ng-minlength="2" required/></td>' +
                '        <td><strong>Country:</strong> <input type="text" ng-model="vm.basic.country" required/></td>' +
                '      </tr>' +
                '      <tr>' +
                '        <td><strong>Phone:</strong> <input type="text" ng-model="vm.basic.phone" ui-mask="(999)-999-9999" required/></td>' +
                '        <td><strong>Email:</strong> <input type="email" ng-model="vm.basic.email" ng-pattern=".*@.*" required/></td>' +
                '      </tr>' +
                '      <tr>' +
                '        <td><strong>Billing Note:</strong> <input type="text" ng-model="vm.basic.billingNote" /></td>' +
                '        <td><strong>Other Note:</strong> <input type="text" ng-model="vm.basic.otherNote" /></td>' +
                '      </tr>' +
                '    </table>' +
                '    <button class="btn btn-default btn-sm"' +
                '            type="submit" ng-disabled="basicInfoForm.$invalid">SAVE</button>'+
                '    <button type="button"' +
                '            class="btn btn-default btn-sm" ' +
                '            ng-show="vm.inEditMode()"' +
                '            ng-click="vm.changeMode(vm.MODES.CANCEL)">CANCEL</button>'+
                '  </form>' +
                '  <button type="button"' +
                '          class="btn btn-default btn-sm"' +
                '          ng-show="vm.inReadMode()"' +
                '          ng-click="vm.changeMode(vm.MODES.EDIT)">EDIT</button>' +
                '</div>',
      restrict: 'E',
      link: function postLink() {},
      scope: {
        'basic': '='
      },
      controllerAs: 'vm',
      bindToController: true,
      controller: ['$log', '$scope', '$filter', function($log, $scope, $filter) {
        var logger = $log.getInstance('BasicInfoDirective');

        var vm = this;

        // Used for "edit" -> "cancel" reverts
        var _cachedDataForEditMode = null;

        vm.genders = {
          Male: 'Male',
          Female: 'Female',
          Other: 'Other'
        };

        vm.mode = null;

        vm.MODES = {
          READ: 'read',
          SAVE: 'save',
          EDIT: 'edit',
          CANCEL: 'cancel'
        };

        vm.inEditMode = function() {
          return vm.mode === vm.MODES.EDIT;
        };

        vm.inReadMode = function() {
          return vm.mode === vm.MODES.READ;
        };

        vm.changeMode = function(newMode) {
          logger.debug('Requesting mode be changed to ' + newMode);

          switch(newMode) {
            case vm.MODES.CANCEL:
              _handleCancelMode();
              break;
            case vm.MODES.EDIT:
              _handleEditMode();
              break;
            case vm.MODES.SAVE:
            case vm.MODES.READ:
              _handleSaveMode();
              break;
          }
        };

        function _handleEditMode() {
          logger.debug('Caching previous contact state');

          _cachedDataForEditMode = angular.copy(vm.basic);
          vm.mode = vm.MODES.EDIT;
        }

        function _handleCancelMode() {
          logger.debug('Applying previous contact state cache');

          angular.copy(_cachedDataForEditMode, vm.basic);
          vm.mode = vm.MODES.READ;
        }

        function _handleSaveMode() {
          vm.mode = vm.MODES.READ;

          logger.debug('Releasing previous contact state cache');
          _cachedDataForEditMode = null;

          // In a real app, the `PatientService.upsertBasicInfo` would be called
        }

        function _construct() {
          logger.debug('Constructing basic info directive');

          vm.changeMode(vm.MODES.READ); // Default mode

          vm.initialDate = angular.copy(vm.basic.dob);
        }

        // vm.basic is not immediately available. Wait for it to be passed.
        var _unregister = $scope.$watch(angular.bind(vm, function() {
          return this.basic;
        }), function (newVal) {
          if (newVal) {
            _unregister();
            _construct();
          }
        });
      }]
    };
  });