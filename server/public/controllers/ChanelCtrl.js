app.controller('ChanelCtrl', function($rootScope, $http, $scope, socket, UserService){

    $scope.message = [];
    $scope.userOnline = [];
    $scope.currentCustomer = {};
    $scope.customer = {};
    $scope.currentUser = UserService.getCurrentUser();

    socket.emit('nouveau_client', $scope.currentUser);

    socket.on('nouveau_client', function(user){

       $scope.userOnline.push(user);
       socket.on('logged', function(data){
           console.log('logged');
          // console.log(data)
           //Materialize.toast(data);
       });
    });
    $scope.valide = function() {
        socket.emit('message', $scope.currentCustomer.name);
        $scope.currentCustomer.name = "";
    };

    socket.on('message', function(data) {
        /*$scope.$apply(function () {
            $scope.currentCustomer.name.push(data.customer);
        });*/

     //   console.log(data);
         $scope.message.push(data);

    });

    socket.on("disconnect", function(user){
        //console.log(user)
        angular.forEach($scope.userOnline, function(value, key){
            console.log(value);
            if(value._id == user._id) {
                $scope.userOnline.splice(key, 1);
                console.log('bingo');
                //value.remove();
            }
        });
        console.log($scope.userOnline);
        console.log("client disconnected from server");
    });
});
