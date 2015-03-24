getJsonObject = function() {

	var storedResult = localStorage.getItem('http://data.ssb.no/api/v0/dataset/85430.json');

	if (!storedResult) {
	    $.getJSON("http://data.ssb.no/api/v0/dataset/85430.json", function (result) {
	        localStorage.setItem('http://data.ssb.no/api/v0/dataset/85430.json', JSON.stringify(result));
	        return result;
	    });
	};

	return JSON.parse(storedResult);
};

var jsonObject = getJsonObject();

var regionIndex = jsonObject.dataset.dimension.Region.category.index;

var regionLabel = jsonObject.dataset.dimension.Region.category.label;

var partitions = _.groupBy(jsonObject.dataset.value, function (value, index) {
    return index % 2;
});

var landArea = partitions[0];

var freshWater = partitions[1];

var areaUnit = jsonObject.dataset.dimension.ContentsCode.category.unit.Areal1.base;

var Entry = function(region, landArea, waterArea, year) {
	self = this;
	self.region = region;
	self.landArea = landArea;
	self.waterArea = waterArea;
	self.year = year;
};

var entries = [];
$.each(regionIndex, function (key, value) {
    entries.push(
    	new Entry(regionLabel[key], landArea[value] + ' ' + areaUnit, freshWater[value] + ' ' + areaUnit, jsonObject.dataset.dimension.Tid.category.label[2014]	)
	);
});

var viewModel = function() {
	self = this;
	self.title = jsonObject.dataset.label;
	self.regionLabel = jsonObject.dataset.dimension.Region.label;
	self.landAreaLabel = jsonObject.dataset.dimension.Arealtype.category.label[1];
	self.waterAreaLabel = jsonObject.dataset.dimension.Arealtype.category.label[2];
	self.yearLabel = jsonObject.dataset.dimension.Tid.label;
	self.entries = entries;
}

ko.applyBindings(new viewModel());

var options = {
  valueNames: [ 'region', 'landArea', 'waterArea', 'year' ],
  page: jsonObject.dataset.dimension.size[0]
};

var nrkTable = new List('nrk-table', options);