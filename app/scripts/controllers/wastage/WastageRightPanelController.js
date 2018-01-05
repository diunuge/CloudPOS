(function (module) {
    cloudPOS.controllers = _.extend(module, {
        WastageRightPanelController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                             uiConfigService, $http, MasterDataStorage, FilterFilter) {

            /// Used for ui handling purposes
            scope.uiHandlers = {

                /// Handles food selection panel
                /// Filter foodCategories, foodSubCategories, and foodItems
                foodsSelectionPanel: {
                    masterData: {
                        foodCategories: [],
                        foodSubCategories: [],
                        foodItems: []
                    },
                    displayItems: [],
                    foodCategoryId: 0,
                    foodSubCategoryId: 0,
                    filterFoodCategory: function (categoryId) {
                        this.displayItems = FilterFilter(this.masterData.foodSubCategories, function (item, indx, arr) {

                        })
                    },
                    filterFoodSubCategory: function (subCategoryId) {
                        this.displayItems = FilterFilter(this.masterData.foodSubCategories, function (item, indx, arr) {

                        })
                    },
                    foodItemClick: function (e) {

                    }
                }
            };
        }
    });
    cloudPOS.ng.application.controller('WastageRightPanelController', [
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
        'filterFilter',
        cloudPOS.controllers.WastageRightPanelController
    ]).run(function ($log) {
        $log.info("WastageRightPanelController initialized");
    });
}(cloudPOS.controllers || {}));
