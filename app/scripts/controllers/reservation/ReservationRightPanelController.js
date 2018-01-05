(function (module) {
    cloudPOS.controllers = _.extend(module, {
        ReservationRightPanelController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                             uiConfigService, $http) {
        }
    });
    cloudPOS.ng.application.controller('ReservationRightPanelController', [
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
        cloudPOS.controllers.ReservationRightPanelController
    ]).run(function ($log) {
        $log.info("ReservationRightPanelController initialized");
    });
}(cloudPOS.controllers || {}));