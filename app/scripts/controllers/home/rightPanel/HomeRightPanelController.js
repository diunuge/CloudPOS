(function (module) {
    cloudPOS.controllers = _.extend(module, {
        HomeRightPanelController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                           uiConfigService, $http, CloudDaoService, filterFilter, TransactionHandlerService) {

            /// UI handlers goes here.
            /// UiHandlers global object.
            scope.UiHandlers = {HomePageUi: {}};

            /// RightPanel ui handlers
            scope.UiHandlers.HomePageUi.RightPanel = (function () {
                var rightPanel = {};
                var selectedButton = null;

                rightPanel.OrderFiltering =  {
                    DiningOrder: function (e) {

                    },
                    TakeoutOrder: function (e) {

                    },
                    DeliveryOrder: function (e) {

                    },
                    TabOrder: function (e) {

                    }
                };

                return rightPanel;
            })();

            /// DataManipulation operations goes here.
            scope.HomeDataModule.RightPanel = {

                /// Filter orders according to order type.
                FilterOrders:  (function () {
                    var filterOrders = {};
                    filterOrders.SelectedButton = null;

                    /// Filter dining orders
                    filterOrders.DiningOrders = function (e) {
                        scope.HomeDataModule.RightPanel.AddNewOrder(scope.HomeDataModule.OrderCategories.DiningOrder);
                        scope.HomeDataModule.SelectedOrder.OrderCategory = scope.HomeDataModule.OrderCategories.DiningOrder;
                        $(filterOrders.SelectedButton).removeClass("active");
                        filterOrders.SelectedButton = e.currentTarget;
                        $(filterOrders.SelectedButton).addClass("active");
                    };

                    /// Filter takeout orders
                    filterOrders.TakeoutOrders = function (e) {
                        scope.HomeDataModule.RightPanel.AddNewOrder(scope.HomeDataModule.OrderCategories.TakeoutOrder);
                        scope.HomeDataModule.SelectedOrder.OrderCategory = scope.HomeDataModule.OrderCategories.TakeoutOrder;
                        $(filterOrders.SelectedButton).removeClass("active");
                        filterOrders.SelectedButton = e.currentTarget;
                        $(filterOrders.SelectedButton).addClass("active");
                    };

                    /// Filter delivery orders
                    filterOrders.DeliveryOrders = function (e) {
                        scope.HomeDataModule.RightPanel.AddNewOrder(scope.HomeDataModule.OrderCategories.DeliveryOrder);
                        scope.HomeDataModule.SelectedOrder.OrderCategory = scope.HomeDataModule.OrderCategories.DeliveryOrder;
                        $(filterOrders.SelectedButton).removeClass("active");
                        filterOrders.SelectedButton = e.currentTarget;
                        $(filterOrders.SelectedButton).addClass("active");
                    };

                    /// Filter tab orders
                    filterOrders.TabOrders = function (e) {
                        scope.HomeDataModule.RightPanel.AddNewOrder(scope.HomeDataModule.OrderCategories.TabOrder);
                        scope.HomeDataModule.SelectedOrder.OrderCategory = scope.HomeDataModule.OrderCategories.TabOrder;
                        $(filterOrders.SelectedButton).removeClass("active");
                        filterOrders.SelectedButton = e.currentTarget;
                        $(filterOrders.SelectedButton).addClass("active");
                    };

                    scope.$watch("HomeDataModule.SelectedOrder.Order", function (order) {
                        if (order !== undefined && order.OrderID === undefined) {
                            $(filterOrders.SelectedButton).removeClass("active");
                        }
                    });

                    return filterOrders
                })(),

                /// Creates a new order temporarily.
                AddNewOrder: function (orderCategory) {

                    var orderType = orderCategory.OrderCategoryId;/// scope.HomeDataModule.OrdersData.OrderCategory.OrderCategoryId;
                    var orderCategories = scope.HomeDataModule.OrderCategories;
                    var msgBoxTitle = "Order Panel";
                    var msgBoxBody = "Do you want to discard changes and proceed?";
                    var isOrderDetailsChanged = function () {
                        let orderDetail = scope.HomeDataModule.SelectedOrder.OrderDetails.find(function (elem) {
                            return (elem.OrderDetailID == 0);
                        });

                        return (orderDetail !== undefined);
                    };

                    switch (orderType) {
                        case orderCategories.DiningOrder.OrderCategoryId:
                            let ToDiningOrderPanel = function () {
                                scope.HomeDataModule.DeselectOrder();
                                scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.MainBodyArea.ToMainArea();
                                scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.NewOrderView.BodyArea.ToDiningOrderView();
                                scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.BodyArea.ToReservationCheckInView();
                                scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToNewOrderView();
                            };

                            if (scope.HomeDataModule.SelectedOrder.Order.OrderID !== undefined && isOrderDetailsChanged()) {
                            comAlertInfo(msgBoxTitle, msgBoxBody, "Yes", "No", function (button) {
                                if (button.toUpperCase() == "YES") {
                                    ToDiningOrderPanel();
                                }
                                else {

                                }
                            });
                        }
                            else {
                                ToDiningOrderPanel();
                            }

                            break;
                        case orderCategories.TakeoutOrder.OrderCategoryId:

                            if (scope.HomeDataModule.SelectedOrder.Order.OrderID !== undefined && isOrderDetailsChanged()) {
                                comAlertInfo(msgBoxTitle, msgBoxBody, "Yes", "No", function (button) {
                                    if (button.toUpperCase() == "YES") {
                                        scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.MainBodyArea.ToMainArea();
                                        scope.HomeDataModule.AddNewOrder(orderCategories.TakeoutOrder);
                                    }
                                    else {

                                    }
                                });
                            }
                            else {
                                scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.MainBodyArea.ToMainArea();
                                scope.HomeDataModule.AddNewOrder(orderCategories.TakeoutOrder);
                            }

                            break;
                        case orderCategories.DeliveryOrder.OrderCategoryId:

                            let createNewDeliveryOrder = function () {
                                scope.HomeDataModule.DeselectOrder();
                                scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.MainBodyArea.ToMainArea();
                                /// scope.HomeDataModule.AddNewOrder(orderCategories.DeliveryOrder);
                                scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.NewOrderView.BodyArea.ToDeliveryOrderView();
                                scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToNewOrderView();
                            };

                            if (scope.HomeDataModule.SelectedOrder.Order.OrderID !== undefined && isOrderDetailsChanged()) {
                                comAlertInfo(msgBoxTitle, msgBoxBody, "Yes", "No", function (button) {
                                    if (button.toUpperCase() == "YES") {
                                        createNewDeliveryOrder();
                                    }
                                    else {

                                    }
                                });
                            }
                            else {
                                createNewDeliveryOrder();
                            }


                            break;
                        case orderCategories.TabOrder.OrderCategoryId:
                            if (scope.HomeDataModule.SelectedOrder.Order.OrderID !== undefined && isOrderDetailsChanged()) {
                                comAlertInfo(msgBoxTitle, msgBoxBody, "Yes", "No", function (button) {
                                    if (button.toUpperCase() == "YES") {
                                        scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.MainBodyArea.ToMainArea();
                                        scope.HomeDataModule.AddNewOrder(orderCategories.TabOrder);
                                    }
                                    else {

                                    }
                                });
                            }
                            else {
                                scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.MainBodyArea.ToMainArea();
                                scope.HomeDataModule.AddNewOrder(orderCategories.TabOrder);
                            }

                            break;
                        default:
                    }
                },

                RetrieveOrderDetails : function (order, callback) {
                    scope.HomeDataModule.DeselectOrder();
                    scope.HomeDataModule.SelectedOrder.Order = order;
                    scope.HomeDataModule.GetOrderDetails(function (orderDetails) {
                        if (callback !== undefined) {
                            callback(orderDetails);
                        }
                    });
                }
            };
        }
    });
    cloudPOS.ng.application.controller('HomeRightPanelController', [
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
        'CloudDaoService',
        'filterFilter',
        'TransactionHandlerService',
        cloudPOS.controllers.HomeRightPanelController
    ]).run(function ($log) {
        $log.info("HomeRightPanelController initialized");
    });
}(cloudPOS.controllers || {}));
