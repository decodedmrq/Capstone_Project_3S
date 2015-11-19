/**
 * Created by hoanglvq on 9/22/15.
 */

function adminController($scope,$state,$http,$q,$rootScope,config,socketService,authService){
    $scope.getUser = function(){
        console.log("get Users");
        return $http({
            url: config.baseURI + '/users',
            method: 'GET'
        }).then(function(data){
            $scope.data  = data;
        }).catch(function(error){
            console.log(error);
        });
    }

    $scope.signOut = function(){
        console.log("log out");
        socketService.disconnect();
        authService.signOut();
        $state.go("login");
    }

    $scope.$watch('$viewContentLoaded', function(event) {

        $('nav#menu-ver').mmenu({
            searchfield   :  false,
            slidingSubmenus	: false
        }).on( "closing.mm", function(){
            setTimeout(function () { closeSub() }, 200);
            function closeSub(){
                var nav=$('nav#menu-ver');
                nav.find("li").each(function(i) {
                    $(this).removeClass("mm-opened");
                });
            }
        });
        caplet();
    });
}

adminController.$inject = ['$scope','$state','$http','$q','$rootScope','config','socketService','authService'];
angular.module('app').controller('adminController',adminController);

