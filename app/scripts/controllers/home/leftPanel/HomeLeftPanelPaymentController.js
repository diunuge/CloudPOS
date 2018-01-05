(function (module) {
    cloudPOS.controllers = _.extend(module, {
        HomeLeftPanelPaymentController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, $idle, tmhDynamicLocale,
                                           uiConfigService, filterFilter, MasterDataStorageHandler,
                                           CommonMessages, ObjectFactoryService, TransactionHandler, ValidationService) {

            /// Hold the ID of the selected order.
            var OrderID = scope.HomeDataModule.SelectedOrder.Order.OrderID;

            /// Holds the ID of the reservation of the selected order.
            var ReservationID = scope.HomeDataModule.SelectedOrder.Order.ReservationID;

            /// console.log(scope.HomeDataModule.SelectedOrder.Order);
            /// alert(ReservationID);

            /// Holds the order net price.
            var OrderNetPrice = scope.HomeDataModule.SelectedOrder.Order.NetPrice;

            /// Holds the total price of the selected order.
            var OrderTotalPrice = scope.HomeDataModule.SelectedOrder.Order.TotalPrice;

            /// Handle payments
            scope.Payment = (function ($scope, orderId, reservationId, orderNetPrice, orderTotalPrice) {

                orderId = (orderId) ? orderId : 0;
                console.log(reservationId);
                reservationId = (reservationId) ? reservationId : 0;

                var payment = {};

                var multiplePayment = $scope.HomeDataModule.SelectedOrder.MultiplePayment;
                var orderPricingSummary = $scope.HomeDataModule.SelectedOrder.PricesSummary;
                var currentOrder = $scope.HomeDataModule.SelectedOrder.Order;

                /// Hold advance deposits.
                payment.AdvanceDeposits = [];

                /// Send a payment request to the server.
                var MakePayment = function () {
                    let orderDetails = payment.PaymentDto.paymentDetailResponseDtoList;
                    /// payment.PaymentDto.paymentHeaderRequestDto.NetPrice += (orderDetails.length > 0) ? Number(orderDetails[orderDetails.length - 1].PayAmount) : 0;

                    payment.PaymentDto.paymentHeaderRequestDto.PaymentDate = "/Date(" + Date.now() + ")/";
                    payment.PaymentDto.payEquityCount = (payment.PaymentDto.paymentDetailResponseDtoList.length).toString();

                    if (multiplePayment !== undefined && Array.isArray(multiplePayment) && multiplePayment.length > 0) {
                        let curOrderReservationId = ObjectFactoryService.Objects.Payment.GetOrderReservationIdsDto();
                        curOrderReservationId.OrderId = currentOrder.OrderID;
                        curOrderReservationId.ReservationId = currentOrder.ReservationId;
                        payment.PaymentDto.paymentHeaderRequestDto.OrderReservationIds = [curOrderReservationId];
                        multiplePayment.forEach(function (elem) {
                            let orderReservationIds = ObjectFactoryService.Objects.Payment.GetOrderReservationIdsDto();
                            orderReservationIds.OrderId = elem.OrderID;
                            orderReservationIds.ReservationId = elem.ReservationId;
                            payment.PaymentDto.paymentHeaderRequestDto.OrderReservationIds.push(orderReservationIds);
                        });
                    }

                    payment.PaymentDto.paymentHeaderRequestDto.NetPrice = orderPricingSummary.NetTotal;

                    console.log(payment.PaymentDto);
                    console.error(payment.PaymentDto);
                    TransactionHandler.Execute.Payment.Create((response)=>{
                        console.log(response);
                    }, payment.PaymentDto);
                };

                var GetPaymentDto = function () {
                    var paymentDto = ObjectFactoryService.Objects.Payment.GetPaymentDto();
                    var orderReservationIds = ObjectFactoryService.Objects.Payment.GetOrderReservationIdsDto();
                    paymentDto.paymentHeaderRequestDto.OrderReservationIds.push(orderReservationIds);

                    return paymentDto;
                };

                /// Payment data model
                payment.PaymentDto = null;

                /// Payment detail data model
                payment.PaymentDetailDto = null;

                payment.PaymentModes = {
                    CashPayment: {
                        PaymentModeID: 1,
                        PaymentMode: 'Cash'
                    },

                    CreditCardPayment: {
                        PaymentModeID: 3,
                        PaymentMode: 'Credit Card'
                    },

                    ChequePayment: {
                        PaymentModeID: 2,
                        PaymentMode: 'Cheque'
                    },

                    DutyMealPayment: {
                        PaymentModeID: 4,
                        PaymentMode: 'Duty Meal'
                    },

                    CityLedgerPayment: {
                        PaymentModeID: 5,
                        PaymentMode: 'City Ledger'
                    },

                    AdvancePayment: {
                        PaymentModeID: 7,
                        PaymentMode: 'Advance'
                    }
                };

                /// Check whether the total of the payment details is equal to the total price of the
                /// order header. If so, trigger the MakePayment function.
                payment.SavePayment = function () {

                    let paymentDetails = payment.PaymentDto.paymentDetailResponseDtoList;

                    let totalPaidAmount = 0;
                    for (let i = 0; i < paymentDetails.length; i++) {
                        totalPaidAmount += Number(paymentDetails[i].PayAmount);
                    }

                    if (totalPaidAmount >= orderTotalPrice) {
                        console.log(payment.PaymentDto);
                        MakePayment();
                    }
                    else {
                        alert("Settle the bill");
                    }
                };

                /// Return a payment mode object for the supplied payment mode id.
                payment.GetPaymentModeObject = function (paymentModeId) {

                    let response = {};
                    for (let paymentMode in payment.PaymentModes) {

                        if (payment.PaymentModes[paymentMode].hasOwnProperty("PaymentModeID") &&
                            payment.PaymentModes[paymentMode].PaymentModeID == paymentModeId) {

                            response = payment.PaymentModes[paymentMode];
                            break;
                        }
                    }

                    return response;
                };

                /// Adds a payment
                payment.AddPayment = function (paymentModeID) {

                    if (payment.PaymentDto != null && payment.PaymentDetailDto != null &&
                        payment.PaymentDetailDto.PayAmount > 0) {

                        switch(paymentModeID.PaymentModeID) {
                            case payment.PaymentModes.CashPayment.PaymentModeID:
                                payment.PaymentDto.paymentDetailResponseDtoList.push(payment.PaymentDetailDto);
                                payment.MakeCashPaymentDetailDto();
                                break;
                            case payment.PaymentModes.CreditCardPayment.PaymentModeID:
                                let issueDate = new Date(payment.PaymentDetailDto.CreditCardIssueDate);
                                let expiryDate = new Date(payment.PaymentDetailDto.CreditCardExpiryDate);

                                if (ValidationService.CreditCardDateValidation(issueDate, expiryDate)) {

                                    payment.PaymentDetailDto.CreditCardIssueDate = "/Date(" + issueDate.getTime() + ")/";
                                    payment.PaymentDetailDto.CreditCardExpiryDate = "/Date(" + expiryDate.getTime() + ")/";
                                    payment.PaymentDto.paymentDetailResponseDtoList.push(payment.PaymentDetailDto);
                                    payment.MakeCreditCardPaymentDetailDto();
                                }
                                else {
                                    alert("Specified credit card issueDate and expiryDate are invalid!");
                                }

                                break;
                            case payment.PaymentModes.ChequePayment.PaymentModeID:
                                let chequeRealizedDate = (new Date(payment.PaymentDetailDto.ChequeRealizedDate)).getTime();
                                let chequeDate = (new Date(payment.PaymentDetailDto.ChequeDate)).getTime();
                                payment.PaymentDetailDto.ChequeRealizedDate = "/Date(" + chequeRealizedDate + ")/";
                                payment.PaymentDetailDto.ChequeDate = "/Date(" + chequeDate + ")/";
                                console.error(chequeDate);
                                console.error(chequeRealizedDate);
                                payment.PaymentDto.paymentDetailResponseDtoList.push(payment.PaymentDetailDto);
                                payment.MakeChequePaymentDetailDto();
                                break;
                            case payment.PaymentModes.DutyMealPayment.PaymentModeID:
                                payment.PermissionRetrieval.OpenPopup(function (isConfirmed, authenticationTicket) {

                                    if (isConfirmed && authenticationTicket != null) {

                                        payment.PaymentDetailDto.AuthorizedEmployeeID = authenticationTicket.UserID;
                                        payment.PaymentDto.paymentDetailResponseDtoList.push(payment.PaymentDetailDto);
                                        console.log(payment.PaymentDto);
                                        payment.MakeDutyMealPaymentDetailDto();
                                    }
                                });

                                break;
                            case payment.PaymentModes.CityLedgerPayment.PaymentModeID:
                                payment.PaymentDto.paymentDetailResponseDtoList.push(payment.PaymentDetailDto);
                                console.log(payment.PaymentDetailDto);
                                payment.MakeCityLedgerPaymentDetailDto();
                                break;
                            case payment.PaymentModes.AdvancePayment.PaymentModeID:
                                payment.PaymentDto.paymentDetailResponseDtoList.push(payment.PaymentDetailDto);
                                payment.MakeAdvancePaymentDetailDto();
                                break;
                            default:
                        }
                    }
                };

                /// Permission Retrieval popup
                /// Used to get permission for tasks that require management level permission
                payment.PermissionRetrieval = (function (scope) {

                    var permissionRetrieval = {};

                    /// Secondary callback for th usage of external entities.
                    var secondaryCallback = null;

                    permissionRetrieval.isPopupEnabled = false;

                    permissionRetrieval.OpenPopup = function (callback) {
                        if (callback !== undefined && typeof(callback) == "function") {
                            secondaryCallback = callback;
                            permissionRetrieval.isPopupEnabled = true;
                        }
                    };

                    permissionRetrieval.ClosePopup = function () {
                        permissionRetrieval.isPopupEnalbed = false;
                    };

                    permissionRetrieval.Callback = function (isConfirmed, credentials) {

                        if (isConfirmed && credentials != null) {
                            var RestaurantID = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetLoginHelpingData()).RestaurantId;
                            TransactionHandler.Execute.AuthenticateUser(credentials.Username,
                                credentials.Password, RestaurantID, function (response) {
                                    if ("Error" in response) {

                                    }
                                    else {
                                        /// TransactionHandlerService.Config.SetSessionKey(response.);
                                        console.log(response);
                                        console.log(response.data.SessionKey);
                                        /// TransactionHandler.Config.SetSessionKey(response.data.SessionKey);
                                        secondaryCallback(isConfirmed, response.data);
                                    }
                                });
                        }
                        else {

                        }
                    };

                    /// Set a secondary callback
          /*          permissionRetrieval.SetSecondaryCallback = function (callback) {

                        if (callback !== undefined && typeof(callback) == "function") {
                            secondaryCallback = callback;
                        }
                    };*/

                    return permissionRetrieval;
                })(scope);

                /// Creates a payment dto for cash payment
                payment.MakeCashPaymentDetailDto = function () {

                    payment.PaymentDetailDto = ObjectFactoryService.Objects.Payment.PaymentDetail.GetCashPaymentDetailDto();
                    payment.PaymentDetailDto.PaymentModeID = payment.PaymentModes.CashPayment.PaymentModeID;
                };

                /// Creates a payment dto for credit card payment
                payment.MakeCreditCardPaymentDetailDto = function () {

                    payment.PaymentDetailDto =  ObjectFactoryService.Objects.Payment.PaymentDetail.GetCreditCardPaymentDetailDto();
                    payment.PaymentDetailDto.PaymentModeID = payment.PaymentModes.CreditCardPayment.PaymentModeID;
                };

                /// Creates a payment dto for cheque payment
                payment.MakeChequePaymentDetailDto = function () {

                    payment.PaymentDetailDto = ObjectFactoryService.Objects.Payment.PaymentDetail.GetChequePaymentDetailDto();
                    payment.PaymentDetailDto.ChequeDate = new Date(Date.now());
                    payment.PaymentDetailDto.ChequeRealizedDate = new Date(Date.now());
                    payment.PaymentDetailDto.PaymentModeID = payment.PaymentModes.ChequePayment.PaymentModeID;
                };

                /// Creates a payment dto for duty meal payment
                payment.MakeDutyMealPaymentDetailDto = function () {

                    payment.PaymentDetailDto = ObjectFactoryService.Objects.Payment.PaymentDetail.GetDutyMealPaymentDetailDto();
                    payment.PaymentDetailDto.PaymentModeID = payment.PaymentModes.DutyMealPayment.PaymentModeID;
                };

                /// Creates a payment dto for city ledger payment
                payment.MakeCityLedgerPaymentDetailDto = function () {

                    payment.PaymentDetailDto = ObjectFactoryService.Objects.Payment.PaymentDetail.GetCityLedgerPaymentDetailDto();
                    payment.PaymentDetailDto.PaymentModeID = payment.PaymentModes.CityLedgerPayment.PaymentModeID;
                };

                /// Creates a payment dto for advance payment
                payment.MakeAdvancePaymentDetailDto = function () {

                    payment.PaymentDetailDto = ObjectFactoryService.Objects.Payment.PaymentDetail.GetAdvancePaymentDetailDto();
                    payment.PaymentDetailDto.PaymentModeID = payment.PaymentModes.AdvancePayment.PaymentModeID;
                };

                payment.AdvanceDepositHandler = (function (scope, payment) {
                    var advanceDepositHandler = {};

                    /// Holds a phonenumber of a guest and
                    /// filter the corresponding guest according to the number
                    advanceDepositHandler.GuestPhoneNumber = 0;

                    /// Filter a particular guest
                    scope.$watch(()=>advanceDepositHandler.GuestPhoneNumber, function (newVal) {
                        if (isNaN(Number(newVal)) || newVal == null) {return false;}
                        var phoneNumber = newVal.toString();

                        var filteredList = filterFilter(payment.AdvanceDeposits, function (elem) {
                            return (phoneNumber.length > 3 &&
                            elem.GuestId.toString().indexOf(phoneNumber) != -1);
                        });

                        if (filteredList != undefined && filteredList.length > 0) {
                            console.log(filteredList);
                            payment.PaymentDetailDto.AdvanceID = filteredList[0].AdvanceID;
                            payment.PaymentDetailDto.AvailableBalance = filteredList[0].BalanceAmount;
                            payment.PaymentDetailDto.AdvanceTotalAmount = filteredList[0].AdvanceAmount;
                        }
                    });

                    return advanceDepositHandler;
                })(scope, payment);

                /// Initializes the object
                (function (orderid, reservationId, orderNetPrice) {

                    payment.PaymentDto = {};
                    payment.PaymentDto = GetPaymentDto();
                    console.log(payment.PaymentDto);
                    payment.PaymentDto.paymentHeaderRequestDto.NetPrice += orderNetPrice;
                    payment.MakeCashPaymentDetailDto();
                    payment.PaymentDto.paymentHeaderRequestDto.OrderReservationIds[0].OrderId = orderid;
                    payment.PaymentDto.paymentHeaderRequestDto.OrderReservationIds[0].ReservationId = reservationId;
                    console.log(reservationId);

                    TransactionHandler.Execute.AdvanceDeposits.ReadAll(function (response) {
                        payment.AdvanceDeposits = response;
                        console.log(response);
                    });

                })(orderId, reservationId, orderNetPrice);

                return payment;
            })(scope, OrderID, ReservationID, OrderNetPrice, OrderTotalPrice);

            scope.PaymentModesNavigator = (function () {

                var paymentModePage = {};

                paymentModePage.ToCashPaymentPage = function () {
                    scope.Payment.MakeCashPaymentDetailDto();
                    /// scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToDiscountView();
                    scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.PaymentOptions.ToCashView();
                };

                paymentModePage.ToCreditCardPaymentPage = function () {
                    scope.Payment.MakeCreditCardPaymentDetailDto();
                    scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.PaymentOptions.ToCreditCardView();
                };

                paymentModePage.ToChequePaymentPage = function () {
                    scope.Payment.MakeChequePaymentDetailDto();
                    scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.PaymentOptions.ToChequeView();
                };

                paymentModePage.ToDutyMealPaymentPage = function () {
                    scope.Payment.MakeDutyMealPaymentDetailDto();
                    scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.PaymentOptions.ToDutyMealView();
                };

                paymentModePage.ToCityLedgerPaymentPage = function () {
                    scope.Payment.MakeCityLedgerPaymentDetailDto();
                    scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.PaymentOptions.ToCityLedgerView();
                };

                paymentModePage.ToAdvancePaymentPage = function () {
                    scope.Payment.MakeAdvancePaymentDetailDto();
                    scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.PaymentOptions.ToAdvanceView();
                };

                return paymentModePage;
            })();

            /// Init
            (function ($scope) {
                $scope.PaymentModesNavigator.ToCashPaymentPage();
            })(scope);
        }
    });
    cloudPOS.ng.application.controller('HomeLeftPanelPaymentController', [
        '$scope',
        '$location',
        'SessionManager',
        '$translate',
        '$rootScope',
        'localStorageService',
        '$idle',
        'tmhDynamicLocale',
        'UIConfigService',
        'filterFilter',
        'MasterDataStorageHandler',
        'CommonMessages',
        'ObjectFactoryService',
        'TransactionHandlerService',
        'ValidationService',
        cloudPOS.controllers.HomeLeftPanelPaymentController
    ]).run(function ($log) {
        $log.info("HomeLeftPanelPaymentController initialized");
    });
}(cloudPOS.controllers || {}));
