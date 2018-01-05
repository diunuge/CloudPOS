(function (module) {
    cloudPOS.directives = _.extend(module, {

        VerticalScrollMenuBarDirective: function () {

            return {
                restrict: "E",
                templateUrl: 'views/directives/verticalCarouselDirectiveView.html',
                scope: {
                    items: "=",
                    callback: "="
                },
                link: function ($scope, elem, attrs) {

                    /// Initializes the carousel and set initial settings
                    (function () {
                        $(elem.find("#carouselBodyArea")).slick({
                            vertical: true,
                            infinite: false,
                            slidesToShow: 5,
                            lazyLoad: "ondemand",
                            touchMove: true,
                            swipe: true,
                            slidesToScroll: 3,
                            nextArrow: $(elem.find("#carouselUp")),
                            prevArrow: $(elem.find("#carouselDown"))
                        });
                    })();

                    /// Holds the length of the previous items array
                    var preLength = 0;

                    /// Move carousel elements to the up
                    $(elem.find("#carouselUp")).on("click", function () {

                    });

                    /// Move carousel elements to the down
                    $(elem.find("#carouselDown")).on("click", function () {

                    });

                    /// Removes items one by one from the carousel
                    var removeItems = function () {

                        for (let i = 0; i < preLength; i++) {
                            $(elem.find("#carouselBodyArea")).slick("slickRemove", 0);
                        }
                    };

                    /// Adds items one by one to the carousel
                    var addItems = function (items) {

                        for (let i = 0; i < $scope.items.length; i++) {
                            let caption = $scope.items[i].Name;
                            let button = document.createElement("button");
                            let span = document.createElement("span");
                            button.append(span);
                            span.innerHTML = caption;
                            $(button).attr("class", "button primary");
                            $(button).attr("style", "min-height: 60px !important; width: 126px; max-width: 126px !important;");
                            $(span).attr("class", "title CloudFont Small-CloudFont");
                            $(button).on("click", items[i], itemClick);
                            /// $(button).attr("ng-click", "itemClick('123')");
                            /// alert(elem.find("#carouselBodyArea")[0]);
                            elem.find("#carouselBodyArea").slick("slickAdd", button);
                        }

                        preLength = $scope.items.length;
                    };

                    var itemClick = function (e) {
                        if ($scope.callback !== undefined) {
                            $scope.callback(e.data);
                        }
                    };

                    /// Watches for changes in items, and
                    /// remove old items and add new items
                    $scope.$watch("items", function (newVal, oldVal){

                        if(Array.isArray(newVal)) {
                            console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAa");
                            console.log(newVal);
                            removeItems();
                            addItems(newVal);
                        }
                    }, true);
                }
            };
        }
    });
}(cloudPOS.directives || {}));

cloudPOS.ng.application.directive("verticalScrollMenuBar", [cloudPOS.directives.VerticalScrollMenuBarDirective]).run(function ($log) {
    $log.info("VerticalScrollMenuBarDirective initialized");
});