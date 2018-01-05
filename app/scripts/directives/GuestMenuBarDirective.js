(function (module) {
    cloudPOS.directives = _.extend(module, {
        GuestMenuBarDirective: function () {
            return {
                restrict: 'E',
                scope: {
                    noOfGuests: '=',
                    selectedVal: '='
                },
                templateUrl: 'views/directives/guestsBarView.html',
                link: function(scope, elem, attrs){
                    scope.itemsAr = Array(scope.noOfGuests);
                    scope.noOfItems = scope.noOfGuests;

                    scope.selectGuestClick = function(evnt, guest){
                        $(evnt.target).parent().parent().find('.btn-default').css('background-color', '');
                        $(evnt.target).css('background-color', 'rgb(126, 184, 222)');
                        scope.selectedVal = guest;
                    };

                    scope.addNoOfGuests = function() {
                        scope.noOfGuests = scope.noOfItems;
                        scope.itemsAr = Array(scope.noOfItems);
                    };

                    scope.$watch('noOfGuests', function(newVal, oldVal) {
                        $(document).ready(function(){
                            elem.find('.guestT').parent().parent().find('.btn-default').css('background-color', '');
                            if((scope.selectedVal != 'T' && (scope.selectedVal > newVal))) {
                                elem.find('.guestT').css('background-color', 'rgb(126, 184, 222)');
                            } else {
                                elem.find(".guest" + scope.selectedVal).css('background-color', 'rgb(126, 184, 222)');
                            }
                        });
                        scope.itemsAr = Array(scope.noOfGuests);
                    });

                    scope.$watch('selectedVal', function() {

                    });

                    //Scrolling Part
                    var scr = 0;
                    var scrollingBlock=0;
                    var scrollWidth;
                    var elemW = 120;
                    var scrollingAreaDiv ;

                    $(document).ready(function(){
                        scrollingAreaDiv = elem.find('.scrollingArea').first();
                    });

                    elem.find('.scrollLeft').first().on('click', function(){
                        if(scr>0) {
                            if(scr>elemW){
                                scr = (scr - elemW);
                            }else {
                                scr = 0;
                            }
                            scrollingAreaDiv.animate({
                                scrollLeft: scr
                            }, 400, function () {
                            });
                        }
                    });

                    elem.find('.scrollRight').first().on('click', function() {
                        scrollWidth = scrollingAreaDiv[0].scrollWidth - scrollingAreaDiv.width();
                        if(scrollWidth>scr) {
                            if((scrollWidth-scr)>elemW) {
                                scr += elemW;
                            }else{
                                scr += (scrollWidth-scr);
                            }
                            scrollingAreaDiv.animate({
                                scrollLeft: scr
                            }, 600, function () {
                            });
                        }
                    });
                }
            };
        }
    });
}(cloudPOS.directives || {}));

cloudPOS.ng.application.directive("guestMenuBar", [cloudPOS.directives.GuestMenuBarDirective]).run(function ($log) {
    $log.info("GuestMenuBarDirective initialized");
});