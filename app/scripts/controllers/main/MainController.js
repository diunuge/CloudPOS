(function (module) {
    cloudPOS.controllers = _.extend(module, {
        MainController: function (scope, location, sessionManager, $rootScope, localStorageService, $idle,
                                  uiConfigService, $http, $filter, InMemoryCacheManager,
                                  BrowserSessionManager, UrlFactory, CommonAlertsService,
                                  SystemSettings, ReferenceDataService, SystemInit) {

            /// Log the version information to the console.
            $http.get('release.json').success(function (data) {
                scope.version = data.version;
                scope.releasedate = data.releasedate;
                console.log(data);
            });

            /// Contains the title of the application
            $rootScope.Heading = {
                Label: "Inta CloudPOS 2018",
                Favicon: ""
            };

            /// This enables low level controllers to navigate through the entire app.
            /// UrlFactory Service
            scope.UrlFactory = UrlFactory;

            /// Used by controllers to provide data into the customized middle view of the header view
            /// which is used for exhibiting information to users
            scope.HeaderViewMiddlePanel = {

                /// This property is to be overridden by controllers which
                /// represents customized middle views of the header view
                Data: {},

                /// Overrides the Data property
                OverrideData: function (data) {
                    this.Data = data;
                }
            };

            scope.Navigation = (function () {
                var navigation = {};

                navigation.DisableNavigationButtons = false;

                return navigation;
            })();

            /// System initialization
            scope.SystemInit = SystemInit;

            /// Current user info
            scope.UserInfo = {
                UserID: 0,
                UserLevelID: 0,
                HotelID: 0,
                RestaurantID: 0,
                FirstName: "",
                LastName: "",
                RestaurantName: ""
            };

            /// Initialize alerts
            CommonAlertsService.ConfigureCommonAlerts();

            /// System Settings
            scope.SystemSettings = SystemSettings.POSsettings;

            /// Reference Data
            scope.ReferenceData = ReferenceDataService;

            /// SessionStorage handlers
            scope.SessionStorageHandler = BrowserSessionManager.SessionStorageHandler;

            /// InMemory caching object
            scope.InMemoryCaching = InMemoryCacheManager.InMemoryCacheHandler;
        }
    });
    cloudPOS.ng.application.controller('MainController', [
        '$scope',
        '$location',
        'SessionManager',
        '$rootScope',
        'localStorageService',
        '$idle',
        'UIConfigService',
        '$http',
        '$filter',
        'BrowserInMemoryCacheManagerService',
        'BrowserSessionManagerService',
        'UrlFactory',
        'CommonAlertsService',
        'SystemSettings',
        'ReferenceDataService',
        'SystemInit',
        cloudPOS.controllers.MainController
    ]).run(function ($log) {
        $log.info("MainController initialized");
    });
}(cloudPOS.controllers || {}));
