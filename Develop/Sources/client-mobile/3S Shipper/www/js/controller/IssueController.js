/**
 * Created by Kaka Hoang Huy on 9/30/2015.
 */
app.controller('IssueCtrl',['$scope','$ionicPopup', 'dataService', '$ionicLoading', 'socketShipper', function ($scope, $ionicPopup, dataFactory, $ionicLoading, socketShipper) {

    console.log('get and save message sharing at IssueController');
    getAllTaskOfShipper();

/*
 * By QuyenNV - 23/10/2015
 * This function get all task of shipper
 * */
  function getAllTaskOfShipper() {
    //get all tasks of shipper
    var urlBase = config.hostServer + "api/tasks";
    dataFactory.getDataServer(urlBase)
      .success(function (rs) {
        formatData(rs);
      })
      .error(function (error) {
        console.log('Unable to load customer data: ' + error);
      });
  }

/*
 * By QuyenNV - 23/10/2015
 *
 * This function is format data respon from from server
 * @param: rs
 * */
  function formatData(rs) {
    $scope.listOrderActive = [];
    var listOrderInactive = [];
    if (undefined !== rs['Pickup'] && rs['Pickup'].length) {
      rs['Pickup'].forEach(function(item) {
        //statusid = 2, Active status of task
        if (item.isPending == false && item.statusid == 2) {
          $scope.listOrderActive.push({
            'val': item.orderid,
            'text': item.orderid
          });
        }
        listOrderInactive.push({
          'val': item.orderid,
          'text': item.orderid
        });
      });
    }
    if (undefined !== rs['Ship'] && rs['Ship'].length) {
      rs['Ship'].forEach(function(item) {
        //statusid = 2, Active status of task
        if (item.isPending == false && item.statusid == 2) {
          $scope.listOrderActive.push({
            'val': item.orderid,
            'text': item.orderid
          });
        }
        listOrderInactive.push({
          'val': item.orderid,
          'text': item.orderid
        });
      });
    }
    if (undefined !== rs['Express'] && rs['Express'].length) {
      rs['Express'].forEach(function(item) {
        //statusid = 2, Active status of task
        if (item.isPending == false && item.statusid == 2) {
          $scope.listOrderActive.push({
            'val': item.orderid,
            'text': item.orderid
          });
        }
        listOrderInactive.push({
          'val': item.orderid,
          'text': item.orderid
        });
      });
    }
    if (undefined !== rs['Return'] && rs['Return'].length) {
      rs['Return'].forEach(function(item) {
        //statusid = 2, Active status of task
        if (item.isPending == false && item.statusid == 2) {
          $scope.listOrderActive.push({
            'val': item.orderid,
            'text': item.orderid
          });
        }
        listOrderInactive.push({
          'val': item.orderid,
          'text': item.orderid
        });
      });
    }
    //Fill to "Order" dropdown list
    $scope.selectable = listOrderInactive;
  }

  //Fill to "Type" dropdown list
  $scope.issueCategories = [
    {categoryID: '1', categoryName: 'Pending' },
    {categoryID: '2', categoryName: 'Cancel' }
  ];
$scope.listReasons = [
  {typeID: '1', categoryID: '1', typeName: 'Traffic jam' },
  {typeID: '2', categoryID: '1', typeName: 'Vehicle' },
  {typeID: '3', categoryID: '1', typeName: 'Accident' },
  {typeID: '6', categoryID: '1', typeName: 'Other' },
  {typeID: '4', categoryID: '2', typeName: 'Goods is broken' },
  {typeID: '5', categoryID: '2', typeName: 'Cannot contact with customer' }
  //{typeID: '7', categoryID: '2', typeName: 'Other' }
];
  $scope.pendingReasons = [
    {typeID: '1', categoryID: '1', typeName: 'Traffic jam' },
    {typeID: '2', categoryID: '1', typeName: 'Vehicle' },
    {typeID: '3', categoryID: '1', typeName: 'Accident' },
    {typeID: '6', categoryID: '1', typeName: 'Other' },
  ];
  $scope.cancelReasons = [
    {typeID: '4', categoryID: '2', typeName: 'Goods is broken' },
    {typeID: '5', categoryID: '2', typeName: 'Cannot contact with customer' },
    {typeID: '7', categoryID: '2', typeName: 'Other' }
  ];

  //Item lable display
  $scope.parseMulti = function(items){
    if(items){
      return items.map(function(item){ return item.text; }).join(', ');
    }
  };
//START Alert Dialog
  $scope.showAlert = function(des) {
    var alertPopup = $ionicPopup.alert({
      title: 'Information',
      template: des.content
    });
    alertPopup.then(function(res) {
      if (des.id === 1) {
        $scope.show();
      } else {
        $ionicLoading.hide();
      }
    });
  };
  //END Alert Dialog

  /*
   * By QuyenNV - 1/11/2015
   * ChangePending of order
   * */
  $scope.changeIsPendingOrder = function (issueId) {
    //Change ispending of Task
    var data = {'issueId': issueId};
    var urlBase = config.hostServer + "api/changeIsPendingOrder";
    dataFactory.putDataServer(urlBase, data)
      .success(function (rs) {
        $ionicLoading.hide();
        $scope.showAlert(rs);
      })
      .error(function (error) {
        console.log('Unable to load customer data: ' + error);
      });
  }

  /*
   * By QuyenNV - 24/10/2015
   *
   * This function submit
   * @param: issue
   * */
  $scope.submitData = function (issue) {
    //Validation
      if ( typeof issue === "undefined" || issue.category === null || typeof issue.category === "undefined") {
        $ionicPopup.alert({
          title: 'Information',
          content: 'Please choose Type !'
        }).then(function(res) {
        });
      } else if (issue.type === null || typeof issue.type === "undefined") {
        $ionicPopup.alert({
          title: 'Information',
          content: 'Please choose Reason !'
        }).then(function(res) {
        });
      } else if (issue.category.categoryID != 1 && typeof issue.issuedOrder === "undefined") {
        $ionicPopup.alert({
          title: 'Information',
          content: 'Please choose Order !'
        }).then(function(res) {
        });
      } else if (typeof issue.description === "undefined" || issue.description === "") {
        $ionicPopup.alert({
          title: 'Information',
          content: 'Please write Content !'
        }).then(function(res) {
        });
      } else {
        //post an API
        var listOrders = [];
        //Pending: All order will sent
        if (issue.category.categoryID == 1) {
          //$scope.listOrders
          listOrders = $scope.listOrderActive;
          if (listOrders <= 0) {
            $ionicPopup.alert({
              title: 'Information',
              content: "You don't have task is actived"
            }).then(function(res) {
            });
          }
        } else {
          //Cancel
          listOrders = issue.issuedOrder;
        }
        //List issuedOrder
        var listPostOrders = [];
        listOrders.forEach(function(item){
          listPostOrders.push(item.text);
        });
        ////New Issue
        var newIssue = {};
        newIssue.typeid = issue.type.typeID;
        newIssue.description = issue.description;
        var data = [];
        data.push({
          'orders': listPostOrders,
          'issue': newIssue,
          'categoryissue': issue.category.categoryID
        });
        console.log('data', data);
        var urlCreateBase = config.hostServer + 'api/issue';
        dataFactory.postDataServer(urlCreateBase, data)
          .success(function (rs) {
            //socket
            //TODO Send (listOrders)
            //rs[0].issueid;
            socketShipper.sendInfoOfIssue(rs[0].issueid);
            $ionicPopup.alert({
              title: 'Success',
              content: 'Your Issue is sent to Admin'
            }).then(function(res) {
              //console.log('RS', rs);
              //Pass to function changeIsPendingOrder
              $scope.issueId = rs[0].issueid;
              //Show ionic Loading
              $scope.isBackdropShowing = false;
              $scope.show = function(){
                $ionicLoading.show({
                  templateUrl: 'loading.html',
                  scope: $scope
                });
              };
              //1 is Pending
              if (rs[0].catissue == 1) {
                console.log('here here');
                $scope.show();
              }
              //TODO Del order choosed in issuedOrder array for 'Cancel Order' cause
              //var delIndex;
              //issue.issuedOrder.forEach(function(item) {
              //  $scope.selectable.forEach(function(i) {
              //    if (i.val === item.val) {
              //      delIndex = $scope.selectable.indexOf(i);
              //      if (delIndex != -1) {
              //        $scope.selectable.splice(delIndex, 1);
              //      }
              //    }
              //  });
              //});
              //reset values
              issue.description = '';
              issue.category = null;
              issue.type = null;
              issue.issuedOrder = [];
            });
          })
          .error(function (error) {
            console.log('Unable to load customer data: ' + error);
          });
      }
  }
}]);


