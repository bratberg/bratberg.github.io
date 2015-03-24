(function(angular) {
  'use strict';
angular.module('nrkApp', [])
  .controller('NrkController', ['$scope', '$http', '$log', function($scope, $http, $log) {

  	var jsonDataUrl = 'http://data.ssb.no/api/v0/dataset/85430.json';

  	$scope.jsonObject = JSON.parse(localStorage.getItem(jsonDataUrl));

	if (!$scope.jsonObject) {
	  	$http.get(jsonDataUrl).success(function(data) {
			$log.info('JSON data hentet fra ' + jsonDataUrl);
			$scope.jsonObject = data;
			localStorage.setItem(jsonDataUrl, JSON.stringify(data));
		});
  	} else {
		$log.info('JSON data hentet fra localStorage');
  	}

	$scope.title = $scope.jsonObject.dataset.label;
	$scope.regionLabel = $scope.jsonObject.dataset.dimension.Region.label;
	$scope.landAreaLabel = $scope.jsonObject.dataset.dimension.Arealtype.category.label[1];
	$scope.waterAreaLabel = $scope.jsonObject.dataset.dimension.Arealtype.category.label[2];
	$scope.yearLabel = $scope.jsonObject.dataset.dimension.Tid.label;
	$scope.predicate = 'region';

  	$scope.entries = function(jsonObject) {
  		var regionIndex = jsonObject.dataset.dimension.Region.category.index;
		var regionLabel = jsonObject.dataset.dimension.Region.category.label;
		var partitions = _.groupBy(jsonObject.dataset.value, function (value, index) {
		    return index % 2;
		});
		var landArea = partitions[0];
		var freshWater = partitions[1];
		var unit = $scope.jsonObject.dataset.dimension.ContentsCode.category.unit.Areal1.base;

		var Entry = function(region, landArea, waterArea, year, unit) {
			self = this;
			self.region = region;
			self.landArea = landArea;
			self.waterArea = waterArea;
			self.year = year;
			self.unit = unit;
		};

		var arrayOfEntries = [];
		angular.forEach(regionIndex, function (key, value) {
		    arrayOfEntries.push(
		    	new Entry(regionLabel[value], landArea[key], freshWater[key], jsonObject.dataset.dimension.Tid.category.label[2014], unit	)
			);
		});
  		return arrayOfEntries;
  	}($scope.jsonObject);

    $scope.message = 'Hello World!';
  }])
  .filter('withUnit', function() {
    return function(input, unit) {
      return input + " " + unit;
    };
  });;
})(window.angular);