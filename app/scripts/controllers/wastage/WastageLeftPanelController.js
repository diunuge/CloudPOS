(function (module) {
    cloudPOS.controllers = _.extend(module, {
        WastageLeftPanelController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                             uiConfigService, $http) {

            /// Used for ui handling purposes
            scope.uiHandlers = {

            };
        }
    });
    cloudPOS.ng.application.controller('WastageLeftPanelController', [
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
        cloudPOS.controllers.WastageLeftPanelController
    ]).run(function ($log) {
        $log.info("WastageLeftPanelController initialized");
    });
}(cloudPOS.controllers || {}));