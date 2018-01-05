(function (module) {
    cloudPOS.services = _.extend(module, {
        MasterDataStorageHandler: function (localSessionManager, inMemoryStorageManager) {
            /// Module access to the server and retrieve master data,and then store them in the local storage

            /// key names for master data
            var vocabulary = {

                /// authentication data storage
                authenticationData: "CloudPOS_userAuthenticationTicket",

                /// food categories
                masterFoodsData: "CloudPOS_masterData_foodsData",

                /// login helping data
                loginHelpingData: "CloudPOS_loginHelpingData",

                /// order related data
                ordersData: "CloudPOS_ordersData",

                /// admin data
                adminData: "CloudPos_adminData"
            };

            /// InMemoryCache handler
            var inMemoryCacheHandler = inMemoryStorageManager.InMemoryCacheHandler;

            /// LocationSessionStorage handler
            var localSessionHandler = localSessionManager.SessionStorageHandler;

            /// set authentication data
            var setAuthenticationData = function (dataJSON) {

                localSessionHandler.SetItem(vocabulary.authenticationData, JSON.stringify(dataJSON));
            };

            /// get authentication data
            /// <return> authentication object </return>
            var getAuthenticationData = function () {

                var authData = localSessionHandler.GetItem(vocabulary.authenticationData);
                return authData;
            };

            /// Retrieve all the master data about foods
            /// foodItems, categories, and subCategories
            /// <return> an object containing all the foods related master data </return>
            var getMasterFoodsData = function () {

                var FoodsData = undefined;
                FoodsData = JSON.parse(localSessionHandler.GetItem(vocabulary.masterFoodsData));

                return (FoodsData === undefined) ? {} : FoodsData;
            };

            /// Retrieve master data related to food from the database
            /// and store them in the local storage in order to access the resources
            /// on the fly fast.
            var setMasterFoodsData = function (masterFoodsData) {

                localSessionHandler.SetItem(vocabulary.masterFoodsData, JSON.stringify(masterFoodsData));
            };

            /// Retrieve data about order from the local storage
            var getOrdersData = function () {

                var ordersData = undefined;

                ordersData = JSON.parse(localSessionHandler.GetItem(vocabulary.ordersData));
                return (ordersData === undefined) ? {} : ordersData;
            };

            /// Store data about orders in the local storage
            var setOrdersData = function (ordersData) {

                localSessionHandler.SetItem(vocabulary.ordersData, JSON.stringify(ordersData));
            };

            /// Retrieve login helping data *. change SessionStorage to localStorage
            var getLoginHelpingData = function () {

                var loginHelpingData = JSON.parse(localSessionHandler.GetItem(vocabulary.loginHelpingData));
                return loginHelpingData;
            };

            /// Store login helping data: UserID, UserName, RestaurantID, etc..
            var setLoginHelpingData = function (dataJSON) {

                localSessionHandler.SetItem(vocabulary.loginHelpingData, JSON.stringify(dataJSON));
            };

            /// Retrieve data of the admin category from the localStorage
            var getAdminData = function () {
                var adminData = {};

                adminData = JSON.parse(localSessionHandler.GetItem(vocabulary.adminData));
                return (adminData === undefined) ? {} : adminData;
            };

            /// Set admin data to the local storage
            var setAdminData = function (data) {

                localSessionHandler.SetItem(vocabulary.adminData, JSON.stringify(data));
            };

            /// Expose common functionality to the outside
            this.DataStorageHandler = {
                SetAuthenticationData: setAuthenticationData,
                GetAuthenticationData: getAuthenticationData,
                SetMasterFoodsData: setMasterFoodsData,
                GetMasterFoodsData: getMasterFoodsData,
                SetOrdersData: setOrdersData,
                GetOrdersData: getOrdersData,
                SetAdminData: setAdminData,
                GetAdminData: getAdminData,
                SetLoginHelpingData: setLoginHelpingData,
                GetLoginHelpingData: getLoginHelpingData
            };
        }
    });
    cloudPOS.ng.services.service('MasterDataStorageHandler', [
        'BrowserSessionManagerService',
        'BrowserInMemoryCacheManagerService',
        cloudPOS.services.MasterDataStorageHandler
    ]).run(function ($log) {
        $log.info("MasterDataStorageHandler initialized");
    });
}(cloudPOS.services || {}));