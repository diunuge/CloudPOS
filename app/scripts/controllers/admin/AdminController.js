(function (module) {
    cloudPOS.controllers = _.extend(module, {
        AdminController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                                          uiConfigService, $http, CloudDaoService) {
            scope.uiHandlers = (function(uiHandlers){
                uiHandlers.adminSubPanelsUrl =
                {
                    cancelAdvDepositView: "views/admin/admin/rightPanel/cancelAdvDepositView.html",
                    cancelPaymentView: "views/admin/admin/rightPanel/cancelPaymentView.html",
                    cashDropView: "views/admin/admin/rightPanel/cashDropView.html",
                    dayEndView: "views/admin/admin/rightPanel/dayEndView.html",
                    drawerOpenView: "views/admin/admin/rightPanel/drawerOpenView.html",
                    kotReprintView: "views/admin/admin/rightPanel/kotReprintView.html",
                    printerResetView: "views/admin/admin/rightPanel/printerResetView.html",
                    receiptReprintView: "views/admin/admin/rightPanel/receiptReprintView.html",
                    reportReprintView: "views/admin/admin/rightPanel/reportReprintView.html",
                    shiftManagementView: "views/admin/admin/rightPanel/shiftManagementView.html",
                    userUnlockView: "views/admin/admin/rightPanel/userUnlockView.html",
                    waiterAllocationView: "views/admin/admin/rightPanel/waiterAllocationView.html",
                    userManagement: "views/admin/admin/rightPanel/userManagementView.html",
                    inventoryManagement: "views/admin/admin/rightPanel/masterDataManagementView.html",
                    taxManagement: "views/admin/admin/rightPanel/taxManagement.html"
                };

                uiHandlers.adminSubPanelCurrentPanel = uiHandlers.adminSubPanelsUrl.cancelAdvDepositView;
                uiHandlers.adminSubPanelOnClick = function(evnt, panelName) {
                    if(uiHandlers.adminSubPanelCurrentPanel[panelName]) {return -1;}
                    uiHandlers.adminSubPanelCurrentPanel = uiHandlers.adminSubPanelsUrl[panelName];
                };
                return uiHandlers;
            })(scope.uiHandlers || {});
        }
    });
    cloudPOS.ng.application.controller('AdminController', [
        '$scope',
        '$location',
        'SessionManager',
        '$translate',
        '$rootScope',
        'localStorageService',
        'keyboardManager',
        '$idle',
        'tmhDynamicLocale',
        'UIConfigService',
        '$http',
        'CloudDaoService',
        cloudPOS.controllers.AdminController
    ]).run(function ($log) {
        $log.info("AdminController initialized");
    });
}(cloudPOS.controllers || {}));
