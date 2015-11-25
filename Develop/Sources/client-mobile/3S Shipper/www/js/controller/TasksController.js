/**
 * Created by Nguyen Van Quyen on 10/6/2015.
 */
app.controller('TasksCtrl', ['$rootScope', '$scope', 'dataService', '$ionicLoading', '$ionicPopup', '$timeout', function($rootScope, $scope, dataFactory, $ionicLoading, $ionicPopup, $timeout) {

  console.log('Reload Data TaskController');
  var haveIssue = false;
  getAllTaskBeIssued();
  getListOfTask();

  $rootScope.$on("shipper:express:order:success", function(event, args) {
    var des = {
      id: 999,
      content: 'Your Task is resolved'
    };
    $scope.showAlert(des);
  });

  $scope.$on("issue:resolve", function (event, args) {
    //Continue not show this
    if (args.type !== 1 && args.type !== 2 && args.type !== 3 && args.type !== 6 && args.type !== 8) {
      var des = {
        id: 999,
        content: 'Your Task is resolved'
      };
      $scope.showAlert(des);
    }
  });

  //TODO: Select tab for find bestway screen
  //$scope.tabSelected = function(tab) {
  //  $scope.tabParam = tab;
  //  if (typeof $scope.tabParam === "undefined" || $scope.tabParam === "") {
  //    $scope.tabParam = "all";
  //  }
  //};

  //START Show IonicLoading
  $scope.showLoading = function(){
    $ionicLoading.show({
      scope: $scope,
      templateUrl: 'loading.html',
      noBackdrop: false,
      delay: 250
    });
  };
  //END Show IonicLoading

  //START Alert Dialog
  $scope.showAlert = function(des) {
    var alertPopup = $ionicPopup.alert({
      title: 'Information',
      template: des.content
    });
    alertPopup.then(function(res) {
      //Cause:Pending
      if (des.id === 1) {
        $scope.showLoading();
      } else {
        //TODO
        haveIssue = false;
        console.log("111");
        getListOfTask();
        $ionicLoading.hide();
      }
    });
  };
  //END Alert Dialog

  /*
   * By QuyenNV - 1/11/2015
   * Get All Task of Shipper be issued(issue.isResolved = false or order.isPending = true).
   * To check to show 'continue screen'
   * */
  function getAllTaskBeIssued() {
    //Get task be an issue
    var urlTaskBase = config.hostServer + "api/shipper/getTaskBeIssuePending";
    dataFactory.getDataServer(urlTaskBase)
      .then(function(res){
        var rs = res.data;
        if (rs !== "null" || typeof rs !== "undefined") {
          for ( var property in rs ) {
            $scope.issueId = property;
            $scope.isResolved = rs[property][0].isresolved;
          }
          if (typeof $scope.issueId !== "undefined" || $scope.isResolved == true) {
            haveIssue = true;
            //show ionicLoading
            $scope.showLoading();
          }
        } else {
          //hide ionicLoading
          $ionicLoading.hide();
        }
      }, function(error) {
        console.log('Unable to load customer data: ' + error);
        if(error.status == 401) dataFactory.signOutWhenTokenFail()
      });
  }

  /*
   * By QuyenNV - 1/11/2015
   * ChangePending of order
   * */
  $scope.changeIsPending = function (issueId) {
    //Change ispending of Task
    var data = {'issueId': issueId};
      var urlBase = config.hostServer + "api/changeIsPendingOrder";
        dataFactory.putDataServer(urlBase, data)
        .then(function (res) {
          var rs = res.data;
          console.log('success changeIsPending');
          $ionicLoading.hide();
          $timeout(function(){
            $scope.showAlert(rs);
          }, 250);
        }, function (error) {
            console.log('Unable to load customer data: ' + error);
            if(error.status == 401) dataFactory.signOutWhenTokenFail()
          });
    };

  /*
   * By QuyenNV - 23/10/2015
   * Get all task of shipper with current date and
   * StatusTasks are 'Inactive' and 'Active'
   * */
  function getListOfTask() {
    if (!haveIssue) {
      $ionicLoading.show({
        noBackdrop: false,
        template: '<ion-spinner icon="bubbles" class="spinner-balanced"/>'
      });
    }
    var urlBase = config.hostServer + "api/tasks";
    dataFactory.getDataServer(urlBase)
      .then(function (res) {
        var rs = res.data;
        formatData(rs);
        //Hide IonicLoading without Issue Pending
        if (!haveIssue) {
          $ionicLoading.hide();
        }
      },function (error) {
        console.log('Unable to load customer data: ' + error);
        $ionicLoading.hide();
        if(error.status == 401) dataFactory.signOutWhenTokenFail()
      })
  }

  /*
   * By QuyenNV - 23/10/2015
   * This function is format data respon from from server
   * @param: rs
   * */
  function formatData(rs) {
    if (undefined !== rs['Pickup'] && rs['Pickup'].length) {
      isIssued(rs['Pickup']);
      $scope.pickupTasks = rs['Pickup'];
      $scope.badgeCountPick = rs['Pickup'].length;
    } else {
      $scope.pickupTasks = [];
      $scope.badgeCountPick = 0;
    }
    if (undefined !== rs['Ship'] && rs['Ship'].length) {
      isIssued(rs['Ship']);
      $scope.shipTasks = rs['Ship'];
      $scope.badgeCountShip = rs['Ship'].length;
    } else {
      $scope.shipTasks = [];
      $scope.badgeCountShip = 0;
    }
    if (undefined !== rs['Express'] && rs['Express'].length) {
      isIssued(rs['Express']);
      $scope.expressTasks = rs['Express'];
      $scope.badgeCountExpress = rs['Express'].length;
    } else {
      $scope.expressTasks = [];
      $scope.badgeCountExpress = 0;
    }
    if (undefined !== rs['Return'] && rs['Return'].length) {
      isIssued(rs['Return']);
      $scope.returnTasks = rs['Return'];
      $scope.badgeCountReturn = rs['Return'].length;
    } else {
      $scope.returnTasks = [];
      $scope.badgeCountReturn = 0;
    }
  }

  /*
   * By QuyenNV - 23/10/2015
   * This function is check task get an issued
   * @param: list
   * */
   function isIssued(list) {
       list.forEach(function(item) {
         //processing
         if (item.statusid == 4) {
             item['iscancel'] = true;
         } else {
           item['iscancel'] = false;
         }
       });
   }
}]);
