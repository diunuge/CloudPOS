(function (module) {
    cloudPOS.directives = _.extend(module, {
        GuestSelectionBarDirective: function () {
            return {
                restrict: 'E',
                scope: {
                    guestCount: '=?',
                    activeClass: '=',
                    inactiveClass: '=',

                    isMinimizable: '=?',

                    /// Contains the selected value which could be either a table number
                    /// or guest number ex: T1, T2, 1, 2
                    selectedCover: '=?'
                },
                templateUrl: 'views/directives/guestSelectionBarView.html',
                link: function(scope, elem, attrs){

                    /// Set initial values
                    scope.selectedCover = 0;
                    scope.isMinimizable = (scope.isMinimizable === undefined) ? false : scope.isMinimizable;

                    /// Contains a reference to the popup panel
                    var popupPanel = elem.find("#GuestCountChangePopup");

                    /// Temporarily hold number of guests
                    scope.numberOfGuestsTemp = scope.guestCount;

                    /// Create an array in order to generate series of object that
                    /// represents guests in a particular dining order
                    scope.gCount = Array((scope.guestCount === undefined) ? 0 : scope.guestCount);

                    /// Handles click event of the items, Ex: tables counts, and guest counts
                    /// Code of the clicked button is store in the selectedCover variable.
                    scope.SelectItem = function (evnt) {
                        let coverNumber = $(evnt.currentTarget).find("span").html();
                        scope.selectedCover = (coverNumber == "T") ? 0 : Number(coverNumber);
                        elem.find("." + scope.inactiveClass).removeClass(scope.activeClass);
                        $(evnt.currentTarget).addClass(scope.activeClass);
                    };

                    /// Guest count changing popup
                    scope.OpenPopup = function () {
                        popupPanel.css("display", "flex");
                        popupPanel.css("position", "fixed");
                        /// $(document.body).append(popup);
                    };

                    /// Hides the currently visible popup panel
                    scope.ClosePopup = function () {
                        popupPanel.css("display", "none");
                        popupPanel.css("position", "fixed");
                    };

                    /// Add requested guest total to the guestSelectionPanel and
                    /// set number of guests in the orderHeader
                    scope.AddGuestCount = function () {
                        let count = scope.numberOfGuestsTemp;
                        if (count > 0 && count <= 16) {
                            scope.gCount = Array((count > 0) ? count : 0);
                            scope.ClosePopup();
                        }
                        else if (count < 1) {
                            scope.numberOfGuestsTemp = 1;
                        }
                        else {
                            comSingleButtonInfoAlert("Guests", "Maximum guest count is 16 guests", "Got it!");
                        }
                    };
                }
            };
        }
    });
}(cloudPOS.directives || {}));

cloudPOS.ng.application.directive("guestSelectionBarDirective", [

    cloudPOS.directives.GuestSelectionBarDirective
]).run(function ($log) {
    $log.info("GuestSelectionBarDirective initialized");
});