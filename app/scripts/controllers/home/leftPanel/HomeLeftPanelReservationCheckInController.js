(function (module) {
    cloudPOS.controllers = _.extend(module, {
        HomeLeftPanelReservationCheckInController: function (scope, translate, $rootScope,
                                           uiConfigService, UrlFactory,
                                           MasterDataStorageHandler, filterFilter,
                                           TransactionHandler, ObjectFactoryService, CommonMessages) {

            ///
            scope.ReservationCheckInDataModule = (function () {
                var DataModule = {};

                DataModule.Reservations = [];

                DataModule.Guests = [];

                DataModule.SelectedReservation = null;

                var Callback = function () {
                    if (Array.isArray(DataModule.Guests) && DataModule.Guests.length > 0 &&
                        Array.isArray(DataModule.Reservations) && DataModule.Reservations.length > 0) {
                        /// alert("filtering");
                        DataModule.Reservations.forEach(function (reservation) {
                            var guest = DataModule.Guests.find(function (guest) {
                                return (reservation.GuestId == guest.GuestId);
                            });

                            /// console.error(reservation);
                            /// console.error(guest);

                            if (guest !== undefined) {
                                reservation.GuestName = guest.FirstName + " " + guest.LastName;
                            }
                        });
                    }
                };

                DataModule.LoadGuests = function () {
                    TransactionHandler.Execute.Guests.ReadAll(function (response) {
                        DataModule.Guests = response;
                        Callback();
                    });
                };

                DataModule.ReloadReservations = function () {
                    TransactionHandler.Execute.Reservations.ReadAll(function (response) {
                        DataModule.Reservations = response.ReservationResponse;
                        console.log("Reservations reloaded!");
                        Callback();
                    });
                };

                var UpdateReservation = function (reservation, reservationID) {
                    let reservationDto = ObjectFactoryService.Objects.Reservations.GetReservationDto();
                    reservationDto.guestDetails = null;
                    reservationDto.reservationDetailList.ReservationId = reservation.ReservationId;
                    reservationDto.reservationDetailList.RestaurantID = reservation.ResId;
                    reservationDto.reservationDetailList.NoTables = reservation.TableNos;
                    reservationDto.reservationHeader = reservation;

                    TransactionHandler.Execute.Reservations.UpdateById(function (response) {
                        console.log(response);
                        DataModule.ReloadReservations();
                        DataModule.LoadGuests();
                        scope.HomeDataModule.MiddlePanel.NewOrderPanel.DiningOrder.Init(function () {
                            let filterReservations = scope.HomeDataModule.MiddlePanel.NewOrderPanel.DiningOrder.ReservationFilteringCallback.FilterReservations;
                            let floorId = scope.HomeDataModule.MiddlePanel.NewOrderPanel.DiningOrder.FloorsList[0].FloorId;
                            /// console.log(filterReservations);
                            filterReservations(floorId);
                            /// console.log("Filter Reservations");
                        });
                    }, reservationDto, reservationID);
                };

                DataModule.CheckIn = function () {

                    var isOverlaped = false;
                    DataModule.Reservations.forEach(function (elem) {
                        if (elem.Status.toUpperCase() == "A") {
                            DataModule.SelectedReservation.TableNos.forEach(function (tableId1) {
                                elem.TableNos.forEach(function (tableId2) {
                                    if (tableId1 == tableId2) {
                                        isOverlaped = true;
                                    }
                                });
                            });
                        }
                    });

                    if (isOverlaped) {
                        comSingleButtonErrorAlert("Table overlap", "Tables in the reservation, are already reserved", "Got it!");
                    }
                    else {
                        if (DataModule.SelectedReservation.Status == "C") {
                            DataModule.SelectedReservation.Status = "A";
                            UpdateReservation(DataModule.SelectedReservation, DataModule.SelectedReservation.ReservationId);
                        }
                    }
                };

                DataModule.CancelReservation = function () {
                    if (DataModule.SelectedReservation.Status == "A") {
                        DataModule.SelectedReservation.Status = "D";
                        UpdateReservation(DataModule.SelectedReservation, DataModule.SelectedReservation.ReservationId);
                    }
                };

                DataModule.ReservationClick = function (e, reservation) {
                    console.log(reservation);
                    DataModule.SelectedReservation = reservation;
                };

                return DataModule;
            })();

            scope.HomeDataModule.LeftPanel = (function (leftPanel) {
                leftPanel.ReservationCheckInDataModule = scope.ReservationCheckInDataModule;

                return leftPanel;
            })(scope.HomeDataModule.LeftPanel || {});

            /// Initializes the module
            (function () {
                scope.ReservationCheckInDataModule.ReloadReservations();
                scope.ReservationCheckInDataModule.LoadGuests();
            })();
        }
    });
    cloudPOS.ng.application.controller('HomeLeftPanelReservationCheckInController', [
        '$scope',
        '$translate',
        '$rootScope',
        'UIConfigService',
        'UrlFactory',
        'MasterDataStorageHandler',
        'filterFilter',
        'TransactionHandlerService',
        'ObjectFactoryService',
        'CommonMessages',
        cloudPOS.controllers.HomeLeftPanelReservationCheckInController
    ]).run(function ($log) {
        $log.info("HomeLeftPanelReservationCheckInController initialized");
    });
}(cloudPOS.controllers || {}));
