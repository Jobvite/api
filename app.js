var app = angular.module('plunker', ['ui', 'ngResource']);

app.controller('MainCtrl', function($scope, $resource) {
  $scope.filters = {};
  var endpoints = $resource('global.json');
  $scope.endpoints = endpoints.get();
  $scope.open = function(title, data) {
    $scope.data = data;
    $scope.title = title;
  };
}).controller('TestingCtrl', function($scope, $http) {
  $scope.tokens = [{}];
  $scope.addToken = function(last, token, index){
    if (last && token.key && token.value)
      $scope.tokens.push({});
    if (!last && !token.key && !token.value)
      $scope.tokens.splice(index, 1);
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
      data.response = response;
      data.code = code;
    }
    var options = {
      url: data.host + data.path,
      method: data.method || 'GET'
    };
    angular.forEach($scope.tokens, function(token, index){
      if (index !== $scope.tokens.length - 1)
        options.url = options.url.replace('{'+token.key+'}', token.value, 'gi');
    });
    $http(options).success(done).error(done);
  };
});
