app.controller('RegisterCtrl', function($scope, $location, Auth, UserService)
{
///  console.log(UserService.getCurrentUser());
    $scope.subscribe = function() {

      var object = this.datas;
      Auth.register(object).success(function(response, status) {
        if (response.errors) {
            // Materialize.toast("Votre login est deja existant.", 3000);
            Materialize.toast("Veuillez bien remplir tout les champs.", 3000);
        }
        if (response.success) {
            Materialize.toast(response.success, 3000);
            $location.path("login");
        }
      /*    if (response.success) {
                Materialize.toast(response.success, 3000);
                $location.path("login");
          } else if(status == 200) {
                Materialize.toast(response.success, 3000);
                $location.path("login");
          } else {
            console.log("status " +status);
            if (status === 500) {
              Materialize.toast("Veuillez bien remplir tous les champs", 3000);
            }
            Materialize.toast(response.error, 3000);

          }*/

      }).error(function(data){
         console.log("Error : " + data);
      });

    }
});
app.controller('LoginCtrl', function( $scope, $location, Auth, UserService)
{
   $scope.login = function(username, password) {
      var datas = { username: username, password:password };
      Auth.login(datas).success(function(response){

          if (response.status == "error") {
              Materialize.toast(response.error, 3000);
          } else {
            var user = response;
            UserService.setCurrentUser(user);
            Materialize.toast("Bienvenue " + user.username, 3000);
            $location.path("channel");
          }
      });
   };
});
app.controller('ProfileCtrl', function($scope, $log, $location, UserService, User) {
    $scope.user = UserService.getCurrentUser();
    $scope.update = function () {
        var profile = this.profile;
        profile._id = $scope.user._id;
        User.update(profile).success(function(response) {
           console.log(response);
            if (response.success) {
                UserService.setCurrentUser(response.datas);
                Materialize.toast(response.success);
            }
        }).error(function(err) {
            console.log(err)
        })
    };
});

app.controller('LogoutCtrl', function($location, UserService, store, socket)
{
      UserService.setCurrentUser(null);
      store.remove('user');
        socket.emit("disconnect");
      $location.path("login");
      Materialize.toast('Vous êtes bien déconnecté', 3000);
});
