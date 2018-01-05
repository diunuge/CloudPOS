(function (module) {
    cloudPOS.directives = _.extend(module, {

        /// This directive gives radio button group behavior to normal set of buttons.
        /// Usage - add radio-button-group attribute to a div element and then add active-class and inactive-class
        /// attributes to the element.
        /// Radio buttons behavior. Add ItemButtons class to each button in the radio-button-group
        RadioButtonGroupDirective: function () {
            return {
                restrict: "A",
                link: function (scope, elem, attrs) {

                    /// Class name for group buttons
                    var groupButtonCssClass = ".ItemButtons";

                    /// Css class name for active buttons
                    var activeCssClass = elem.attr("active-class");

                    /// Css class name for  non-active buttons
                    var inActiveCssClass = elem.attr("inactive-class");

                    /// Handles radio button's behavior
                    /// Handles click events
                    (function () {

                        /// Button's click event handler
                        let onClick = function(e){

                            elem.find(groupButtonCssClass).removeClass(activeCssClass);
                            elem.find(groupButtonCssClass).not("." + inActiveCssClass).addClass(inActiveCssClass);
                            $(e.currentTarget).removeClass(inActiveCssClass);
                            $(e.currentTarget).addClass(activeCssClass);
                        };

                        /// Attach events to elements
                        elem.find(groupButtonCssClass).click(onClick);
                    }());

                }
            };
        }
    });
}(cloudPOS.directives || {}));

cloudPOS.ng.application.directive("radioButtonGroup", [cloudPOS.directives.RadioButtonGroupDirective]).run(function ($log) {
    $log.info("RadioButtonGroupDirective initialized");
});