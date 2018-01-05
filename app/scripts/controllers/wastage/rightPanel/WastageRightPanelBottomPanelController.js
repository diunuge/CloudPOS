(function (module) {
    cloudPOS.controllers = _.extend(module, {
        WastageRightPanelBottomPanelController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                             uiConfigService, $http) {
            scope.uiHandlers.foodItemClick = function(evnt, itemId) {
                $(evnt.target).siblings(evnt.target.tagName).removeClass("active");
                $(evnt.target).addClass("active");
                scope.uiHandlers.selectedFoodItemId = itemId;
            };
        }
    });
    cloudPOS.ng.application.controller('WastageRightPanelBottomPanelController', [
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
        cloudPOS.controllers.WastageRightPanelBottomPanelController
    ]).run(function ($log) {
        $log.info("WastageRightPanelBottomPanelController initialized");
    });
}(cloudPOS.controllers || {}));
