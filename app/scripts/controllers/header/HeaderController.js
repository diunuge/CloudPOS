(function (module) {
    cloudPOS.controllers = _.extend(module, {
        HeaderController: function (scope, location, sessionManager, translate, $rootScope,
                                    localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                    uiConfigService, $http, MasterDataStorageHandler) {

            /// Main navigation
            /// Used to navigate to main pages in the app.
            scope.navBtnClick = function(event, btnName){
                $(event.target).addClass('active');
                $(event.target).siblings('.btn.btn-primary').removeClass('active');
                switch (btnName.toString())
                {
                    case 'home':
                        alert("");
                        scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.MainBodyArea.ToMainArea();
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

            scope.HeaderDataModule = (function () {
                var DataModule = {};

                var SignOut = function () {
                    MasterDataStorageHandler.DataStorageHandler.SetAuthenticationData({SessionKey: null});
                };

                DataModule.Navigation = {
                    ToHomePanel: function () {
                        scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.MainBodyArea.ToOrdersDisplayView();
                        scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToOrderView();
                        scope.UrlFactory.UrlExchanger.ExchangeMainPagesView.ToHomeView();
                    },
                    ToReservationPanel: function () {
                        scope.UrlFactory.UrlExchanger.ExchangeMainPagesView.ToReservationView();
                    },
                    ToAdminPanel: function () {
                        scope.UrlFactory.UrlExchanger.ExchangeMainPagesView.ToAdminView();
                    },
                    ToWastagePanel: function () {
                        scope.UrlFactory.UrlExchanger.ExchangeMainPagesView.ToWastageView();
                    },
                    ToReportingPanel: function () {
                        scope.UrlFactory.UrlExchanger.ExchangeMainPagesView.ToReportView();
                    },
                    ToLoginPanel: function () {
                        scope.UrlFactory.UrlExchanger.ExchangeRootView.ToLoginView();
                        SignOut();
                        window.location.reload(true);
                    }
                };

                DataModule.DisableNavigation = false;

                return DataModule;
            })();

        }
    });
    cloudPOS.ng.application.controller('HeaderController', [
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
        'MasterDataStorageHandler',
        cloudPOS.controllers.HeaderController
    ]).run(function ($log) {
        $log.info("HeaderController initialized");
    });
}(cloudPOS.controllers || {}));