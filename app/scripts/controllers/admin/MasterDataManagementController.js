(function (module) {
    cloudPOS.controllers = _.extend(module, {
        MasterDataManagementController: function (scope) {
            scope.MasterDataMgDataModule = (function () {
                var DataModule = {};

                DataModule.NavigationEvents = $.Callbacks();

                DataModule.navigation = {
                    ToFoodsView: function (e) {

                    },

                    ToFoodTypesView: function (e) {
                        DataModule.NavigationEvents.fire(e, "FoodSubCategory");
                    },

                    ToFoodCategoriesView: function (e) {
                        DataModule.NavigationEvents.fire(e, "FoodCategory");
                    },

                    ToTablesView: function (e) {

                    },

                    ToMessagesView: function (e) {

                    },

                    ToDeliveryZonesView: function (e) {

                    }
                };

                return DataModule;
            })();
        }
    });
    cloudPOS.ng.application.controller('MasterDataManagementController', [
        '$scope',
        cloudPOS.controllers.MasterDataManagementController
    ]).run(function ($log) {
        $log.info("MasterDataManagementController initialized");
    });
}(cloudPOS.controllers || {}));
