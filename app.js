var app = angular.module('api', ['ui', 'ngResource']);

app.value('ui.config', {
  codemirror: {
    theme: 'monokai',
    lineNumbers: true
  }
});

app.factory('endpoints', ['$resource', function($resource){
  var endpoints = $resource('global.json', {}, {
    get: { isArray:true, method: 'GET' }
  });
  return endpoints;
}]).factory('tokens', ['$http', function($http){
  var data = [];
  $http.get('tokens.json').success(function(response, code){
    angular.forEach(response, function(value, key){
      data.unshift({
        key: key,
        value: value
      });
    });
  });
  return data;
}]);

app.controller('MainCtrl', ['$scope', 'endpoints', function($scope, endpoints) {
  $scope.logs = [];
  $scope.filters = {};

  $scope.endpoints = endpoints.get();
  $scope.open = function(data) {
    if (!data.method) {
      if (data.get)
        data.method = 'GET';
      else if (data.post)
        data.method = 'POST';
    }
    if (!data.postData && angular.isObject(data.post)) {
      data.postData = JSON.stringify(data.post);
    }
    $scope.data = data;
  };
}]).controller('TestingCtrl', ['$scope', '$http', 'tokens', function($scope, $http, tokens) {

  $scope.tokens = tokens;
  $scope.tokens.push({});

  $scope.autoAdd = function(dataset, index){
    var item = dataset[index],
        last = (index === dataset.length - 1);
    if (last && item.key)
      dataset.push({});
    if (!last && !item.key && !item.value)
      dataset.splice(index, 1);
  };

  $scope.codeClass = function(code){
    return {
      'label-info' : code < 300,
      'label-warning' : code > 300 && code < 400,
      'label-important' : code > 399
    };
  };

  $scope.test = function(data) {
    function done(response, code) {
      data.response = options.response = response;
      data.code = options.code = code;
      $scope.loading = false;
    }
    var options = {
      url: data.host + data.path,
      method: data.method
    };
    angular.forEach($scope.tokens, function(token, index){
      if (index !== $scope.tokens.length - 1) {
        console.log(options.url = options.url.replace('{'+token.key+'}', token.value, 'gi'));
      }
    });
    $scope.loading = true;
    console.log(options);
    $http(options).success(done).error(done);
    options.data = angular.copy(data);
    $scope.logs.push(options);
  };

}]);
