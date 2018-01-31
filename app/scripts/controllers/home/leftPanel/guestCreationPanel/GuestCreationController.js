(function (module) {
    cloudPOS.controllers = _.extend(module, {
        GuestCreationController: function (scope, sessionManager, $rootScope, localStorageService, $idle, uiConfigService,
                                           $http, filterFilter, MasterDataStorageHandler,
                                           CommonMessages, TransactionHandler, ObjectFactoryService, ValidationService) {

            scope.GuestCreationDataModule = (function () {
                var DataModule = {};
                var GuestsList = [];

                DataModule.FilterGuests = function (phoneNumber) {
                    let guest = GuestsList.find(function (elem) {
                        return (elem.GuestId.toString().indexOf(phoneNumber) != -1);
                    });

                    scope.LeftPanelDataModule.AdvanceDeposit.SelectedGuest = (guest === undefined) ? null : guest;
                };

                var LoadGuests = function (callback) {

                    TransactionHandler.Execute.Guests.ReadAll(function (response) {
                        GuestsList = response;
                        if (callback !== undefined) {
                            callback(response);
                        }
                    });
                };

                DataModule.CreateGuest = function () {
                    scope.LeftPanelDataModule.AdvanceDeposit.CreateGuest(function (response) {
                        if (response.IsSuccessFull) {
                            LoadGuests(function () {
                                DataModule.FilterGuests(response.Id);
                            });
                        }
                    });
                };

                /// Watches
                scope.$watch("LeftPanelDataModule.AdvanceDeposit.GuestID", function (newVal) {
                    console.log(newVal);
                    let number = Number(newVal);

                    if (newVal === undefined) {
                        return false;
                    }

                    if (isNaN(number)) {
                        newVal = 0;
                    }
                    else {
                        if (ValidationService.PhoneNumberValidation(newVal)) {
                            DataModule.FilterGuests(newVal);
                        }
                        else {
                            scope.LeftPanelDataModule.AdvanceDeposit.SelectedGuest = null;
                        }
                    }
                });

                scope.$watch("LeftPanelDataModule.AdvanceDeposit.SelectedGuest", function (newVal) {
                    if (newVal === undefined) {
                        return false;
                    }

                    if (newVal == null) {
                        /// scope.HomeDataModule.LeftPanelDataModule.AdvanceDeposit.GuestID = 0;
                        scope.HomeDataModule.LeftPanelDataModule.AdvanceDeposit.Email = "";
                        scope.HomeDataModule.LeftPanelDataModule.AdvanceDeposit.FirstName = "";
                        scope.HomeDataModule.LeftPanelDataModule.AdvanceDeposit.LastName = "";
                        scope.HomeDataModule.LeftPanelDataModule.AdvanceDeposit.Remarks = "";
                        scope.HomeDataModule.LeftPanelDataModule.AdvanceDeposit.Title = 1;
                    }
                    else {
                        scope.HomeDataModule.LeftPanelDataModule.AdvanceDeposit.GuestID = newVal.GuestId;
                        scope.HomeDataModule.LeftPanelDataModule.AdvanceDeposit.Email = newVal.Email;
                        scope.HomeDataModule.LeftPanelDataModule.AdvanceDeposit.FirstName = newVal.FirstName;
                        scope.HomeDataModule.LeftPanelDataModule.AdvanceDeposit.LastName = newVal.LastName;
                        scope.HomeDataModule.LeftPanelDataModule.AdvanceDeposit.Title = newVal.Title;
                    }

                });

                /// Initializes the module
                (function () {
                    LoadGuests();
                })();

                return DataModule;
            })();
        }
    });
    cloudPOS.ng.application.controller('GuestCreationController', [
        '$scope',
        'SessionManager',
        '$rootScope',
        'localStorageService',
        '$idle',
        'UIConfigService',
        '$http',
        'filterFilter',
        'MasterDataStorageHandler',
        'CommonMessages',
        'TransactionHandlerService',
        'ObjectFactoryService',
        'ValidationService',
        cloudPOS.controllers.GuestCreationController
    ]).run(function ($log) {
        $log.info("GuestCreationController initialized");
    });
}(cloudPOS.controllers || {}));
