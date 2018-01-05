(function (module) {
    cloudPOS.controllers = _.extend(module, {
        OrdersDisplayPanel: function (scope, TransactHandler) {

            scope.OrdersDisplayDataModule = (function (scope, HomeDataModule) {
                var DataModule = {};
                var PreProcess = ()=>{};

                DataModule.Orders = {
                    DiningOrders: [],
                    TakeoutOrders: [],
                    DeliveryOrders: [],
                    TabOrders: []
                };

                DataModule.Reservations = [];

                DataModule.Guests = [];

                DataModule.LoadOrders = function () {

                    /// Load dining orders
                    TransactHandler.Execute.Order.ReadByOrderCategoryId(function (response) {
                        DataModule.Orders.DiningOrders = response.OrderHeaderResponse;
                        console.warn(response.OrderHeaderResponse);
                        PreProcess();
                    }, HomeDataModule.OrderCategories.DiningOrder.OrderCategoryId);

                    /// Load takeout orders
                    TransactHandler.Execute.Order.ReadByOrderCategoryId(function (response) {
                        DataModule.Orders.TakeoutOrders = response.OrderHeaderResponse;
                        PreProcess();
                    }, HomeDataModule.OrderCategories.TakeoutOrder.OrderCategoryId);

                    /// Load delivery orders
                    TransactHandler.Execute.Order.ReadByOrderCategoryId(function (response) {
                        DataModule.Orders.DeliveryOrders = response.OrderHeaderResponse;
                        PreProcess();
                    }, HomeDataModule.OrderCategories.DeliveryOrder.OrderCategoryId);

                    /// Load tab orders
                    TransactHandler.Execute.Order.ReadByOrderCategoryId(function (response) {
                        DataModule.Orders.TabOrders = response.OrderHeaderResponse;
                        PreProcess();
                    }, HomeDataModule.OrderCategories.TabOrder.OrderCategoryId);
                };

                DataModule.LoadReservations = function () {
                    TransactHandler.Execute.Reservations.ReadAll(function (response) {
                        /// console.error(response.ReservationResponse);
                        DataModule.Reservations = response.ReservationResponse;
                        PreProcess();
                    });
                };

                DataModule.LoadGuests = function () {
                    TransactHandler.Execute.Guests.ReadAll(function (response) {
                        DataModule.Guests = response;
                        PreProcess();
                    });
                };

                PreProcess = (function () {

                    var isDeliveryComplete = false, isDiningComplete = false, isTabComplete = false,
                        isTakeoutComplete = false;

                    return function () {
                        if (Array.isArray(DataModule.Guests) && DataModule.Guests.length > 0) {
                            if (Array.isArray(DataModule.Reservations) && DataModule.Reservations.length > 0) {
                                if (Array.isArray(DataModule.Orders.DiningOrders) && DataModule.Orders.DiningOrders.length > 0 &&
                                    !isDiningComplete) {
                                    /// do something
                                    MergeGuests(DataModule.Orders.DiningOrders, DataModule.Guests);
                                    MergeReservations(DataModule.Orders.DiningOrders, DataModule.Reservations);

                                    isDiningComplete = true;
                                }
                            }

                            if (Array.isArray(DataModule.Orders.DeliveryOrders) &&
                                DataModule.Orders.DeliveryOrders.length > 0 && !isDeliveryComplete) {
                                /// do something
                                MergeGuests(DataModule.Orders.DeliveryOrders, DataModule.Guests);

                                isDeliveryComplete = true;
                            }

                            if (Array.isArray(DataModule.Orders.TabOrders) &&
                                DataModule.Orders.TabOrders.length > 0 && !isTabComplete) {
                                /// do something
                                MergeGuests(DataModule.Orders.TabOrders, DataModule.Guests);

                                isTabComplete = true;
                            }

                            if (Array.isArray(DataModule.Orders.TakeoutOrders) &&
                                DataModule.Orders.TakeoutOrders.length > 0 && !isTakeoutComplete) {
                                /// do something
                                MergeGuests(DataModule.Orders.TakeoutOrders, DataModule.Guests);

                                isTakeoutComplete = true;
                            }

                        }
                    }
                })();

                var MergeGuests = function (ordersList, guestsList) {
                    if (Array.isArray(ordersList) && Array.isArray(guestsList)) {
                        ordersList.forEach(function (order) {
                            var guest = guestsList.find(function (guest) {
                                return (order.GuestID == guest.GuestId);
                            });

                            if (guest !== undefined) {
                                order.GuestName = guest.FirstName + " " + guest.LastName;
                            }
                        });
                    }
                };

                var MergeReservations = function (ordersList, reservationsList) {
                    if (Array.isArray(ordersList) && Array.isArray(reservationsList)) {
                        ordersList.forEach(function (order) {
                            var reservation = reservationsList.find(function (reservation) {

                                return (order.ReservationID == reservation.ReservationId);
                            });

                            if (reservation !== undefined) {
                                let timeSlot = new Date(Number(reservation.ReservationDate.substr(6, 13)));
                                order.Tables = reservation.TableName;
                                order.TimeSlot = ((timeSlot.getHours() % 12) + ((timeSlot.getHours()==12) ? 12 : 0)) + ":" + timeSlot.getMinutes();
                                order.TimeSlot += (timeSlot.getHours() > 11) ? " PM" : " AM";
                            }
                        });
                    }
                };

                DataModule.SelectOrder = function (order, orderCategory) {
                    if (order === undefined || order == null) {
                        return false;
                    }

                    HomeDataModule.SelectedOrder.OrderCategory = orderCategory;
                    HomeDataModule.SelectedOrder.Order = order;
                    HomeDataModule.GetOrderDetails(function (response) {
                        scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.MainBodyArea.ToMainArea();
                    });
                };

                /// Init
                (function () {
                    DataModule.LoadOrders();
                    DataModule.LoadGuests();
                    DataModule.LoadReservations();
                    HomeDataModule.DeselectOrder();
                })();

                return DataModule;
            })(scope, scope.HomeDataModule);
        }
    });
    cloudPOS.ng.application.controller('OrdersDisplayPanel', [
        '$scope',
        'TransactionHandlerService',
        cloudPOS.controllers.OrdersDisplayPanel
    ]).run(function ($log) {
        $log.info("OrdersDisplayPanel initialized");
    });
}(cloudPOS.controllers || {}));
