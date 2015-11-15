/**
 * Created by khanhkc on 9/22/15.
 */

function storeOrderController($scope, $state, dataService, config) {
    getStoreName();
    getProvince ();
    $scope.order={
        gatheringCode: GenerateRandomCode(6),
        deliverCode: GenerateRandomCode(6),
        inStockCode : GenerateRandomCode(6),
        returnStoreCode : GenerateRandomCode(6),
        storeid: '',
        ordertypeid: "1",
        pickupaddress: '',
        pickupphone: '',
        deliveryaddress: '',
        pickupdate: '',
        deliverydate: '',
        recipientphone: '',
        recipientname: '',
        ledgerid: '',
        statusid: '1',
        isdraff: false,
        fee: 10000,
        cod:'',
        overWeightFee: 0
    };
    var bigestGoodId = 0;
    $scope.good={};
    $scope.goods =[];
    $scope.houseNumber="";


    $scope.$watch('$viewContentLoaded', function (event) {
        caplet();

        ///////////////////////////////////////////////////
        //////////....Animation for wizard..../////////////
        ///////////////////////////////////////////////////
        $(document).ready(function () {

            $('#validate-wizard').bootstrapWizard({
                tabClass: "nav-wizard",
                ////////////////////////////////////////////////
                /////////////Validate when click submit/////////
                ////////////////////////////////////////////////
                /*
                 onNext: function (tab, navigation, index) {
                 console.log(index);
                 if (index == 3)
                 {
                 var tab = $('#step' + index);

                 var valid = true;
                 //if (!valid) onTabShow()
                 valid = $('#step1').parsley('validate') && valid;
                 valid = $('#step2').parsley('validate') && valid;
                 valid = $('#step3').parsley('validate') && valid;
                 console.log(valid);
                 if (!valid) {
                 //onTabShow(tab, navigation, i);
                 // $('#step' + i).addClass('active');
                 // $('#step3').removeClass('active');
                 // tab.prevAll().addClass('completed');
                 //    tab.nextAll().removeClass('completed');
                 //    if (tab.hasClass("active")) {
                 //        tab.removeClass('completed');
                 //    }
                 return false;
                 }else{
                 postCompleteOrder ();
                 }



                 // Set the name for the next tab
                 $('#step4 h3').find("span").html($('#fullname').val());

                 }
                 }, */
                ////Validate when click submit/////

                onNext: function(tab, navigation, index) {
                    if(index==1){
                        var content=$('#step'+index);
                        //console.log(content) ;
                        if(typeof  content.attr("parsley-validate") != 'undefined'){
                            var $valid = content.parsley( 'validate' );
                            if(!$valid ){
                                return false;
                            }

                        }
                    }
                    if(index==2){
                        var content=$('#step'+index);
                        //console.log(content) ;
                        if(typeof  content.attr("parsley-validate") != 'undefined'){
                            var $valid = content.parsley( 'validate' );
                            if(!$valid){
                                return false;
                            }else if($scope.goods.length==0){
                                alertEmptyGood();
                                return false;
                            }
                        }
                    }
                    if(index==3){
                        // console.log(content) ;
                        postCompleteOrder ();
                    }


                    // Set the name for the next tab
                    $('#step4 h3').find("span").html($('#fullname').val());
                },
                onTabClick: function (tab, navigation, index) {
                    $.notific8('Please click <strong>next button</strong> to wizard next step!! ', {
                        life: 5000,
                        theme: "danger",
                        heading: " Wizard Tip :); "
                    });
                    return false;
                },
                onTabShow: function (tab, navigation, index) {
                    tab.prevAll().addClass('completed');
                    tab.nextAll().removeClass('completed');
                    if (tab.hasClass("active")) {
                        tab.removeClass('completed');
                    }
                    var $total = navigation.find('li').length;
                    var $current = index + 1;
                    var $percent = ($current / $total) * 100;
                    $('#validate-wizard').find('.progress-bar').css({width: $percent + '%'});
                    $('#validate-wizard').find('.wizard-status span').html($current + " / " + $total);
                }
            });

            //////////////////////////////////////
            //////// Validate Add Modal///////////
            //////////////////////////////////////
            $("#addGoodModal").submit(function(e){
                e.preventDefault();
                if($(this).parsley( 'validate' )){
                    addGood();
                    $scope.order.overWeightFee = calculateOverWeightFee($scope.selectedDistrict.districtid,$scope.goods);
                    $scope.$apply();                                    
                    $('#md-add-good').modal('hide');
                }
            });

            //iCheck[components] validate
            $('input').on('ifChanged', function(event){
                $(event.target).parsley( 'validate' );
            });
            //Validate Add Modal//


            //////////////////////////////////////
            //////// Validate Edit Modal///////////
            //////////////////////////////////////
            $("#editGoodModal").submit(function(e){
                e.preventDefault();
                if($(this).parsley( 'validate' )){
                    editGood();
                    $scope.order.overWeightFee = calculateOverWeightFee($scope.selectedDistrict.districtid,$scope.goods);
                    $scope.$apply(); 
                    $('#md-edit-good').modal('hide');
                }

            });

            //iCheck[components] validate
            $('input').on('ifChanged', function(event){
                $(event.target).parsley( 'validate' );
            });
            ///Validate edit Modal//////

            // handleStatusChanged();

        });


        ///////////////////////////////////////////////////
        //....Disable textbox when click on checkbox....///
        ///////////////////////////////////////////////////
        // function handleStatusChanged() {
        //     $('#enElementCb').on('change', function () {
        //         if (!$('#enElementCb').is(':checked')) {
        //             $('#elementsToEn :input').attr('disabled', true);
        //         } else {
        //             $('#elementsToEn :input').removeAttr('disabled');
        //         }
        //     });
        // }
    });

    $scope.newGood = {};
    var index;
    $scope.setGood = function(good,index){
        //console.log("=======goods[]=khi click edit====",$scope.goods);
        $scope.newGood = (JSON.parse(JSON.stringify(good)));
        index = index;
    };

    $scope.refreshGood = function(){
        $scope.good ={};
    }

    function editGood () {
        for(var i = 0; i < $scope.goods.length;i++){
            if( $scope.goods[i].goodID===$scope.newGood.goodID){
                $scope.goods[i] = $scope.newGood;
            }

        }
        $scope.$apply();

    }

    function addGood(){
        $scope.good.goodID = bigestGoodId;
        $scope.goods.push($scope.good);
        $scope.$apply();
        bigestGoodId++;
        //console.log("=======goods[]=sau khi add====",$scope.goods);
    };

    $scope.deleteGood = function(){
        $scope.goods.splice(index,1);
    };

    $scope.postDraff = function(){
        var urlBase = config.baseURI + '/orders';
        $scope.order.isdraff = true;
        var data = {
            order: $scope.order,
            goods : $scope.goods,
        };
        //console.log("================data===============",data);
        dataService.postDataServer(urlBase,data);

    };
    function postCompleteOrder (){
        var urlBase = config.baseURI + '/orders';
        $scope.order.isdraff = false;
        var data = {
            order: $scope.order,
            goods : $scope.goods,
            selectedDistrict: $scope.selectedDistrict.districtid
        };
        //console.log("==============data=========",data);
        dataService.postDataServer(urlBase,data).then(function(rs){
            console.log("OK",rs);
        },function(er){
            console.log("!OK",er);
        });

    }          
    function caculatateWeight(listGoods){
        var totalWeight = 0;
        for(var i = 0; i <listGoods.length;i++){
            totalWeight = totalWeight + listGoods[i].weight*listGoods[i].amount;
        }
        //console.log("=============totalWeight=======",totalWeight);
        return totalWeight;

    }

    function calculateOverWeightFee(districtId,listGoods){
        var totalWeight = caculatateWeight(listGoods);
        var overWeightFee = 0;
        var listInDistrictId =["001","002","003","005","006","007","008","009"];
        if(totalWeight > 4000 ){
            if(listInDistrictId.indexOf(districtId)>-1){
                console.log("=============IN=======",districtId);
                overWeightFee = (totalWeight - 4000)*2*2;
            }else {
                console.log("=============out=======",districtId);
                overWeightFee = (totalWeight - 4000)*2*2.5;
            }
            
        }
        console.log("=============totalWeight=======",totalWeight);
        console.log("=============overWeightFee=======",overWeightFee);
        return overWeightFee;        
    }

    function calculateFee(districtId,deliveryType){
        var fee = 0;
        var listInDistrictId =["001","002","003","005","006","007","008","009"];
        if(listInDistrictId.indexOf(districtId)> -1){
            if(deliveryType == '1'){
                fee = 10000;
            }else {
                fee = 20000;
            }                
        }else {
            if(deliveryType == '1'){
                fee = 20000;
            }else {
                fee = 30000;
            }       
        }
        //console.log("=============districtId=======",districtId);
        //console.log("=============deliveryType=======",deliveryType);
        //console.log("=============fee=======",fee);
        return fee;
    }

    $scope.updateFee = function(){
        $scope.order.fee = calculateFee($scope.selectedDistrict,$scope.order.ordertypeid);
    }


    function GenerateRandomCode(length){
        var code = "";
        var chars = "123456789";
        for( var i=0; i < length; i++ )
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        return code;
    }

    function getStoreName(){
        var urlBase = config.baseURI + '/api/getAllStoreName';
        dataService.getDataServer(urlBase)
            .success(function (rs) {
                $scope.stores = rs;
                //console.log("=======Store=========",rs);
                $scope.order.storeid = $scope.stores[0].storeid;
                $scope.order.pickupaddress = $scope.stores[0].address;
                $scope.order.pickupphone = $scope.stores[0].phonenumber;
                $scope.selectedStore =  $scope.stores[0];
            })
            .error(function (error) {
                console.log('Unable to load store name: ' + error);
            });
    }
    $scope.listProvince = []    
    function getProvince () {
        var urlBase = config.baseURI + '/api/getProvince';
        dataService.getDataServer(urlBase)
            .success(function (rs) {                
                $scope.addressDB = rs;
                //console.log("========Adress========",rs);
                //$scope.listProvince = $scope.addressDB;
                $scope.listProvince = $scope.addressDB.slice(0,1);
                $scope.selectedProvince = $scope.listProvince[0];
               // console.log("========Province========",$scope.selectedProvince);

                $scope.listDistrict = $scope.selectedProvince.districts;
                $scope.selectedDistrict = $scope.listDistrict[0];
                //console.log("========district========", $scope.selectedDistrict);

                $scope.listWard = $scope.selectedDistrict.wards;
                $scope.selectedWard = $scope.listWard[0];
                updateDeliveryAdd();
            })
            .error(function (error) {
                console.log('Unable to load province: ' + error);
            });
    }

        $scope.updateDistrict= function(){

        $scope.selectedProvince;
        $scope.listDistrict = $scope.selectedProvince.districts;
        $scope.selectedDistrict = $scope.listDistrict[0];
        //console.log("========district========", $scope.selectedDistrict);

        $scope.listWard = $scope.selectedDistrict.wards;
        $scope.selectedWard = $scope.listWard[0];

        updateDeliveryAdd();
    }
     $scope.updateWard= function(){

        $scope.selectedDistrict;
        //console.log("========district========", $scope.selectedDistrict);
        $scope.listWard = $scope.selectedDistrict.wards;
        $scope.selectedWard = $scope.listWard[0];
        updateDeliveryAdd();
        $scope.order.fee = calculateFee($scope.selectedDistrict.districtid,$scope.order.ordertypeid);
        
     }
     $scope.updateDeliveryAdd = function(){
        updateDeliveryAdd();
     }

     function updateDeliveryAdd(){
        $scope.order.deliveryaddress = $scope.houseNumber + ", " + $scope.selectedWard.name + ", " + $scope.selectedDistrict.name + ", " + $scope.selectedProvince.name;        
     } 

    function alertEmptyGood() {
        var data = new Object();
        data.verticalEdge = 'right';
        data.horizontalEdge = 'bottom';
        data.theme = 'theme';
        $.notific8($("#smsEmptyGood").val(), data);       
    }



}


storeOrderController.$inject = ['$scope', '$state', 'dataService', 'config'];
angular.module('app').controller('storeOrderController', storeOrderController);

