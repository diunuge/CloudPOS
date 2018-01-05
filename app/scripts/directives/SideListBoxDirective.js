(function (module) {
    cloudPOS.directives = _.extend(module, {

        SideListBoxDirective: function () {

            return {
                restrict: "A",
                link: function ($scope, elem, attrs) {

                    /// Get active class of the listBox.
                    /// This css class applies to the children elements when their are clicked.
                    var activeClass = elem.attr("active-class");

                    /// CSS class for identifying list items
                    var listItem = ".listItem";

                    /// Initializes the side list box
                    /// Handle the list box behavior
                    (function () {
                        elem.find("button" + listItem).click(function (evnt) {
                            elem.find("button" + listItem).removeClass(activeClass);
                            $(evnt.target).addClass(activeClass);
                        });
                    }());
                }
            };
        }
    });
}(cloudPOS.directives || {}));

cloudPOS.ng.application.directive("sideListBox", [cloudPOS.directives.SideListBoxDirective]).run(function ($log) {
    $log.info("SideListBoxDirective initialized");
});