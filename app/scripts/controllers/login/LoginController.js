(function (module) {
    cloudPOS.controllers = _.extend(module, {
        LoginController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                                  uiConfigService, $http, CloudDaoService,
                                                  TransactionHandler, MasterDataStorageHandler) {

            /// Validators
            /// Validation constraints
            var passwordMinLength = 1;
            var passwordMaxLength = 8;
            var usernameMinLength = 1;
            var usernameMaxLength = 8;

            /// Credentials validation function
            var validateCredentials = function () {
                /// add validation logic here.
                return true;
            };

            /// Server login response validator.
            /// Check that the important values have been included in the response
            /// and they are not empty.
            var responseValidator = function (response) {

                var isValid = false;
                if (response !== undefined && "IsSuccessFull" in response && "UserID" in response &&
                    "RestaurantID" in response && "SessionKey" in response && "FirstName" in response) {
                    if (response.IsSuccessFull == true && response.UserID != "" && response.RestaurantID != "" &&
                        response.SessionKey != "") {
                        isValid = true;
                        TransactionHandler.Config.SetSessionKey(response.SessionKey);
                        console.info("User validation succeed.");
                        /// comSingleButttonSuccessAlert("Login", "")
                    }
                    else {
                        comSingleButttonSuccessAlert("Login", "Either username or password is incorrect", "Got it!");
                    }
                } else {
                    console.error("Login Failed");
                    comSingleButttonSuccessAlert("Login", "Login failed due to a service error", "Got it!");
                }

                return isValid;
            };

            /// Credentials
            /// Binds with the login form in two-way binding to get values from the form.
            scope.Credentials = {
                Username: "",
                Password: "",
                RestaurantId: ""
            };

            /// Handles login operations
            scope.LoginDataModule = {
                AttemptLogin: function () {
                    console.error(MasterDataStorageHandler.DataStorageHandler.GetAuthenticationData());
                    var sessionKey = MasterDataStorageHandler.DataStorageHandler.GetAuthenticationData();

                    try {
                        sessionKey = JSON.parse(JSON.parse(sessionKey));
                        sessionKey = (sessionKey.SessionKey == null) ? undefined : sessionKey;
                    }
                    catch (ex) {
                        sessionKey = undefined;
                    }

                    console.error(sessionKey);

                    var callback = function (response) {

                        /// If login succeed, change the root view to main pages view
                        /// and store credentials in the browser memory,
                        /// and store UserID, RestaurantID in the localStorage
                        if(sessionKey !== undefined || responseValidator(response.data)) {

                            if (sessionKey === undefined) {
                                /// Store login information such as UserID, Username, RestaurantID in the localStorage
                                /// to optimize the usability
                                MasterDataStorageHandler.DataStorageHandler.SetLoginHelpingData({
                                    Username: scope.Credentials.Username,
                                    Password: scope.Credentials.Password,
                                    RestaurantId: scope.Credentials.RestaurantId,
                                    UserID: response.data.UserID,
                                    AuthenticationTicket: response.data
                                });

                                console.error(response.data);

                                /// Store the accessToken retrieved from the successful login request
                                /// in the local storage
                                MasterDataStorageHandler.DataStorageHandler.SetAuthenticationData({
                                    SessionKey: response.data.SessionKey
                                });

                                /// Set cache user data on the memory for quick access
                                scope.UserInfo.UserID = Number(response.data.UserID);
                                scope.UserInfo.UserLevelID = Number(response.data.UserLevelID);
                                scope.UserInfo.HotelID = Number(response.data.HotelID);
                                scope.UserInfo.RestaurantID = Number(response.data.RestaurantID);
                                scope.UserInfo.FirstName = response.data.FirstName;
                                scope.UserInfo.LastName = response.data.LastName;
                                scope.UserInfo.RestaurantName = response.data.RestaurantName;
                            }
                            else {
                                let authenticationTicket = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetLoginHelpingData()).AuthenticationTicket;
                                scope.UserInfo.UserID = Number(authenticationTicket.UserID);
                                scope.UserInfo.UserLevelID = Number(authenticationTicket.UserLevelID);
                                scope.UserInfo.HotelID = Number(authenticationTicket.HotelID);
                                scope.UserInfo.RestaurantID = Number(authenticationTicket.RestaurantID);
                                scope.UserInfo.FirstName = authenticationTicket.FirstName;
                                scope.UserInfo.LastName = authenticationTicket.LastName;
                                scope.UserInfo.RestaurantName = authenticationTicket.RestaurantName;
                                TransactionHandler.Config.SetSessionKey(sessionKey.SessionKey);
                            }

                            /// Master data loading operations
                            /// retrieve master data and referential data from the database
                            /// and store them in the local storage.
                            (function () {
                                var foodItems = [];
                                var foodCategories = [];
                                var foodSubCategories = [];
                                var foodRemarks = [];
                                var orderCategories = [];
                                var tables = [];
                                var guests = [];
                                var users = [];
                                var taxes = [];
                                var taxCodes = [];
                                var discounts = [];
                                var responseTester = 0;
                                var timeSlots = [];
                                var serviceCharge = [];
                                var deliveryZones = [];
                                var floors = [];
                                var systemMenus = [];
                                var userPrivileges = [];
                                var userLevelPrivileges = [];
                                var userLevelRules = [];

                                try {
                                    TransactionHandler.Execute.FoodItem.ReadAll((response)=> {
                                        foodItems = response;
                                        responseTester++;
                                        callback();
                                    });
                                    TransactionHandler.Execute.FoodCategory.ReadAll((response)=> {
                                        console.error(response);
                                        foodCategories = response;
                                        responseTester++;
                                        callback();
                                    });
                                    TransactionHandler.Execute.FoodSubCategory.ReadAll((response)=> {
                                        foodSubCategories = response;
                                        responseTester++;
                                        callback();
                                    });
                                    TransactionHandler.Execute.Order.ReadOrderCategories((response)=>{
                                        orderCategories = response.OrderCategoryResponse;
                                        responseTester++;
                                        callback();
                                    });
                                    TransactionHandler.Execute.Guests.ReadAll((response)=>{
                                        guests = response;
                                        responseTester++;
                                        callback();
                                    });
                                    TransactionHandler.Execute.Tables.ReadAll((response)=>{
                                        tables = response.Tables;
                                        responseTester++;
                                        callback();
                                    });
                                    TransactionHandler.Execute.Users.ReadAll((response)=>{
                                        users = response;
                                        responseTester++;
                                        callback();
                                    });
                                    TransactionHandler.Execute.ServiceCharge.ReadServiceCharge((response)=>{
                                        serviceCharge = response.ServiceChargeResponse;
                                        responseTester++;
                                        callback();
                                    });
                                    TransactionHandler.Execute.Tax.ReadAll((response)=>{
                                        taxes = response;
                                        responseTester++;
                                        callback();
                                    });
                                    TransactionHandler.Execute.TaxCode.ReadAll((response)=>{
                                        taxCodes = response;
                                        responseTester++;
                                        callback();
                                    });
                                    TransactionHandler.Execute.Discount.ReadAll((response)=>{
                                        discounts = response;
                                        responseTester++;
                                        callback();
                                    });
                                    TransactionHandler.Execute.TimeSlot.ReadAll((response)=>{
                                        timeSlots = response;
                                        responseTester++;
                                        callback();
                                    });
                                    TransactionHandler.Execute.DeliveryZones.ReadAll((response)=>{
                                        deliveryZones = response;
                                        responseTester++;
                                        callback();
                                    });
                                    TransactionHandler.Execute.Floor.ReadAll((response)=>{
                                        floors = response;
                                        responseTester++;
                                        callback();
                                    });
                                    TransactionHandler.Execute.SystemMenus.ReadAll((response)=>{
                                        systemMenus = response;
                                        responseTester++;
                                        callback();
                                    });
                                    TransactionHandler.Execute.UserPrivileges.ReadAll((response)=>{
                                        userPrivileges = response;
                                        responseTester++;
                                        callback();
                                    });
                                    TransactionHandler.Execute.UserLevelPrivileges.ReadAll((response)=>{
                                        userLevelPrivileges = response;
                                        responseTester++;
                                        callback();
                                    });
                                    TransactionHandler.Execute.UserLevelRules.ReadAll((response)=>{
                                        userLevelRules = response;
                                        responseTester++;
                                        callback();
                                    });
                      /*              TransactionHandler.Execute.FoodRemarks.ReadAll((response)=>{
                                        foodRemarks = response;
                                        responseTester++;
                                        callback();
                                    });*/

                                    /// If all the data has been retrieved
                                    /// callback store the data on the local storage
                                    var callback = function () {
                                        if (responseTester === 18) {

                                            var masterFoodsData = {
                                                FoodItems: foodItems,
                                                FoodCategories: foodCategories,
                                                FoodSubCategories: foodSubCategories,
                                                Tables: tables
                                            };

                                            var ordersData = {
                                                OrderCategories: orderCategories
                                            };

                                            var adminData = {
                                                Guests: guests,
                                                Users: users,
                                                Taxes: taxes,
                                                TaxCodes: taxCodes,
                                                Discounts: discounts,
                                                TimeSlots: timeSlots,
                                                ServiceCharge: serviceCharge,
                                                DeliveryZones: deliveryZones,
                                                Floors: floors
                                            };

                                            try {
                                                console.error(scope.SystemInit.AccessControl.MapSystemMenus(systemMenus.MenuList));
                                                console.error(scope.SystemInit.AccessControl.MapUserPrivileges(userPrivileges));
                                                console.error(userLevelRules);
                                                console.error(scope.SystemInit.AccessControl.MapUserLevelRules(userLevelRules, scope.UserInfo.UserLevelID));
                                                console.error(scope.SystemInit.AccessControl.MapUserLevelPrivileges(userLevelPrivileges, scope.UserInfo.UserLevelID));
                                            }
                                            catch (ex) {
                                                console.log(ex);
                                                return false;
                                            }

                                            MasterDataStorageHandler.DataStorageHandler.SetMasterFoodsData(masterFoodsData);
                                            MasterDataStorageHandler.DataStorageHandler.SetOrdersData(ordersData);
                                            MasterDataStorageHandler.DataStorageHandler.SetAdminData(adminData);
                                            scope.SystemSettings.Init(function () {
                                                scope.ReferenceData.Init(function (isSuccess) {
                                                    if (isSuccess) {
                                                        /// console.error(scope.ReferenceData);
                                                        scope.UrlFactory.UrlExchanger.ExchangeRootView.ToMainPagesView();
                                                    }
                                                    else {
                                                        /// do something.
                                                    }
                                                });

                                                if (scope.SystemSettings.SettingsDto.SystemSettings.AutoLockTimeDuration.Value) {

                                                    let minutes = Number(scope.SystemSettings.SettingsDto.SystemSettings.AutoLockTimeDuration.Factor);

                                                    if (minutes != null && !isNaN(minutes) && minutes > 0) {
                                                        let milliseconds = minutes * 60 * 1000;
                                                        let timer = 0;
                                                        let callback = function () {
                                                            timer = 0;
                                                            comSingleButtonInfoAlert("AutoLock", "AutoLock has been activated. You are being logged out.", "Got it!");
                                                            window.setTimeout(function () {
                                                                scope.UrlFactory.UrlExchanger.ExchangeRootView.ToLoginView();
                                                                window.location.reload(true);
                                                            }, 2000);
                                                        };

                                                        timer = window.setTimeout(callback, milliseconds);
                                                        $("body").on("click", function () {
                                                            if (timer !== 0) {
                                                                window.clearTimeout(timer);
                                                                timer = window.setTimeout(callback, milliseconds);
                                                            }
                                                        });
                                                    }
                                                }
                                            });
                                        }
                                    };
                                } catch (ex) {
                                    console.error(ex.message);
                                }
                            })();

                           /// MasterDataStorageHandler.DataStorageHandler.SetMasterFoodsData();

                            /// Changes main view to the mainPagesView
                            /// scope.UrlFactory.UrlExchanger.ExchangeRootView.ToMainPagesView();
                        }
                        else {
                            /// alert("Invalid user credentials!");
                        }
                    };

                    if (sessionKey!== undefined && sessionKey.SessionKey.toString().length > 0) {
                        callback();
                    }
                    else {

                        if (scope.Credentials.Username !== "" && scope.Credentials.Password !== "" &&
                            scope.Credentials.RestaurantId !== "") {

                            /// Sends an authentication request to the server
                            /// If the response is positive, then callback get executed.
                            var authenticationTicket = TransactionHandler.Execute.AuthenticateUser(scope.Credentials.Username,
                                scope.Credentials.Password,
                                scope.Credentials.RestaurantId,
                                callback);
                        } else {
                            /// alert("Invalid User Credentials");
                            comSingleButtonInfoAlert("User Credentials", "Please provide user credentials", "Got it!");
                        }
                    }

                    /// testing purposes only, remove these lines after test cases have been done
                   /// MasterDataStorageHandler.DataStorageHandler.SetMasterFoodsData();

                   /// scope.UrlFactory.UrlExchanger.ExchangeRootView.ToMainPagesView();
                }
            };

            /// Initialization
            (function () {
                var sessionKey = MasterDataStorageHandler.DataStorageHandler.GetAuthenticationData();

                try {
                    sessionKey = JSON.parse(JSON.parse(sessionKey));
                    if (sessionKey.SessionKey != null) {
                        scope.LoginDataModule.AttemptLogin();
                    }
                }
                catch (ex) {
                    sessionKey = undefined;
                }
            })();
        }
    });
    cloudPOS.ng.application.controller('LoginController', [
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
        'TransactionHandlerService',
        'MasterDataStorageHandler',
        cloudPOS.controllers.LoginController
    ]).run(function ($log) {
        $log.info("LoginController initialized");
    });
}(cloudPOS.controllers || {}));