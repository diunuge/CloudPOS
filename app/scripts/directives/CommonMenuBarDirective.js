(function (module) {
    cloudPOS.directives = _.extend(module, {
        CommonMenuBarDirective: function () {
            return {
                restrict: 'E',
                scope: {
                    itemArr: '=itemArray'
                },
                templateUrl: 'views/directives/commonMenuBar.view.html',
                link: function($scope, elem, attrs){

                }
            };

        }
    });
}(cloudPOS.directives || {}));

cloudPOS.ng.application.directive("commonMenuBar", [cloudPOS.directives.CommonMenuBarDirective]).run(function ($log) {
    $log.info("CommonMenuBarDirective initialized");
});