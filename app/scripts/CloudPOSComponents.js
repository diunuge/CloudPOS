define(['Q', 'underscore', 'cloudPOS'], function (Q) {
    var components = {
        models: [
            'Langs'
        ],
        services: [
            'ResourceFactoryProvider',
            'HttpServiceProvider',
            'SessionManager',
            'UIConfigService',
            'CloudDaoService',
            'LoadingScreenService',
            'BrowserSessionManagerService',
            'BrowserInMemoryCacheManagerService',
            'UrlFactory',
            'DataAccessService',
            'TransactionHandlerService',
            'MasterDataStorageHandler',
            'CommonMessages',
            'BillCalculations',
            'BillCalculations02',
            'ObjectFactoryService',
            'ValidationService',
            'CommonAlertsService',
            'SystemSettings',
            'ReferenceDataService',
            'SystemInit'
        ],
        controllers: [
            'main/MainController',
            'login/LoginController',
            'footer/FooterController',
            'home/HomeController',
            'home/leftPanel/HomeLeftPanelController',
            'home/leftPanel/HomeLeftPanelPaymentController',
            'home/leftPanel/HomeLeftPanelReservationCheckInController',
            'home/leftPanel/HomeLeftPanelPricingController',
            'home/leftPanel/billDisplayPanel/BillDisplayPanelController',
            'home/leftPanel/guestCreationPanel/GuestCreationController',
            'home/leftPanel/HomeLeftPanelOrdersDisplayController',
            'home/rightPanel/HomeRightPanelController',
            'home/middlePanel/HomeMiddlePanelController',
            'home/middlePanel/newOrderPanel/NewOrderPanelController',
            'home/middlePanel/splitOrderPanel/SplitOrderPanelController',
            'home/middlePanel/discountPanel/DiscountPanelController',
            'home/middlePanel/multipleOptionsPanel/MultiplePaymentController',
            'home/middlePanel/multipleOptionsPanel/MultipleOptionsPanelController',
            'home/middlePanel/paymentPanel/PaymentPanelController',
            'order/OrderController',
            'order/OrderPanelLeftController',
            'order/OrderPanelMiddleController',
            'order/OrderPanelRightController',
            'order/panelLeft/OrderPanelLeftPaymentController',
            'order/panelLeft/OrderPanelLeftPaymentMainController',
            'order/panelLeft/panelLeft/SavePaymentPrintMenuController',
            'order/panelMiddle/topPanel/OrderPanelMiddleSubPanelNewOrderController',
            'order/panelMiddle/topPanel/OrderPanelMiddleSubPanelOrderController',
            'order/panelMiddle/topPanel/OrderPanelMiddleSubPanelSplitController',
            'order/panelMiddle/topPanel/subPanelOrder/OrderPanelMiddleSubPanelOrderFilteredItemsController',
            'order/panelMiddle/topPanel/subPanelOrder/OrderPanelMiddleSubPanelOrderHorizontalMenuBarController',
            'order/panelMiddle/topPanel/subPanelOrder/OrderPanelMiddleSubPanelOrderVerticalMenuBarController',
            'order/panelMiddle/topPanel/subPanelOrder/filteredItems/OrderPanelMiddleSubPanelOrderFilteredItemsGuestsBarController',
            'order/panelMiddle/topPanel/subPanelSplit/OrderPanelMiddleSubPanelSplitLeftPanelController',
            'order/panelMiddle/topPanel/subPanelSplit/OrderPanelMiddleSubPanelSplitRightPanelController',
            'order/panelMiddle/topPanel/subPanelSplit/OrderPanelMiddleSubPanelSplitTopMenuController',
            'order/panelRight/OrderPanelRightFilteredItemsController',
            'order/panelRight/OrderPanelRightOptionsController',
            'reservation/ReservationController',
            'reservation/ReservationLeftPanelController',
            'reservation/ReservationRightPanelController',
            'wastage/WastageController',
            'wastage/WastageLeftPanelController',
            'wastage/WastageRightPanelController',
            'wastage/rightPanel/WastageRightPanelTopPanelController',
            'wastage/rightPanel/WastageRightPanelBottomPanelController',
            'admin/AdminController',
            'admin/MasterDataManagementController',
            'admin/TaxManagementController',
            'admin/masterDataManagement/MasterDataFoodMgController',
            'admin/masterDataManagement/FoodClassificationMgController',
            'admin/masterDataManagement/FoodSubCategoryMgController',
            'admin/UserManagementController',
            'report/ReportController',
            'header/HeaderController'
        ],
        filters: [
        ],
        directives: [
            'CommonMenuBarDirective',
            'GuestMenuBarDirective',
            'HorizontalScrollMenuBarDirective',
            'VerticalScrollMenuBarDirective',
            'RadioButtonGroupDirective',
            'SideListBoxDirective',
            'GuestSelectionBarDirective',
            'DiningReservationPanelDirective',
            'UsersSelectionDirective',
            'OrderDetailRemovalPanelDirective',
            'PermissionRetrievalDialogBoxDirective',
            'TaxDiscountModelBoxDirective',
            'FoodRemarksSelectionPanelDirective',
            'NumericKeyPadDirective',
            'PermissionRetrievalDirective',
            'InputValidationDirective'
        ]
    };

    return function() {
        var defer = Q.defer();
        require(_.reduce(_.keys(components), function (list, group) {
            return list.concat(_.map(components[group], function (name) {
                return group + "/" + name;
            }));
        }, [
            'routes',
            'initialTasks',
            'webstorage-configuration'
        ]), function(){
            defer.resolve();
        });
        return defer.promise;
    }
});
