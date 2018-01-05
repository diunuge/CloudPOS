(function (module) {
    cloudPOS.controllers = _.extend(module, {
        WastageController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                             uiConfigService, $http, CloudDaoService, filterFilter, MasterDataStorageHandler) {

            /// Used to perform data manipulation tasks
            scope.wastageDataModule = new (function(MasterDataStorageHandler){

                /// Perform initial tasks.
                /// Override the middle view of the header view.
                (function () {
                    scope.HeaderViewMiddlePanel.Data = {
                        TableNo: "TBL01",
                        OrderId: "0001",
                        Amount: "Rs. 3000"
                    };

                    scope.UrlFactory.UrlExchanger.HeaderView.MiddlePanel.ToDefaultView();
                })();

                /// Filter out elements in the FoodItemsSelection panel in the view
                this.FoodItemsSelectionPanel = {
                    CurrentItemsList: [],
                    WastedItems: [],
                    SelectedFoodCategory: undefined,
                    SelectedFoodSubCategory: undefined,
                    MasterFoodsData: {},
                    FilterItems: function (item) {

                        try {
                            let itemId = (item.FoodId || item.FoodTypeId || item.FoodCatId);
                            if (this.SelectedFoodCategory === undefined) {

                                this.CurrentItemsList = filterFilter(this.MasterFoodsData.FoodSubCategories, function (elem) {
                                    return (elem.FoodCatId == itemId);
                                });

                                this.SelectedFoodCategory = item;
                            } else if (this.SelectedFoodSubCategory === undefined) {

                                this.CurrentItemsList = filterFilter(this.MasterFoodsData.FoodItems, function (elem) {
                                    return (elem.FoodTypeId == itemId);
                                });

                                this.SelectedFoodSubCategory = item;
                            }
                            else {
                                if(item !== undefined) {
                                    this.WastedItems.push(item);
                                }
                            }
                        }
                        catch (ex) {
                            this.CurrentItemsList = [];
                            this.SelectedFoodCategory = undefined;
                            this.SelectedFoodSubCategory = undefined;
                        }
                    },

                    /// StepBack function filters in backward which mean that it filter out to the previously
                    /// filtered result by setting some properties and calling the FilterItems method.
                    /// This set the
                    StepBack: function (steps) {
                        if (steps == 1) {
                            let foodCategory = this.SelectedFoodCategory;
                            this.SelectedFoodCategory = undefined;
                            this.SelectedFoodSubCategory = undefined;
                            this.FilterItems(foodCategory);

                        } else if (steps == 2) {
                            this.SelectedFoodSubCategory = undefined;
                            this.SelectedFoodCategory = undefined;
                            this.CurrentItemsList = this.MasterFoodsData.FoodCategories;
                        }
                    },

                    /// Remove an item from the wasted items list
                    RemoveItem: function (itemId) {
                        this.WastedItems.splice(itemId, 1);
                    },

                    Init: function () {

                        /// Load master data from the local storage
                        this.MasterFoodsData =  JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetMasterFoodsData());
                        this.CurrentItemsList = this.MasterFoodsData.FoodCategories;
                    }
                };

                /// Perform initial tasks
                (function (This) {

                    /// Loads master data from the local storage.
                    /// If data doesn't exist in there, loads data from the server store them in the local storage
                    This.FoodItemsSelectionPanel.Init();
                })(this);
            })(MasterDataStorageHandler);

            /// Used for UI handling tasks
            scope.uiHandlers = {

            };
        }
    });
    cloudPOS.ng.application.controller('WastageController', [
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
        'MasterDataStorageHandler',
        cloudPOS.controllers.WastageController
    ]).run(function ($log) {
        $log.info("WastageController initialized");
    });
}(cloudPOS.controllers || {}));
