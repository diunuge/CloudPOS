(function (module) {
    cloudPOS.controllers = _.extend(module, {
        FooterController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                               uiConfigService, $http) {
            scope.navBtnClick = function(event, btnName){
                $(event.target).addClass('active');
                $(event.target).siblings('.btn.btn-primary').removeClass('active');
                switch (btnName.toString())
                {
                    case 'order':
                        scope.navigateTo(scope.navPaths.home);
                        break;
                    case 'reservation':
                        scope.navigateTo(scope.navPaths.reservation);
                        break;
                    case 'report':
                        scope.navigateTo(scope.navPaths.report);
                        break;
                    case 'admin':
                        scope.navigateTo(scope.navPaths.admin);
                        break;
                    case 'wastage':
                        scope.navigateTo(scope.navPaths.wastage);
                        break;
                    default :
                        scope.navigateTo(scope.navPaths.home);
                }
            };

        }
    });
    cloudPOS.ng.application.controller('FooterController', [
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
        cloudPOS.controllers.FooterController
    ]).run(function ($log) {
        $log.info("FooterController initialized");
    });
}(cloudPOS.controllers || {}));