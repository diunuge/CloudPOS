(function (module) {
    cloudPOS.controllers = _.extend(module, {
        HomeMiddlePanelController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                           uiConfigService, $http, CloudDaoService, filterFilter) {

            /// UI handlers goes here.
            /// UiHandlers global object
            /// scope.UiHandlers = {HomePageUi: {}};

            /// MiddlePanel ui handlers
            scope.UiHandlers.HomePageUi.MiddlePanel = {
            };

            /// Handles data manipulations
            scope.HomeDataModule.MiddlePanel = {

                /// Add OrderDetail to an order
                AddOrderDetail: function (orderDetail) {
                    scope.HomeDataModule.AddNewOrderDetail(orderDetail);
                }
            };
        }
    });
    cloudPOS.ng.application.controller('HomeMiddlePanelController', [
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
        'filterFilter',
        cloudPOS.controllers.HomeMiddlePanelController
    ]).run(function ($log) {
        $log.info("HomeMiddlePanelController initialized");
    });
}(cloudPOS.controllers || {}));
