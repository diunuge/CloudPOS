(function (module) {
    cloudPOS.controllers = _.extend(module, {
        ReservationLeftPanelController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                             uiConfigService, $http) {
            scope.uiHandlers = new function() {
                this.resSelectTitle = function (evnt, title) {
                    $(evnt.target).siblings('button').removeClass('btn-primary');
                    $(evnt.target).siblings('button').addClass('btn-default');
                    $(evnt.target).addClass('btn-primary')
                };

                this.resSelectUserType = function (evnt, userType) {
                    $(evnt.target).siblings('button').removeClass('btn-primary');
                    $(evnt.target).siblings('button').addClass('btn-default');
                    $(evnt.target).addClass('btn-primary')
                };
            };
        }
    });
    cloudPOS.ng.application.controller('ReservationLeftPanelController', [
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
        cloudPOS.controllers.ReservationLeftPanelController
    ]).run(function ($log) {
        $log.info("ReservationLeftPanelController initialized");
    });
}(cloudPOS.controllers || {}));