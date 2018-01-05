(function (module) {
    cloudPOS.controllers = _.extend(module, {
        FoodSubCategoryMgController: function (scope, TransactionHandler, filterFilter,
                                            ObjectFactoryService) {
            scope.FoodSubCategoryMgDataModule = (function () {
                var DataModule = {};

                return DataModule;
            })();
        }
    });
    cloudPOS.ng.application.controller('FoodSubCategoryMgController', [
        '$scope',
        'TransactionHandlerService',
        'filterFilter',
        'ObjectFactoryService',
        cloudPOS.controllers.FoodSubCategoryMgController
    ]).run(function ($log) {
        $log.info("FoodSubCategoryMgController initialized");
    });
}(cloudPOS.controllers || {}));
