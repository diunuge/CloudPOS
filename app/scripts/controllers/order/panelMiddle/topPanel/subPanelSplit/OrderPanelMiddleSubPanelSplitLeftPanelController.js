(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrderPanelMiddleSubPanelSplitLeftPanelController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                                    uiConfigService, $http) {
            var itemsCount = 0;
            scope.odrSubPanelSplitLeftPanel_clickRow = function(evnt, index){
                $(evnt.currentTarget).toggleClass('active');
                if($(evnt.currentTarget).hasClass('active') == true)
                {
                    //alert("index " + index);
                    scope.selectedItems.push(index);
                } else {
                    for(var i = 0; i < scope.selectedItems.length; i++) {
                        if(scope.selectedItems[i] === index) {
                            scope.selectedItems.splice(i, 1);
                        }
                    }
                }
            };
        }
    });
    cloudPOS.ng.application.controller('OrderPanelMiddleSubPanelSplitLeftPanelController', [
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
        cloudPOS.controllers.OrderPanelMiddleSubPanelSplitLeftPanelController
    ]).run(function ($log) {
        $log.info("OrderPanelMiddleSubPanelSplitLeftPanelController initialized");
    });
}(cloudPOS.controllers || {}));
