(function (module) {
    cloudPOS.controllers = _.extend(module, {
        ReservationController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                             uiConfigService, $http, TransactionHandler,
                                             ObjectFactoryService, filterFilter, ValidationService, MasterDataStorageHandler) {

            scope.reservationDataModule = (function (TransactionHandler) {

                var DataModule = {};
                DataModule.arResTimeSlots = [];

                DataModule.arResTables = [1, 2, 3, 4];
                DataModule.Reservations = [];
                DataModule.SelectedTimeSlot = {TimeSlot: null, TimeSlotString: "", Tables: []};
                DataModule.SelectedGuest = null;
                DataModule.TimeSlots = [];
                DataModule.FilterDate = new Date(Date.now());
                DataModule.FilterDateString = new Date(Date.now());
                DataModule.MinDate = new Date();
                DataModule.ReservationDto = {};
                DataModule.Guests = [];
                DataModule.GuestPhoneNumber = "";

                (function () {
                    var isFirstTime = false;

                    /// Reload calendar as FilterDate changes
                    scope.$watch("reservationDataModule.FilterDateString", function (newVal) {

                        if (newVal !== undefined && isFirstTime) {

                            resourceLoader.LoadAllResources(function () {

                                DataModule.Reservations = DataModule.FilterReservations(newVal, DataModule.Reservations);
                                DataModule.FillCalendar(DataModule.Reservations, DataModule.TimeSlots);
                            });

                            DataModule.FilterDate = newVal;
                        }

                        isFirstTime = true;
                    });

                    /// Filter guests information
                    scope.$watch("reservationDataModule.GuestPhoneNumber", function (newVal) {

                        if (newVal !== undefined) {
                            let guest = DataModule.FilterGuests(newVal);
                            if (guest != null && ValidationService.PhoneNumberValidation(newVal)) {
                                guest.IsNewGuest = false;
                                DataModule.ReservationDto.guestDetails = guest;
                                DataModule.SelectedGuest = guest;
                                DataModule.ReservationDto.reservationHeader.ReservationType = "standard";
                            }
                            else {
                                DataModule.ReservationDto.guestDetails = ObjectFactoryService.Objects.Admin.GetGuestDto().guest;
                                DataModule.ReservationDto.guestDetails.GuestAddressList = [ObjectFactoryService.Objects.Admin.GetGuestAddressDto()];
                                DataModule.ReservationDto.guestDetails.PhoneNumber = newVal;
                                /// DataModule.ReservationDto.guestDetails.GuestId = newVal;
                                DataModule.ReservationDto.guestDetails.Mobile = newVal;
                                DataModule.ReservationDto.guestDetails.Title = 1;
                                DataModule.ReservationDto.reservationHeader.Description = "";
                                DataModule.ReservationDto.guestDetails.FirstName = "";
                                DataModule.ReservationDto.guestDetails.LastName = "";
                                DataModule.ReservationDto.guestDetails.Email = "";
                                DataModule.ReservationDto.reservationHeader.ReservationType = "standard";
                                DataModule.SelectedGuest = null;
                            }
                        }
                    });
                })();

                var resourceLoader = (function (outerThis) {

                    var Loader = {};

                    /// Used to check the number of successful responses
                    let NoOfSuccessResponse = 0;
                    let TotalRequests = 4;

                    /// Load restaurant tables from the database
                    Loader.LoadResTables = function () {
                        var response = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetMasterFoodsData()).Tables;

                            if (response !== undefined && Array.isArray(response)) {
                                outerThis.arResTables = response;
                                NoOfSuccessResponse++;
                                Callback();
                            }
                            else {
                                outerThis.ResTables = [];
                            }
                    };

                    /// Load time slots from the database
                    Loader.LoadTimeSlots = function () {
                        var response = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAdminData()).TimeSlots;

                        if (response.TimeLoadDTOs !== undefined && Array.isArray(response.TimeLoadDTOs)) {
                            outerThis.arResTimeSlots = response.TimeLoadDTOs;

                            outerThis.TimeSlots = [];
                            response.TimeLoadDTOs.forEach(function (elem) {
                                outerThis.TimeSlots.push($.extend({}, elem));
                            });

                            JsonToDateConversion(outerThis.arResTimeSlots, "TimeLoadDate");

                            JsonToDateConversion(outerThis.TimeSlots, "TimeLoadDate");

                            DateToTimeSlotString(outerThis.arResTimeSlots, "TimeLoadDate");

                            console.log("Time Slots");
                            console.log(response.TimeLoadDTOs);
                            NoOfSuccessResponse++;
                            Callback();
                        }
                        else {
                            outerThis.ResTables = [];
                        }
                    };

                    /// Load reservations from the database
                    Loader.LoadReservations = function () {
                        TransactionHandler.Execute.Reservations.ReadAll(function (response) {
                            if (response.ReservationResponse !== undefined && Array.isArray(response.ReservationResponse)) {
                                outerThis.Reservations = response.ReservationResponse;
                                NoOfSuccessResponse++;
                                Callback();
                            }
                            else {
                                outerThis.Reservations = [];
                            }
                        });
                    };

                    /// Load guests from the database
                    Loader.LoadGuests = function () {
                        TransactionHandler.Execute.Guests.ReadAll(function (response){
                            if (response !== undefined && Array.isArray(response)) {
                                outerThis.Guests = response;
                                console.log(outerThis.Guests);
                                NoOfSuccessResponse++;
                                Callback();
                            }
                            else {
                                outerThis.Guests = [];
                            }
                        });
                    };

                    var outerCallback = ()=>{};

                    Loader.LoadAllResources = function (callback) {
                        outerCallback = callback;
                        DataModule.SelectedTimeSlot.TimeSlot = null;
                        DataModule.SelectedTimeSlot.TimeSlotString = "";
                        DataModule.SelectedTimeSlot.Tables = [];
                        Loader.LoadResTables();
                        Loader.LoadTimeSlots();
                        Loader.LoadReservations();
                        Loader.LoadGuests();
                    };

                    var Callback = function () {
                        if (NoOfSuccessResponse == TotalRequests) {
                            NoOfSuccessResponse = 0;
                            JsonToDateConversion(outerThis.Reservations, "ReservationDate");

                            outerCallback();
                            /// outerThis.Reservations = outerThis.FilterReservations(new Date(1498674600000), outerThis.Reservations);
                            /// outerThis.FillCalendar(outerThis.Reservations, outerThis.arResTimeSlots);
                        }
                    };

                    return Loader;
                })(DataModule);

                /// Filters reservations according to the reservation date
                DataModule.FilterReservations = function (reservationDate, reservations) {
                    if ((reservationDate) === undefined || reservationDate === "Invalid Date") {
                        return false;
                    }

                    var reservationsTemp = [];
                    var FullYear = reservationDate.getFullYear();
                    var Month = reservationDate.getMonth();
                    var DayOfTheMonth = reservationDate.getDate();

                    for (let i = 0; i < reservations.length; i++) {

                        let ReservationDate = JsonToDate(reservations[i].ReservationDate);
                        if (ReservationDate.getFullYear() == FullYear &&
                            ReservationDate.getMonth() == Month &&
                            ReservationDate.getDate() == DayOfTheMonth) {

                            reservationsTemp.push(reservations[i]);
                        }
                    }

                    return reservationsTemp;
                };

                /// Fill calendar with reservations
                DataModule.FillCalendar = function (reservations, timeSlots) {

                    $("[data-table-id]").css("background-color", "");

                    for (let i1 = 0; i1 < reservations.length; i1++) {

                        /// console.log(reservations);

                        let hours = reservations[i1].ReservationDate.getHours();
                        let minutes = reservations[i1].ReservationDate.getMinutes();

                        for (let i2 = 0; i2 < timeSlots.length; i2++) {

                            let timeLoadDate = timeSlots[i2].TimeLoadDate;
                            if (hours == timeLoadDate.getHours()) {
                                if (minutes <= timeLoadDate.getMinutes()) {
                                    for (let i3 = 0; i3 < reservations[i1].TableNos.length; i3++) {

                                        let item = $("[data-table-id='" + reservations[i1].TableNos[i3] + "'][data-time-slot='" + i2 + "']");
                                        item.css("background-color", "red");
                                        item.attr("reserved", "");
                                    }

                                    break;
                                }
                            }
                        }
                    }
                };

                /// Filter guests according to their phone numbers
                DataModule.FilterGuests = (function (dataModule) {

                    var response = function (phoneNumber) {
                        phoneNumber = Number(phoneNumber);



                        let responseGuest = null;
                        let filteredGuest = filterFilter(dataModule.Guests, function (elem) {
                            return (Number(phoneNumber) == Number(elem.GuestId));
                        });

                        /*console.log(dataModule.Guests);
                        console.log(filteredGuest);*/

                        if (filteredGuest !== undefined && (filteredGuest.length == 1 || phoneNumber == 0)) {
                            responseGuest = $.extend({}, filteredGuest[0]);
                            console.log(responseGuest);
                        }

                        return responseGuest;
                    };

                    return response;
                })(DataModule);

                /// Convert a json date object to a js date object
                var JsonToDate = function (jsonDate) {
                    /// jsonDate = Number(jsonDate.substr(6, 13));
                    return jsonDate;
                };

                /// Perform initial conversions on arrays
                var JsonToDateConversion = function (arr, propertyName) {
                    if (!Array.isArray(arr) || propertyName === undefined || propertyName == "") {
                        return false;
                    }

                    arr.forEach(function (elem) {
                        if(elem.hasOwnProperty(propertyName)) {
                            let jsonString = elem[propertyName];
                            let timeStamp = Number(jsonString.substr(6, 13));
                            elem[propertyName] = new Date(timeStamp);
                        }
                    });
                };

                /// Converts date objects to strings which contain hours, minutes, and "AM", "PM".
                var DateToTimeSlotString = function (arr, propertyName) {
                    if (!Array.isArray(arr) || propertyName === undefined || propertyName == "") {
                        return false;
                    }

                    for (let i = 0; i < arr.length; i++) {
                        let elem = arr[i];
                        if(elem.hasOwnProperty(propertyName)) {
                            let date = elem[propertyName];
                            elem[propertyName] = "";
                            let hours = date.getHours();
                            let minutes = date.getMinutes();

                            /// console.log(hours + " - " + minutes);

                            let timeString = ((hours > 12) ? hours - 12 : hours).toString();
                            timeString += " : ";
                            timeString += minutes.toString();
                            timeString += (hours > 11) ? " PM" : " AM";

                            /// console.log(timeString);

                            elem[propertyName] = timeString.toString();
                        }
                    }
                };

                /// Handles click event of the cross sections between tables and time slots.
                DataModule.TableTimeSlotClick = function (e, tableID, timeSlotIndex) {

                    var selectedTimeSlot = DataModule.SelectedTimeSlot;
                    timeSlotIndex = DataModule.TimeSlots[timeSlotIndex];

                    /// Check to see whether the time is passed or not.
                    var isTimePassed = (function (timeSlots, filterDate) {
                        let timeSlotDate = timeSlotIndex.TimeLoadDate;
                        let currentDate = new Date(Date.now());
                        let timeSlotHours = timeSlotDate.getHours();
                        let currentHours = currentDate.getHours();

                        return !((filterDate.getFullYear() == currentDate.getFullYear() &&
                        filterDate.getMonth() == currentDate.getMonth() && filterDate.getDate() >= currentDate.getDate())
                        && (timeSlotHours > currentHours ||
                        (timeSlotHours == currentHours && timeSlotDate.getMinutes() > currentDate.getMinutes()) ||
                        filterDate.getDate() > currentDate.getDate()));

                    })(DataModule.TimeSlots, DataModule.FilterDate);

                    /// Throw the control out of the function if isTimePassed is true
                    if (isTimePassed) {
                        /// alert("Cannot selected a passed time slots");
                        comSingleButtonInfoAlert("Reservation", "Can not select a passed time slot", "Got it!");
                        return false;
                    }

                    if ($(e.currentTarget).attr("Reserved") === undefined) {

                        if (selectedTimeSlot.TimeSlot == timeSlotIndex || selectedTimeSlot.TimeSlot == null) {

                            let length = selectedTimeSlot.Tables.length;
                            for (let i = 0; i < length; i++) {

                                if (selectedTimeSlot.Tables[i] == tableID) {
                                    selectedTimeSlot.Tables.splice(i, 1);

                                    $(e.currentTarget).css("background-color", "");
                                    break;
                                }
                                else if (i == selectedTimeSlot.Tables.length - 1) {
                                    selectedTimeSlot.Tables.push(tableID);
                                    $(e.currentTarget).css("background-color", "green");
                                }
                            }

                            if (selectedTimeSlot.TimeSlot == null) {
                                let ar = [{timeSlot: timeSlotIndex.TimeLoadDate}];
                                DateToTimeSlotString(ar, "timeSlot");
                                selectedTimeSlot.TimeSlot = timeSlotIndex;
                                selectedTimeSlot.TimeSlotString = ar[0].timeSlot;
                                selectedTimeSlot.Tables.push(tableID);
                                $(e.currentTarget).css("background-color", "green");
                            }
                            else if (selectedTimeSlot.Tables.length == 0) {
                                selectedTimeSlot.TimeSlot = null;
                                selectedTimeSlot.TimeSlotString = "";
                            }
                        }
                        else {
                            alert("Cannot choose different time slots");
                        }
                    }
                    else {
                        alert("Cannot reserved already reserved items");
                    }
                };

                /// Validate guest
                var ValidateGuest = function (guestDto) {
                    console.log(guestDto);
                    return (ValidationService.PhoneNumberValidation(guestDto.Mobile) &&
                    (guestDto.Email == "" || ValidationService.EmailValidation(guestDto.Email)) &&
                    guestDto.Title != 0 &&
                    guestDto.FirstName !== "");
                };

                /// Create a reservation.
                DataModule.CreateReservation = (function (dataModule, resLoader) {
                    var response = function () {

                        if (dataModule.SelectedTimeSlot.TimeSlot == null ||
                            dataModule.SelectedTimeSlot.TimeSlot === undefined) {
                            comSingleButtonErrorAlert("Guest", "Please select a timeslot", "Got it!");
                            return false;
                        }

                        let tablesAr = [];
                        let reservationDate = new Date(Date.now());
                        let timeSlotDate = dataModule.SelectedTimeSlot.TimeSlot.TimeLoadDate;
                        let jsonDate = "";

                        reservationDate.setFullYear(dataModule.FilterDate.getFullYear());
                        reservationDate.setHours(timeSlotDate.getHours());
                        reservationDate.setMinutes(timeSlotDate.getMinutes());
                        jsonDate = ("/Date(" + reservationDate.getTime() + "+0530)/");

                        /*console.error(timeSlotDate);
                        console.error(jsonDate);*/

                        for (let i = 0; i < dataModule.SelectedTimeSlot.Tables.length; i++) {
                            tablesAr.push(dataModule.SelectedTimeSlot.Tables[i].TblNo);
                        }

                        dataModule.ReservationDto.reservationHeader.ReservationDate = jsonDate;
                        dataModule.ReservationDto.reservationHeader.Status = "C";
                        dataModule.ReservationDto.reservationDetailList.NoTables = tablesAr;
                        dataModule.ReservationDto.reservationDetailList.TableNo = tablesAr.length;
                        dataModule.ReservationDto.reservationHeader.NoTables = tablesAr.length;



                        dataModule.ReservationDto.reservationHeader.GuestID = dataModule.ReservationDto.guestDetails.GuestId;
                        dataModule.ReservationDto.reservationHeader.GuestName = dataModule.ReservationDto.guestDetails.FirstName +
                        " " +
                        dataModule.ReservationDto.guestDetails.LastName;
                        console.error(dataModule.ReservationDto);

                        if (!ValidateGuest(dataModule.ReservationDto.guestDetails)) {
                            comSingleButtonErrorAlert("Guest", "Please provide all the information", "Got it!");
                            return false;
                        }
                        else if (DataModule.SelectedGuest == null) {
                            dataModule.ReservationDto.guestDetails.GuestAddressList =[ObjectFactoryService.Objects.Admin.GetGuestAddressDto()];
                            TransactionHandler.Execute.Guests.Create(function (response) {

                                if (response.IsSuccessFull) {
                                    comSingleButttonSuccessAlert("Guest Creation", "Guest created successfully!", "Got it!");
                                    dataModule.ReservationDto.reservationHeader.GuestId = response.Id;
                                    TransactionHandler.Execute.Reservations.Create(function (response2) {

                                        if (response2.IsSuccessFull) {
                                            comSingleButttonSuccessAlert("Reservation Creation", "Reservation created successfully!", "Got it!");
                                            DataModule.ReservationDto.guestDetails = ObjectFactoryService.Objects.Admin.GetGuestDto().guest;
                                            DataModule.GuestPhoneNumber = "";
                                            DataModule.ReservationDto.reservationHeader.NoOfGuest = 1;
                                            resLoader.LoadAllResources(()=> {
                                                DataModule.Reservations = dataModule.FilterReservations(new Date(Date.now()), dataModule.Reservations);
                                                DataModule.FillCalendar(dataModule.Reservations, dataModule.TimeSlots);
                                            });
                                        }
                                    }, dataModule.ReservationDto);
                                }

                                console.log(dataModule.ReservationDto.guestDetails);
                                console.log(response);
                            }, {guest: dataModule.ReservationDto.guestDetails});
                        }
                        else {
                            TransactionHandler.Execute.Reservations.Create(function (response) {
                                comSingleButttonSuccessAlert("Reservation Panel", "Reservation created successfully!", "Got it!");
                                DataModule.ReservationDto.guestDetails = ObjectFactoryService.Objects.Admin.GetGuestDto().guest;
                                DataModule.GuestPhoneNumber = "";
                                DataModule.ReservationDto.reservationHeader.NoOfGuest = 1;
                                resLoader.LoadAllResources(()=> {
                                    DataModule.Reservations = dataModule.FilterReservations(new Date(Date.now()), dataModule.Reservations);
                                    DataModule.FillCalendar(dataModule.Reservations, dataModule.TimeSlots);
                                });
                            }, dataModule.ReservationDto);
                        }
                    };

                    return response;
                })(DataModule, resourceLoader);

                /// Updates a reservation
                DataModule.UpdateReservation = (function (dataModule) {
                    var response = function () {

                    };

                    return response;
                })(DataModule);

                /// Initializes the module
                (function (dataModule, resourceLoader) {
                    resourceLoader.LoadAllResources(()=> {
                        DataModule.Reservations = DataModule.FilterReservations(new Date(Date.now()), DataModule.Reservations);
                        DataModule.FillCalendar(DataModule.Reservations, DataModule.TimeSlots);
                    });
                    dataModule.ReservationDto = ObjectFactoryService.Objects.Reservations.GetReservationDto();
                    dataModule.ReservationDto.reservationHeader.NoOfGuest = 1;
                })(DataModule, resourceLoader);

                return DataModule;
            })(TransactionHandler);

            // UI Handlers
            scope.uiHandlers = {};
        }
    });
    cloudPOS.ng.application.controller('ReservationController', [
        '$scope',
        '$location',
        'SessionManager',
        '$translate',
        '$rootScope',
        'localStorageService',
        'keyboardManager',
        '$idle',
        'tmhDynamicLocale',
        'UIConfigService',
        '$http',
        'TransactionHandlerService',
        'ObjectFactoryService',
        'filterFilter',
        'ValidationService',
        'MasterDataStorageHandler',
        cloudPOS.controllers.ReservationController
    ]).run(function ($log) {
        $log.info("ReservationController initialized");
    });
}(cloudPOS.controllers || {}));
