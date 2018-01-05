(function (module) {
    cloudPOS.controllers = _.extend(module, {
        NewOrderPanelController: function (scope, translate, $rootScope,
                                  uiConfigService, $http, $filter, UrlFactory,
                                  MasterDataStorageHandler, filterFilter,
                                  TransactionHandler, ObjectFactoryService, CommonMessages, ValidationService) {

            /// Data retrieval and manipulation operations are handled by
            /// the object.
            scope.HomeDataModule.MiddlePanel.NewOrderPanel = new (function () {

                /// Holds time slots
                var TimeSlots = [];

                var This = this;

                /// Data manipulation operations of the DiningOrderPanel
                this.DiningOrder = new (function () {

                    /// Holds an array of objects which contains objects representing tables of the restaurant.
                    this.Tables = [];

                    /// Boolean value indicates that the reservation panel's initialization has been completed,
                    /// and secondary operations can be performed.
                    this.IsReady = false;

                    /// Contains all the reservations confirmed or unconfirmed.
                    this.Reservations = [];

                    /// Tables filtered out for a particular floor of the restaurant.
                    this.FilteredTables = [];

                    this.FloorsList = (function () {
                        let floors = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAdminData()).Floors;

                        return (floors === undefined) ? [] : floors;
                    })();

                    this.ReservationFilteringCallback = (function () {
                        var ob = {};
                        ob.callback = function (callback) {
                            if (ob.FilterReservations == null) {
                                /// alert("Callback");
                                ob.FilterReservations = callback;
                            }
                        };

                        ob.FilterReservations = null;

                        return ob;
                    })();

                    /// Holds the users of the restaurant
                    this.UsersSelectionModelBox = new (function (global) {
                        var This = this;
                        this.Users = [];
                        this.IsShowUp = false;
                        this.SelectedTable = {};
                        this.Callback = function (isConfirmed, selectedOption) {

                            if (selectedOption != null) {
                                /// alert(selectedOption.FirstName + " " + selectedOption.LastName + " " + This.SelectedTable.TblName);
                                global.CreateReservation(This.SelectedTable);
                            }
                        };

                        this.OpenPopup = function (item) {
                            This.SelectedTable = item;

                            if (item.ReservedTable === undefined) {
                                console.error(scope.SystemSettings);
                                if (scope.SystemSettings.SettingsDto.SystemSettings.RestrictTablesForWaiters !== undefined &&
                                    scope.SystemSettings.SettingsDto.SystemSettings.RestrictTablesForWaiters.Value) {
                                    scope.HomeDataModule.MiddlePanel.NewOrderPanel.DiningOrder.UsersSelectionModelBox.IsShowUp = true;
                                }
                                else {
                                    global.CreateReservation(This.SelectedTable);
                                }
                            }
                            else {

                                TransactionHandler.Execute.Order.ReadByOrderCategoryId(function (response) {
                                    if (response.IsSuccessFull) {
                                        let order = response.OrderHeaderResponse.find(function (elem) {
                                            return Number(elem.ReservationID) == Number(item.ReservationId);
                                        });

                                        /// order = (order === undefined) ? 0 : order.OrderID;
                                        console.error(item);

                                        if (order === undefined) {
                                            scope.HomeDataModule.AddNewOrder(scope.HomeDataModule.OrderCategories.DiningOrder,
                                                item.ReservationId, 0);
                                            console.error(item.Reservation);
                                            let orderTemp = scope.HomeDataModule.SelectedOrder.Order;
                                            orderTemp.Tables = item.Reservation.TableName;
                                            console.error(orderTemp);
                                        }
                                        else {
                                            order.Tables = item.Reservation.TableName;
                                            order.ReservationId = item.ReservationId;
                                            scope.HomeDataModule.SelectedOrder.Order = order;
                                            scope.HomeDataModule.GetOrderDetails();
                                            scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.BodyArea.ToOrderDetailView();
                                            scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToOrderView();
                                        }

                                        scope.HomeDataModule.SelectedOrder.Reservation = item.Reservation;
                                    }

                                }, scope.HomeDataModule.OrderCategories.DiningOrder.OrderCategoryId);
                            }
                        };
                    })(this);

                    /// Filters tables according to floor IDs.
                    this.FilterTables = function (floorId) {
                        let tempTablesList = filterFilter(this.Tables, function (elem) {
                            return (elem.FloorId == floorId);
                        });

                        this.FilteredTables = (tempTablesList === undefined) ? [] : tempTablesList;
                    };

                    /// Creates a dining order,
                    /// to the selected reservation
                    this.MakeNewDiningOrder = function (table) {
                        let diningOrder = scope.HomeDataModule.OrderCategories.DiningOrder;
                        scope.HomeDataModule.AddNewOrder(diningOrder, table);
                    };

                    this.CreateReservation = function (table) {

                        let loginHelpingData = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetLoginHelpingData());
                        let reservation = ObjectFactoryService.Objects.Reservations.GetReservationDto();
                        let defaultGuest = undefined;
                        let guests = null;
                        let curTime = new Date(Date.now());

                        let currentTimeSlot = TimeSlots.TimeLoadDTOs.find(function(elem) {
                            let timeLoadDate = new Date(Number(elem.TimeLoadDate.substr(6, 13)));

                            if (timeLoadDate.getHours() == curTime.getHours() &&
                                timeLoadDate.getMinutes() > curTime.getMinutes()) {
                                console.log(timeLoadDate);
                            }

                            if (timeLoadDate.getHours() == curTime.getHours() && timeLoadDate.getMinutes() > curTime.getMinutes()) {
                                /// console.error();
                                return true
                            }
                            else if (timeLoadDate.getHours() == (curTime.getHours() + 1)) {
                                return true
                            }

                            return false;
                        });

                        /// let timeStamp = (currentTimeSlot === undefined) ? Date.now() : new Date(Number(currentTimeSlot.TimeLoadDate.substr(6, 13))).getTime();
                        console.error(currentTimeSlot);
                        if (currentTimeSlot !== undefined) {
                            currentTimeSlot = (currentTimeSlot.TimeLoadDate === undefined) ? new Date(Date.now()) : new Date(Number(currentTimeSlot.TimeLoadDate.substr(6, 13)));
                            currentTimeSlot.setFullYear(curTime.getFullYear());
                            currentTimeSlot.setMonth(curTime.getMonth());
                            currentTimeSlot.setDate(curTime.getDate());
                        }
                        else {
                            /// currentTimeSlot = new Date(Date.now());
                            ///alert("Undefined");
                        }

                        console.error(currentTimeSlot);

                        reservation.reservationHeader.ResId = loginHelpingData.RestaurantId;
                        reservation.reservationHeader.NoTables = "1";
                        reservation.reservationHeader.ReservationType = "STANDARD";
                        reservation.reservationHeader.ReservationDate = "/Date(" + currentTimeSlot.getTime() + "+0530)/";
                        reservation.reservationHeader.Description = "OPEN TABLE";
                        reservation.reservationHeader.Status = "A";
                        reservation.reservationHeader.FloorId = table.FloorId;

                        reservation.reservationDetailList.TableNo = "1";
                        reservation.reservationDetailList.NoTables = [table.TblNo];
                        reservation.reservationDetailList.RestaurantID = loginHelpingData.RestaurantId;
                        reservation.reservationDetailList.Status = 1;

                        console.log(currentTimeSlot);
                        console.log(currentTimeSlot.getTime());

                        /// console.error(reservation);
                        guests = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAdminData()).Guests;

                        defaultGuest = filterFilter(guests, function (elem) {
                            return (elem.GuestId == 0);
                        });

                        if (defaultGuest === undefined) {
                            console.warn(CommonMessages.WarnMessages.defaultGuestNotFount);
                            return -1;
                        }
                        else if (defaultGuest.length > 0) {
                            let dGuest = {
                                "GuestId": defaultGuest[0].GuestId,
                                "ResID": defaultGuest[0].ResID,
                                "Title": defaultGuest[0].Title,
                                "Description": "",
                                "FirstName": defaultGuest[0].FirstName,
                                "LastName": defaultGuest[0].LastName,
                                "Mobile": defaultGuest[0].PhoneNumber,
                                "PhoneNumber": defaultGuest[0].PhoneNumber,
                                "Email": defaultGuest[0].Email,
                                "OrderType": "N",
                                "GuestAddresses": null
                            };

                            reservation.guestDetails = dGuest;
                        }

                        console.error("Reservation");
                        console.error(reservation);
                        TransactionHandler.Execute.Reservations.Create(function (response) {
                            console.log(response);
                            if (response.IsSuccessFull == true) {
                                scope.HomeDataModule.AddNewOrder(scope.HomeDataModule.OrderCategories.DiningOrder,
                                    response.Id);
                                scope.HomeDataModule.SelectedOrder.Order.Tables = [table.TblName];
                            }
                            else {
                                /// alert("Something went wrong!!!");
                                comSingleButtonErrorAlert("Reservation Creation Failed",
                                    "Reservation creation failed due to : " + response.Message,
                                    "Got it!");
                            }
                        }, reservation);
                    };

                    this.UpdateReservation = function (reservation, sourceTable, destinationTable) {

                        console.log(reservation);
                        console.log(sourceTable);
                        console.log(destinationTable);

                        if (reservation && sourceTable && destinationTable) {

                            for (let i = 0; i < reservation.TableNos.length; i++) {
                                if (reservation.TableNos[i] == sourceTable.TblNo) {
                                    reservation.TableNos[i] = destinationTable.TblNo;
                                    break;
                                }
                            }

                            let reservationDto = ObjectFactoryService.Objects.Reservations.GetReservationDto();
                            reservationDto.guestDetails = null;
                            reservationDto.reservationDetailList.ReservationId = reservation.ReservationId;
                            reservationDto.reservationDetailList.RestaurantID = reservation.ResId;
                            reservationDto.reservationDetailList.NoTables = reservation.TableNos;
                            reservationDto.reservationHeader = reservation;

                            TransactionHandler.Execute.Reservations.UpdateById(function (response) {
                                console.log(response);
                                scope.HomeDataModule.MiddlePanel.NewOrderPanel.DiningOrder.Init(()=>{});
                                scope.HomeDataModule.LeftPanel.ReservationCheckInDataModule.ReloadReservations();
                            }, reservationDto, reservation.ReservationId);
                        }
                        else {
                            /// alert("Cannot reserve already reserved tables");
                        }
                    };

                    /// Initializes the reservation panel
                    this.Init = function (callback) {
                        let tablesList = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetMasterFoodsData()).Tables;
                        /// alert(this.UsersSelectionModelBox);
                        this.UsersSelectionModelBox.Users = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAdminData()).Users;
                        console.log(this.UsersSelectionModelBox.Users);
                        let reservations = [];
                        let This = this;

                        TransactionHandler.Execute.Reservations.ReadAll((response)=>{

                            reservations = (response.ReservationResponse === undefined) ? [] : response.ReservationResponse;
                            This.Reservations = reservations;

                            console.error("Reservations loaded");
                            console.error(response);

                            This.IsReady = true;
                            if (callback !== undefined) {
                                console.log(reservations);
                                callback();
                            }
                        });

                        this.Tables = tablesList;
                    };
                })();

                /// Creates new takeout order
                this.CreateTakeoutOrder = function () {

                    scope.HomeDataModule.CreateOrder.CreateTakeoutOrder();
                };

                /// Save order to the default guest
                this.GoToPayment = function () {
                    scope.HomeDataModule.CreateOrder.CreateTakeoutOrder(function (response) {
                        if (response.IsSuccessFull) {
                            let orderID = response.Id;

                            scope.HomeDataModule.OrdersData.LoadOrders(scope.HomeDataModule.SelectedOrder.OrderCategory, function (orders) {
                                let order = orders.find(function (elem) {
                                    return elem.OrderID == orderID;
                                });

                                if (order !== undefined) {
                                    scope.HomeDataModule.RightPanel.RetrieveOrderDetails(order, function (orderDetails) {
                                        console.log(scope.HomeDataModule.OrdersData.OrderCategory);
                                        if (orderDetails !== undefined &&
                                            Array.isArray(orderDetails) &&
                                            orderDetails.length > 0) {
                                            /// Do Something!!!
                                            /// alert("Order Saved Successfully");
                                            console.log(scope.UiHandlers);
                                            scope.UiHandlers.HomePageUi.LeftPanel.ToggleMainBodyArea();
                                        }
                                    });
                                }
                            });
                        }
                    });
                };

                this.GoToOrderPanel = function () {
                    scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToOrderView();
                    scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.BodyArea.ToOrderDetailView();
                };

                this.IsConfirmed = false;

                this.DeliveryZones = (function () {
                    var deliveryZones = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAdminData()).DeliveryZones;
                    return (deliveryZones === undefined) ? [] : deliveryZones;
                })();

                this.SelectedDeliveryZone = null;

                scope.$watch("HomeDataModule.MiddlePanel.NewOrderPanel.SelectedDeliveryZone", function (newVal) {
                    if (newVal !== undefined && newVal != null) {
                        scope.HomeDataModule.MiddlePanel.NewOrderPanel.SetDeliveryZone(newVal);
                    }
                });

                this.SetDeliveryZone = function (dZone) {
                    var address = This.GuestsInformationFilter.GuestAddress;

                    address.ZoneCode = dZone.DeliveryZoneID;
                    address.DeliveryRate = dZone.DeliveryRate;
                };

                var Validation = (function () {
                    var validation = {};

                    validation.GuestValidation = function () {
                        var guestDto = This.GuestsInformationFilter.GuestDto;

                        console.error(guestDto);

                       /* return (ValidationService.PhoneNumberValidation(guestDto.PhoneNumber) &&
                         ValidationService.EmailValidation(guestDto.Email) &&
                         guestDto.Title != 0 &&
                         guestDto.FirstName !== "" &&
                         guestDto.LastName !== "");*/

                        return (ValidationService.PhoneNumberValidation(guestDto.PhoneNumber) &&
                        (guestDto.Email == "" || ValidationService.EmailValidation(guestDto.Email)) &&
                        guestDto.Title != 0 &&
                        guestDto.FirstName !== "");
                    };

                    validation.AddressValidation = function () {
                        var address = This.GuestsInformationFilter.GuestAddress;
                        return (address.Location != "" &&
                        address.Address1 != "");
                    };

                    return validation;
                })();

                /// Creates a new order
                this.CreateOrder = function () {

                    if (!Validation.GuestValidation()) {
                        comSingleButtonErrorAlert("Guest", "Please provide all the information", "Got it!");
                        return false;
                    }

                    if (scope.HomeDataModule.SelectedOrder.OrderCategory === scope.HomeDataModule.OrderCategories.DeliveryOrder) {
                        if (!Validation.AddressValidation()) {
                            comSingleButtonErrorAlert("Guest", "Please provide valid address details", "Got it!");
                            return false;
                        }

                        if (scope.HomeDataModule.MiddlePanel.NewOrderPanel.SelectedDeliveryZone == null) {
                            comSingleButtonErrorAlert("Guest", "Please provide delivery charges", "Got it!");
                            return false;
                        }
                    }

                    var guestDto = this.GuestsInformationFilter.GuestDto;
                    var guestInfoFilter = this.GuestsInformationFilter;
                    var guestId = 0;
                    var This = this;
                    This.IsConfirmed = true;

                    var callback = function (response) {
                        if (response.IsSuccessFull) {
                            comSingleButttonSuccessAlert("Order created successfully", "Order has been created successfully", "Got it!");
                            This.GuestsInformationFilter.GuestDto = ObjectFactoryService.Objects.Admin.GetGuestDto().guest;
                            /// console.error(ObjectFactoryService.Objects.Admin.GetGuestDto().guest);
                            /// console.error(This.GuestsInformationFilter.GuestDto);


                            switch (scope.HomeDataModule.SelectedOrder.OrderCategory) {
                                case scope.HomeDataModule.OrderCategories.TabOrder:
                                    if (scope.SystemSettings.SettingsDto.SystemSettings.CloseTabsOrderOnSave.Value) {
                                        This.GuestsInformationFilter.GuestDto = ObjectFactoryService.Objects.Admin.GetGuestDto().guest;
                                        scope.HomeDataModule.DeselectOrder();
                                    }
                                    else {
                                        scope.HomeDataModule.LoadOrderDetails(response.Id,
                                            scope.HomeDataModule.SelectedOrder.OrderCategory, function (orderDetails) {
                                                This.GuestsInformationFilter.GuestDto = ObjectFactoryService.Objects.Admin.GetGuestDto().guest;
                                            });
                                    }
                                    break;
                                case scope.HomeDataModule.OrderCategories.TakeoutOrder:
                                    if (scope.SystemSettings.SettingsDto.SystemSettings.CloseTakeOutOnSave.Value) {
                                        This.GuestsInformationFilter.GuestDto = ObjectFactoryService.Objects.Admin.GetGuestDto().guest;
                                        scope.HomeDataModule.DeselectOrder();
                                    }
                                    else {
                                        scope.HomeDataModule.LoadOrderDetails(response.Id,
                                            scope.HomeDataModule.SelectedOrder.OrderCategory, function (orderDetails) {
                                                This.GuestsInformationFilter.GuestDto = ObjectFactoryService.Objects.Admin.GetGuestDto().guest;
                                            });
                                    }
                                    break;
                                case scope.HomeDataModule.OrderCategories.DeliveryOrder:
                                    break;
                                default:

                            }
                        }
                    };

                    /// Used for delivery orders
                    /// First create new order
                    /// and then, redirect to the home panel
                    var RedirectToHome = function (guestID) {
                        scope.HomeDataModule.AddNewOrder(scope.HomeDataModule.OrderCategories.DeliveryOrder);
                        if (scope.HomeDataModule.SelectedOrder.Order.OrderID !== undefined) {
                            let DeliveryCharge = scope.HomeDataModule.MiddlePanel.NewOrderPanel.SelectedDeliveryZone;
                            scope.HomeDataModule.SelectedOrder.Order.GuestID = guestID;
                            scope.HomeDataModule.SelectedOrder.Order.DeliveryCharges = (DeliveryCharge == null || DeliveryCharge === undefined) ? 0 : DeliveryCharge.DeliveryRate;
                            scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToOrderView();
                            scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.BodyArea.ToOrderDetailView();
                            console.error(scope.HomeDataModule.SelectedOrder.Order);
                        }
                    };

                    console.log(guestDto);
                    /// if (guestDto.Guest)

                    if (guestDto.GuestId == 0) {
                        let address = (this.GuestsInformationFilter.GuestAddress.Address1 != "") ? this.GuestsInformationFilter.GuestAddress : [];

                        guestDto.GuestId = this.GuestsInformationFilter.PhoneNumber;
                        guestDto.GuestAddressList = [];

                        if (address != null) {
                            guestDto.GuestAddressList.push(address);
                        }

                        console.error({"guest": guestDto});

                        TransactionHandler.Execute.Guests.Create((response)=>{

                            console.log(response);

                            if (scope.HomeDataModule.SelectedOrder.OrderCategory === scope.HomeDataModule.OrderCategories.DeliveryOrder) {
                                RedirectToHome(response.Id);
                            }
                            else {
                                scope.HomeDataModule.SelectedOrder.Order.GuestID = response.Id;
                                scope.HomeDataModule.CreateOrder.CreateTakeoutOrder(callback);
                            }

                        }, {"guest": guestDto});
                    }
                    else if (this.GuestsInformationFilter.GuestDto.GuestID != 0) {

                        /// Set guestId to the orderHeader
                        scope.HomeDataModule.SelectedOrder.Order.GuestID = guestDto.GuestId;

                        if (scope.HomeDataModule.SelectedOrder.OrderCategory.OrderCategoryId == scope.HomeDataModule.OrderCategories.DeliveryOrder.OrderCategoryId &&
                            guestInfoFilter.GuestAddress.AddressID == 0) {

                            guestInfoFilter.GuestAddress.Status = 1;

                            guestDto.GuestAddressList = [guestInfoFilter.GuestAddress];

                            console.error(guestDto);

                            /// alert("AddressID zero.");

                            TransactionHandler.Execute.Guests.Create((response)=> {

                                console.log(response);
                                /// scope.HomeDataModule.SelectedOrder.Order.GuestID = response.Id;
                                if (scope.HomeDataModule.SelectedOrder.OrderCategory === scope.HomeDataModule.OrderCategories.DeliveryOrder) {
                                    RedirectToHome(response.Id);
                                }
                                else {
                                    scope.HomeDataModule.CreateOrder.CreateTakeoutOrder(callback);
                                }

                            }, {"guest": guestDto});
                        }
                        else {
                            if (scope.HomeDataModule.SelectedOrder.OrderCategory === scope.HomeDataModule.OrderCategories.DeliveryOrder) {
                                console.log(guestDto);
                                RedirectToHome(guestDto.GuestId);
                            }
                            else {
                                scope.HomeDataModule.CreateOrder.CreateTakeoutOrder(callback);
                            }
                        }
                    }
                };

                /// Filter out the phone number of the guest from the cached data,
                /// if found, fill required fields automatically according to values of the filtered guest
                /// otherwise, create a new guest.
                this.GuestsInformationFilter = (function (scope) {
                    var guestInformationFilter = {};
                    var guestsList = [];

                    /// Properties
                    guestInformationFilter.PhoneNumber = 0;

                    /// Contains a particular address of a guest
                    guestInformationFilter.GuestAddress = {};

                    /// Guest addresses list
                    guestInformationFilter.GuestAddressesList = [];

                    /// Guest object
                    guestInformationFilter.GuestDto = {};

                    /// Watch PhoneNumber property for changes
                    scope.$watch(()=>guestInformationFilter.PhoneNumber, function (newVal) {

                        var phoneNumber = Number(newVal);
                        if (!isNaN(phoneNumber) && phoneNumber && phoneNumber.toString().length >= 9) {
                            let guest = guestsList.find(function (elem) {
                                return (elem.GuestId.toString().indexOf(phoneNumber.toString()) != -1);
                            });

                            /// console.log(guestsList);

                            if (guest) {
                                let guestHolder = {};
                                let newAddress = ObjectFactoryService.Objects.Admin.GetGuestAddressDto();

                                console.log(guest);

                                guest = $.extend({}, guest);

                                newAddress.Location = "New Location";
                                guest.GuestAddresses = (guest.GuestAddresses != null && Array.isArray(guest.GuestAddresses)) ? guest.GuestAddresses : [];
                                guestInformationFilter.GuestAddressesList = [newAddress].concat(guest.GuestAddresses);

                                console.log(guest.GuestAddresses);

                               /* for (let i = 0; i < guest.GuestAddresses.length; i++) {
                                    guest.GuestAddresses[i] = $.extend({}, guest.GuestAddresses[i]);
                                }*/

                                guestInformationFilter.GuestDto = guest;
                            }
                            else {
                                guestInformationFilter.GuestDto = ObjectFactoryService.Objects.Admin.GetGuestDto().guest;
                                guestInformationFilter.GuestDto.PhoneNumber = guestInformationFilter.PhoneNumber;
                                guestInformationFilter.GuestDto.Mobile = guestInformationFilter.PhoneNumber;
                                guestInformationFilter.GuestAddressesList = [];
                                guestInformationFilter.GuestAddress = ObjectFactoryService.Objects.Admin.GetGuestAddressDto();
                            }
                        }
                        else {
                            guestInformationFilter.GuestDto = ObjectFactoryService.Objects.Admin.GetGuestDto().guest;
                            guestInformationFilter.GuestAddressesList = [];
                            guestInformationFilter.GuestAddress = ObjectFactoryService.Objects.Admin.GetGuestAddressDto();
                        }
                    });

                    guestInformationFilter.AddNewAddress = function () {
                        guestInformationFilter.GuestAddress = ObjectFactoryService.Objects.Admin.GetGuestAddressDto();
                    };

                    /// Perform initialization tasks
                    (function () {
                        /*guestsList = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAdminData()).Guests;*/

                        TransactionHandler.Execute.Guests.ReadAll((response)=> {
                            guestsList = response;
                        });

                        console.log(guestsList);
                        guestInformationFilter.GuestDto = ObjectFactoryService.Objects.Admin.GetGuestDto().guest;
                        guestInformationFilter.GuestAddress = ObjectFactoryService.Objects.Admin.GetGuestAddressDto();
                        guestInformationFilter.GuestAddressesList.push(ObjectFactoryService.Objects.Admin.GetGuestAddressDto());
                    })();

                    return guestInformationFilter;
                })(scope);

                /// GuestsSelectionBar.DropDown.Options
                /// GuestsSelectionBar.DropDown.ExtraSettings
                /// GuestsSelectionBar.SelectedModel

                /// Initialization steps
                $((function (This) {
                    /// This.GuestsInformationFilter.Init();
                    This.DiningOrder.Init();
                    TimeSlots = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAdminData()).TimeSlots;
                    /// console.error(JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetAdminData()));
                    /// console.error(TimeSlots);
                })(this));
            })();

            /// Ui handling operations are handled here.
            /*scope.UiHandlers.HomePageUi.MiddlePanel.NewOrderPanel = new (function () {
            })();*/
        }
    });
    cloudPOS.ng.application.controller('NewOrderPanelController', [
        '$scope',
        '$translate',
        '$rootScope',
        'UIConfigService',
        '$http',
        '$filter',
        'UrlFactory',
        'MasterDataStorageHandler',
        'filterFilter',
        'TransactionHandlerService',
        'ObjectFactoryService',
        'CommonMessages',
        'ValidationService',
        cloudPOS.controllers.NewOrderPanelController
    ]).run(function ($log) {
        $log.info("NewOrderPanelController initialized");
    });
}(cloudPOS.controllers || {}));
