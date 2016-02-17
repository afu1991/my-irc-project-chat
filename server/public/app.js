var app = angular
  .module('app', ['ngRoute','angular-storage', 'ngDropzone'])
  .run(function($rootScope, $location, Auth, UserService){
        $rootScope.api = "http://localhost:8080";
        //console.log(UserService.getCurrentUser());
        var CurrentUser = UserService.getCurrentUser();
//console.log(CurrentUser);
        if (CurrentUser != null) {
            Auth.isLogged({token: CurrentUser.token }).success(function(response){
                if(response.error) {
                    UserService.setCurrentUser(null);
                    $location.path('login');
                }
            }).error(function(data){
                UserService.setCurrentUser(null);
                $location.path("/login");
            });
        } else {
            $location.path("/login");

        }

  })
  .config(function($routeProvider, $httpProvider) {
    $routeProvider
        .when('/login', {
          templateUrl: 'views/auth/login.html',
          controller: 'LoginCtrl'
        })
        .when('/logout', {
          templateUrl: 'views/auth/logout.html',
          controller: 'LogoutCtrl'
        })
        .when('/register', {
          templateUrl: 'views/auth/register.html',
          controller: 'RegisterCtrl'
        })
        .when('/profile', {
            templateUrl: 'views/auth/profile.html',
            controller: 'ProfileCtrl'
        })
        .when('/channel', {
          templateUrl: 'views/chanel/chanel.html',
          controller: 'ChanelCtrl'
        });
//        $httpProvider.interceptors.push('APIInterceptor');
      //  console.log($httpProvider.interceptors);
  });

app.factory('socket', ['$rootScope', function($rootScope) {
    var socket = io.connect($rootScope.api);
//console.log($rootScope.api);
    return {
        on: function (eventName, callback) {
            function wrapper() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            }

            socket.on(eventName, wrapper);

            return function () {
                socket.removeListener(eventName, wrapper);
            };
        },

        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if(callback) {
                        callback.apply(socket, args);
                    }
                });
            });
        }
    };
}]);
