app.service('Auth', function($http, $rootScope) {
    return {
      register : function(datas)
      {
        return $http.post($rootScope.api+"/register", datas);
      },
      login : function(datas)
      {
        return $http.post($rootScope.api+"/login", datas);
      },
      isLogged : function(token)
      {
          return $http.post($rootScope.api+"/isLogged", token);
      }
    };
});
app.service('User', function($http, $rootScope) {
    return {
        update : function(datas)
        {
            /*return $http.put($rootScope.api+"/user/:id/edit", {
                params: {id: datas._id },
                data: datas
            });*/
            return $http.put($rootScope.api+"/user/edit", datas);
            //return $http.post($rootScope.api+"/isLogged", datas);

        }
    };
});
app.service('UserService', function(store) {
    var service = this,
        currentUser = null;

    service.setCurrentUser = function(user) {
        currentUser = user;
        store.set('user', user);
        return currentUser;
    };

    service.getCurrentUser = function() {
        if (!currentUser) {
            currentUser = store.get('user');
        }
        return currentUser;
    };

});
/*app.service('APIInterceptor', function($rootScope, UserService, $location) {
    var service = this;

    var token;

    service.request = function(config) {
        var currentUser = UserService.getCurrentUser(),
            token = currentUser ? currentUser.token : null;
            //console.log(currentUser);
           // var ok = Auth.isLogged({token: currentUser.token});
            //console.log(UserService.isLogged({token: currentUser.token}));

        if (token) {
            console.log(token);
            config.headers.Authorization = token;
        }
        return config;
    };
    service.responseError = function(response) {

        if (response.status == 403) {
            token.setToken();
            $location.path('/login');
        };

        return $q.reject(response);
    };

    return service;
});
*/