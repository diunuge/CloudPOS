(function (module) {
    cloudPOS.directives = _.extend(module, {

        DiningReservationPanelDirective: function (filterFilter) {

            return {
                restrict: "E",
                scope: {
                    tablesList: "=",
                    floorsList: "=",
                    reservationsList: "=",
                    isReady: "=?",
                    callback: "=",
                    reservationUpdateCallback: "=",
                    filterReservations: "="
                },
                templateUrl: "views/directives/DiningReservationPanelView.html",
                link: function ($scope, elem, attrs) {

                    $scope.FilteredTables = [];

                    $scope.isReady = ($scope.isReady === undefined) ? true : $scope.isReady;

                    var initialFiltering = function () {
                        if ($scope.tablesList !== undefined &&
                            $scope.floorsList !== undefined &&
                            $scope.reservationsList !== undefined) {

                            if (Array.isArray($scope.tablesList) &&
                                Array.isArray($scope.floorsList) &&
                                Array.isArray($scope.reservationsList)) {
                                if ($scope.floorsList.length > 0) {
                                    $scope.FilterTables($scope.floorsList[0].FloorId);
                                }
                            }
                        }
                    };

                    $scope.$watch("reservationsList", function (newVal) {
                        initialFiltering();
                    });

                    $scope.$watch("floorsList", function (newVal) {
                        initialFiltering()
                    });

                    $scope.$watch("tablesList", function (newVal) {
                        initialFiltering();
                    });

                    /// Filter tables according to the supplied floor id.
                    $scope.FilterTables = function (floorId) {

                        if(!$scope.isReady) {return -1;}
                        let tempTablesList = filterFilter($scope.tablesList, function (elem) {
                            return (elem.FloorId == floorId);
                        });

                        $scope.FilteredTables = (tempTablesList === undefined) ? [] : tempTablesList;
                        filterReservedTables();
                    };

                    /// Highlights reserved tables
                    var filterReservedTables = function () {

                        if(!$scope.isReady) {return -1;}

                        $scope.FilteredTables.forEach(function (elem) {
                            if (elem.hasOwnProperty("ReservedTable")) {
                                console.log("Deleted");
                                delete elem.ReservedTable;
                                delete elem.ReservationId;
                            }
                        });

                        $scope.reservationsList.forEach(function (elem) {
                            if (elem.ReservationDate.length == 0) {return false;}
                            let reservationDate = new Date(Number(elem.ReservationDate.substr(6, 13)));
                            let curDate = new Date(Date.now());

                            /*curDate.getFullYear() == reservationDate.getFullYear() &&
                             curDate.getMonth() == reservationDate.getMonth() &&
                             curDate.getDate() == reservationDate.getDate()*/

                            if (elem.Status == "A") {

                                for (let i1 = 0; i1 < $scope.FilteredTables.length; i1++) {
                                    for (let i2 = 0; i2 < elem.TableNos.length; i2++) {
                                        if (elem.TableNos[i2] == $scope.FilteredTables[i1].TblNo) {
                                            $scope.FilteredTables[i1].ReservedTable = "";
                                            $scope.FilteredTables[i1].ReservationId = elem.ReservationId;
                                            $scope.FilteredTables[i1].Reservation = elem;
                                            break;
                                        }
                                    }
                                }
                            }
                        });
                    };

                    $scope.UiHandlers = (function (scope) {
                        var handlers = {};
                        var TableButtons = [];
                        var isTouchStarted = false;

                        handlers.TablesClass = "resTables";

                        handlers.TouchEvents = {};
                        handlers.TouchEvents.OnTouchStart = function (e) {

                            if ($(e.currentTarget).attr("is-reserved") == "true") {
                                console.log("Touch Started");
                                isTouchStarted = true;
                                console.log($(e.currentTarget).attr("is-reserved"));
                                console.log(e);
                            }
                        };

                        handlers.TouchEvents.OnTouchEnd = function (e) {

                            if (isTouchStarted) {
                                let touch = e.originalEvent.changedTouches[0];
                                console.log($(elem).position());
                                TableButtons.each(function () {
                                    let elem = $(this);
                                    let pos = elem.offset();

                                    if (touch.pageX > pos.left && touch.pageY > pos.top) {
                                        /// console.log(elem);
                                        if (touch.pageX < (pos.left + elem.width()) &&
                                            touch.pageY < (pos.top + elem.height())) {

                                            let tableIndex = elem.attr("table-index");
                                            tableIndex = (tableIndex === undefined) ? -1 : Number(tableIndex);

                                            if (tableIndex > -1) {
                                                console.log("dfdfdfdfdfdf");

                                                let selectedTable = $scope.FilteredTables[tableIndex];

                                                if (selectedTable.ReservedTable === undefined) {
                                                    let movingTable = $scope.FilteredTables[Number($(e.currentTarget).attr("table-index"))];
                                                    let reservationId = (movingTable.ReservationId === undefined) ?
                                                        -1 : movingTable.ReservationId;
                                                    let reservation = undefined;
                                                    if (reservationId > -1) {
                                                        reservation = $scope.reservationsList.find(function (el) {
                                                            return el.ReservationId == reservationId;
                                                        });

                                                        if (reservation !== undefined) {
                                                            $scope.reservationUpdateCallback(reservation, movingTable, selectedTable);
                                                            console.log("Matched Element");
                                                            console.log(selectedTable);
                                                        }
                                                    }
                                                }
                                                else {
                                                    $scope.reservationUpdateCallback();
                                                }
                                            }
                                        }
                                    }
                                });
                                console.log("Touch Ended");
                            }

                            isTouchStarted = false;
                        };

                        handlers.TouchEvents.OnTouchMove = function (e) {

                        };
                        handlers.TouchEvents.OnTouchCancel = function (e) {
                            isTouchStarted = false;
                        };
                        handlers.TouchEvents.SetTouchEvents = function (e) {
                            console.log(e);
                        };
                        handlers.RepeatComplete = function (isRepeateComplete) {

                            if (isRepeateComplete) {
                                let tempLength = elem.find("." + handlers.TablesClass).length;
                                if (tempLength > TableButtons.length) {
                                    TableButtons = elem.find("." + handlers.TablesClass);
                                    TableButtons.on("touchstart", handlers.TouchEvents.OnTouchStart);
                                    TableButtons.on("touchmove", handlers.TouchEvents.OnTouchMove);
                                    TableButtons.on("touchend", handlers.TouchEvents.OnTouchEnd);
                                }
                            }
                        };

                        return handlers;
                    })($scope);

                    /// Return FilterTables method to the outer bound
                    $scope.filterReservations($scope.FilterTables);
                }
            };
        }
    });
}(cloudPOS.directives || {}));

cloudPOS.ng.application.directive("diningReservationPanel", [
    'filterFilter',
    cloudPOS.directives.DiningReservationPanelDirective
]).run(function ($log) {
    $log.info("DiningReservationPanelDirective initialized");
});