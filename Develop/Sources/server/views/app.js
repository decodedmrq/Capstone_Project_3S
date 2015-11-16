/**
 * Created by hoanglvq on 9/22/15.
 */

/* Script */
angular.module('app', [
    'ui.router',
    'angular-jwt',
    'nemLogging',
    'uiGmapgoogle-maps',
	'smart-table'
]).constant("config",{

    role: {
        shipper: 1,
        store: 2,
        admin: 3
    },

    baseURI: "http://localhost:3000"

}).config(function($stateProvider,$urlRouterProvider,$httpProvider,jwtInterceptorProvider,uiGmapGoogleMapApiProvider,config){

     //Set up Routes

    $urlRouterProvider.otherwise('/error');

    $stateProvider

        .state('home',{
            url: '/home',
            template: '<h1>Home Page đang trong quá trình xây dựng !!!!</h1>',
        })

        .state('login',{
            url: '/auth/login',
            template: '<login></login>'
        })

        .state('register',{
            url: '/register',
            template: '<store-register></store-register>'
        })

        .state('error',{
            url: '/error',
            templateUrl: '/components/404/error.html'
        })

        .state('admin',{
            abstract: true,
            url: '/admin',
            template: '<admin></admin>',
            access: config.role.admin
        })

        .state('admin.dashboard',{
            url: '/dashboard',
            template: '<admin-layout></admin-layout>',
            access: config.role.admin
        })

        .state('admin.storeList',{
            url: '/storeList',
            template: '<admin-store-list></admin-store-list>',
            access: config.role.admin
        })

        .state('admin.assignTask',{
            url: '/assignTask',
            template: '<admin-assign-task></admin-assign-task>',
            access: config.role.admin
        })

        .state('admin.transactionHistory',{
            url: '/transactionHistory',
            template: '<admin-transaction-history></admin-transaction-history>',
            access: config.role.admin
        })

        .state('admin.taskList',{
            url: '/taskList',
            template: '<admin-task-list></admin-task-list>',
            access: config.role.admin
        })

        .state('admin.shipperList',{
            url: '/shipperList',
            template: '<admin-shipper-list></admin-shipper-list>',
            access: config.role.admin
        })

        .state('admin.orderList',{
            url: '/orderList',
            template: '<admin-order-list></admin-order-list>',
            access: config.role.admin
        })

        .state('admin.addShipper',{
            url: '/addShipper',
            template: '<admin-add-shipper></admin-add-shipper>',
            access: config.role.admin
        })

        .state('admin.issueBox',{
            url: '/issueBox',
            template: '<admin-issue-box></admin-issue-box>',
            access: config.role.admin
        })

        .state('admin.issueBox.content',{
            url: '/content?issueid',
            template: '<issue-content></issue-content>',
            //parent: 'admin.issueBox',
            access: config.role.admin
        })

        .state('admin.userDetail',{
            url: '/userDetail?username',
            template: '<admin-user-detail></admin-user-detail>',
            //parent: 'admin.issueBox',
            access: config.role.admin
        })

        .state('admin.storeDetail',{
            url: '/storeDetail?storeid',
            template: '<admin-store-detail></admin-store-detail>',
            //parent: 'admin.issueBox',
            access: config.role.admin
        })

        .state('admin.acceptStore',{
            url: '/acceptStore',
            template: '<admin-accept-store></admin-accept-store>',
            //parent: 'admin.issueBox',
            access: config.role.admin
        })

        .state('store',{
            abstract: true,
            url: '/store',
            template: '<store></store>',
            access: config.role.store
        })

        .state('store.dashboard',{
             url: '/dashboard',
             template: '<layout></layout>',
             controller: function($scope, $rootScope, mapService, authService){
                 var mode = "all";
                 $scope.shippers = mapService.getShipperMarkers(mode);
                 $scope.stores = mapService.getStoreMarkers(mode);
                 $scope.customers = mapService.getCustomerMarkers(mode);
                 $scope.orders = mapService.getOrders(mode);
                 $scope.center = {
                     latitude: authService.getCurrentInfoUser().stores[0].latitude,
                     longitude: authService.getCurrentInfoUser().stores[0].longitude
                 }
             },
            access: config.role.store
        })

        .state('store.order',{
            url: '/order',
            template: '<store-order></store-order>',
            access: config.role.store
        })

        .state('store.orderdetail',{
             url: '/orderdetail',
             template: '<store-order-detail-layout></store-order-detail-layout>',
             controller: function($scope, $rootScope, mapService, authService){
                 var mode = "all";
                 $scope.shippers = mapService.getShipperMarkers(mode);
                 $scope.stores = mapService.getStoreMarkers(mode);
                 $scope.customers = mapService.getCustomerMarkers(mode);
                 $scope.orders = mapService.getOrders(mode);
                 $scope.center = {
                     latitude: authService.getCurrentInfoUser().stores[0].latitude,
                     longitude: authService.getCurrentInfoUser().stores[0].longitude
                 }
             },
            access: config.role.store
        })

        .state('store.notification',{
            url: '/notification',
            template: '<notification-list></notification-list>',
            access: config.role.store
        })


    jwtInterceptorProvider.tokenGetter = function(){
        return localStorage.getItem('EHID');
    };

    $httpProvider.interceptors.push('jwtInterceptor');

    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyD8_7oskfESbIw6fpTmYG9h68cRONrjCPc',
        v  : '3.20',
        libraries: 'geometry,visualization,drawing,places'
    })

}).run(function($rootScope,$state,authService,config,socketStore,socketAdmin,socketShipper, config,socketService, notificationService){

    // Notification component
    $rootScope.numberNewNoti = notificationService.getNumberNewNotifications();
    $rootScope.readNewNoti = function() {

    };
    
    $rootScope.notify = function(notification) {
        $rootScope.numberNewNoti += 1;
        notificationService.setNumberNewNotifications($rootScope.numberNewNoti);
        //notificationService.addNotification(notification);
        var data = {
            life: 3000,
            horizontal: 'bottom',
            vertical: 'right',
            horizontalEdge: 'bottom',
            verticalEdge: 'right',
            theme: (notification.type === 'issue' ? 'danger' : 'success')
        };                
        var template = '<div class="btn globalNoti" onclick="location.href=\'' + notification.url + '\'">' +
                '<h4 style="color: white"><strong>' + notification.title + '</strong></h4>' +
                '<span style="color: white">' + notification.content + '</span>'
                '</div>';        
        $.notific8(template, data);
        $('.globalNoti').on('click', function() {
            console.log('click globalNoti');
        });
        //$rootScope.$apply();
    };
//he he

    if(authService.isLogged()){
        socketService.authenSocket()
        .then(function() {
            if(authService.isRightRole(config.role.admin)){
                socketAdmin.registerSocket();
                $state.go("admin.dashboard");
            }

            if(authService.isRightRole(config.role.store)){
                socketStore.registerSocket();
                $state.go("store.dashboard");

            }

             if(authService.isRightRole(config.role.shipper)){
                 socketShipper.registerSocket();
                 $state.go("mapdemo");

             }
        })        

    }else{

        $state.go("login");

    }

    $rootScope.$on('$stateChangeStart', function(event, toState, fromState, toParams) {

        if(toState.access){

            if(!authService.isLogged()){
                $state.go("login");
                event.preventDefault();

            }

            if(!authService.isRightRole(toState.access)){
                console.log("access");
                $state.go("error");
                event.preventDefault();

            }

        }

        if(toState.name == 'login'){

            if(authService.isLogged()){
                if(authService.isRightRole(config.role.admin)){
                    event.preventDefault();

                }
                if(authService.isRightRole(config.role.store)){
                    event.preventDefault();
                }
            }

        }

    });

    $rootScope.$on('$stateChangeSuccess', function(e, toState){
        // console.log(toState.name.indexOf("store"));
        if (toState.name == "login" || toState.name == "home" || toState.name == "error" || toState.name == "register"){
            $rootScope.styleBody = "full-lg";
        }else if(toState.name.indexOf("store") == 0){
            $rootScope.styleBody = "";
        }else{
            $rootScope.styleBody = "leftMenu nav-collapse";
        }

    });
})







