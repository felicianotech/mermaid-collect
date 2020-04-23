angular.module('app.reference').controller('FishFamiliesCtrl', [
  '$rootScope',
  '$scope',
  'PaginatedOfflineTableWrapper',
  'OfflineCommonTables',
  'TransectExportService',
  'Button',
  function(
    $rootScope,
    $scope,
    PaginatedOfflineTableWrapper,
    OfflineCommonTables,
    TransectExportService,
    Button
  ) {
    'use strict';

    $scope.resource = null;
    $scope.tableControl = {};
    const fieldReportButton = new Button();
    const reportHeader = ['Name'];
    let fishFamilyRecordsCount = 0;

    $scope.tableConfig = {
      id: 'mermaid_fishfamiles',
      defaultSortByColumn: 'name',
      searching: true,
      searchPlaceholder: 'Filter fish families by name',
      searchLocation: 'left',
      cols: [
        {
          name: 'name',
          display: 'Name',
          sortable: true,
          sort_by: ['name'],
          tdTemplate:
            '<a ui-sref="app.reference.fishfamilies.fishfamily({id: record.id})">{{record.name}}</a>'
        },
        {
          name: 'biomass_constant_a',
          display: 'Biomass Constant A',
          sortable: true
        },
        {
          name: 'biomass_constant_b',
          display: 'Biomass Constant B',
          sortable: true
        },
        {
          name: 'biomass_constant_c',
          display: 'Biomass Constant C',
          sortable: true
        }
      ],
      toolbar: {
        template: 'app/reference/partials/fish-families-toolbar.tpl.html',
        clearFilters: function() {
          $scope.tableControl.clearSearch();
        }
      }
    };

    const updateFishFamilyCount = function() {
      $scope.projectObjectsTable.count().then(function(count) {
        fishFamilyRecordsCount = count;
      });
    };

    const downloadFishFamiliesReport = function() {
      $scope.projectObjectsTable.filter().then(function(records) {
        const content = TransectExportService.fishFamiliesReport(records);

        TransectExportService.downloadAsCSV(
          'fish-families',
          reportHeader,
          content
        );
      });
    };

    const promise = OfflineCommonTables.FishFamiliesTable();
    promise.then(function(table) {
      $scope.projectObjectsTable = table;
      updateFishFamilyCount();
      $scope.resource = new PaginatedOfflineTableWrapper(table, {
        searchFields: ['name']
      });
      $scope.projectObjectsTable.$watch(
        updateFishFamilyCount,
        null,
        'fishFamilyRecordsCount'
      );
    });

    $scope.tableControl.getFilteredRecordsCount = function() {
      const tableRecordsTotal =
        $scope.tableControl.getPaginationTable() &&
        $scope.tableControl.getPaginationTable().total;

      return `${tableRecordsTotal}/${fishFamilyRecordsCount}`;
    };

    $scope.tableControl.recordsNotFiltered = function() {
      if (
        $scope.tableControl.records &&
        $scope.tableControl.records.length !== fishFamilyRecordsCount
      ) {
        updateFishFamilyCount();
      }
      return !$scope.tableControl.textboxFilterUsed();
    };

    fieldReportButton.name = 'Export to CSV';
    fieldReportButton.classes = 'btn-success';
    fieldReportButton.icon = 'fa fa-download';
    fieldReportButton.enabled = true;
    fieldReportButton.onlineOnly = false;
    fieldReportButton.click = function() {
      downloadFishFamiliesReport();
    };

    $rootScope.PageHeaderButtons = [fieldReportButton];
  }
]);
