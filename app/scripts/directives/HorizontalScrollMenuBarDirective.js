(function (module) {
    cloudPOS.directives = _.extend(module, {

        HorizontalScrollMenuBarDirective: function () {

            return {
                restrict: "E",
                templateUrl: "views/directives/horizontalCarouselMenuView.html",
                scope: {
                    "items": "=",
                    "onClick": "="
                },
                link: function ($scope, elem, attrs) {

                    /// Initializes the carousel immediately after the document has been loaded.
                    /// Carousel arrow buttons handlers.
                    $scope.$watch("items", function (newVal, oldVal) {
                        (function () {
                            $(elem[0]).find("#carouselBody").slick({
                                infinite: false,
                                slidesToShow: 3,
                                slidesToScroll: 3,
                                nextArrow: elem.find("#carouselRightArrowBtn"),
                                prevArrow: elem.find("#carouselLeftArrowBtn"),
                                swipe: true
                            });
                        }());
                    });

                    /// Handles click events from the carousel items
                    $scope.ItemClick = function (categoryId) {
                        if($scope.onClick !== undefined) {
                            $scope.onClick(categoryId);
                        }
                    };
                }
            };
        }
    });
}(cloudPOS.directives || {}));

cloudPOS.ng.application.directive("horizontalScrollMenuBar", [cloudPOS.directives.HorizontalScrollMenuBarDirective]).run(function ($log) {
    $log.info("HorizontalScrollMenuBarDirective initialized");
});