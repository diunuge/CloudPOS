(function (module) {
    cloudPOS.controllers = _.extend(module, {
        PaymentPanelController: function (scope, sessionManager, $rootScope, localStorageService, $idle, uiConfigService,
                                             $http, filterFilter, MasterDataStorageHandler,
                                             CommonMessages, TransactionHandler, ObjectFactoryService) {

            scope.PaymentDataModule = (function (scope) {
                var DataModule = {};
                var CurrentOrder = scope.HomeDataModule.SelectedOrder.Order;

                DataModule.Payment = (function () {
                    var payment = {};
                    var advanceDeposits = [];

                    payment.PaymentDetailDto = null;
                    payment.AdvanceDepositList = [];
                    payment.CityLedgerAccountsList = [];
                    payment.GuestList = [];
                    payment.EmployeeList = [];
                    payment.BanksList = [];
                    payment.BranchesList = [];
                    payment.UserLevels = [];

                    payment.Cheque = {
                        /// SelectedBank: {BankName: "Select a bank"},
                        SelectedBank: null,
                        /// SelectedBranch: {BranchName: "Select a branch"}
                        SelectedBranch: null,
                        MinimumRealizedDate: new Date()
                    };

                    payment.CityLedger = {
                        SelectedCityLedger: null
                    };

                    payment.DutyMeal = {
                        SelectedEmployee: null
                    };

                    payment.PaymentSummary = {
                        GrandTotal: 0,
                        SettledAmount: 0,
                        DueAmount: 0,
                        ItemCount: 0
                    };

                    payment.AdvancePayment = {
                        SelectedAdvanceDeposit: {GuestId: 0, AdvanceAmount: 0, BalanceAmount: 0},
                        IsAdvanceDepositAlreadyAdded: function (deposit) {
                            let AdvanceDeposit = payment.PaymentsList.find(function (elem) {
                                return (elem.AdvanceID == deposit.AdvanceID)
                            });

                            return (AdvanceDeposit !== undefined);
                        },
                        SetAdvanceDeposit: function (deposit) {
                            payment.AdvancePayment.SelectedAdvanceDeposit = deposit;
                            payment.PaymentDetailDto.PayAmount = deposit.BalanceAmount;
                        }
                    };

                    var PaymentsListCallback = function (newVal) {

                        payment.PaymentSummary.SettledAmount = 0;
                        payment.PaymentSummary.DueAmount = 0;

                        newVal.forEach(function (elem) {
                            payment.PaymentSummary.SettledAmount += Number(elem.PayAmount);
                        });

                        payment.PaymentSummary.DueAmount = (Number(payment.PaymentSummary.GrandTotal) -  Number(payment.PaymentSummary.SettledAmount));
                    };

                    var MultiplePaymentCallback = function (newVal) {

                        if (newVal !== undefined && Array.isArray(newVal) && newVal.length > 0) {
                            payment.PaymentSummary.GrandTotal = 0;
                            newVal.forEach(function (elem) {
                                payment.PaymentSummary.GrandTotal += Number(elem.TotalPrice);
                            });

                            payment.PaymentSummary.DueAmount = payment.PaymentSummary.GrandTotal;
                        }
                        else {
                            payment.PaymentSummary.GrandTotal = CurrentOrder.TotalPrice;
                            if (payment.PaymentsList.length > 0) {
                                PaymentsListCallback(payment.PaymentsList);
                            }
                            else {
                                payment.PaymentSummary.DueAmount = CurrentOrder.TotalPrice;
                            }
                            /// alert(payment.PaymentsList.length);
                        }
                    };

                    scope.$watch(()=>payment.PaymentsList, PaymentsListCallback, true);

                    scope.$watch(()=>payment.PaymentsList, function (newVal) {
                        PaymentsListCallback(newVal);
                    });

                    scope.$watch(()=>scope.HomeDataModule.SelectedOrder.MultipleOrders, MultiplePaymentCallback, true);

                    scope.$watch(()=>scope.HomeDataModule.SelectedOrder.MultipleOrders, function (newVal) {
                        MultiplePaymentCallback(newVal);
                    });

                    /// Contains a list of created payments
                    payment.PaymentsList = [];

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

                    payment.GetPaymentMethodName = function (paymentModeID) {
                        for (let key in payment.PaymentModes) {
                            if(payment.PaymentModes[key].PaymentModeID == paymentModeID) {
                                return payment.PaymentModes[key].PaymentMode;
                            }
                        }
                    };

                    payment.CreateDto = {
                        CreateCashPaymentDto: function () {
                            payment.PaymentDetailDto = ObjectFactoryService.Objects.Payment.PaymentDetail.GetCashPaymentDetailDto();
                            payment.PaymentDetailDto.CurrencyId = 1;
                            payment.PaymentDetailDto.PaymentModeID = payment.PaymentModes.CashPayment.PaymentModeID;
                        },
                        CreateCreditCardPaymentDto: function () {
                            payment.PaymentDetailDto = ObjectFactoryService.Objects.Payment.PaymentDetail.GetCreditCardPaymentDetailDto();
                            payment.PaymentDetailDto.PaymentModeID = payment.PaymentModes.CreditCardPayment.PaymentModeID;
                            payment.PaymentDetailDto.CreditCardIssueDate = new Date(Date.now());
                            payment.PaymentDetailDto.CreditCardExpiryDate = new Date(Date.now());
                            payment.PaymentDetailDto.CreditCardTypeID = 0;
                            payment.PaymentDetailDto.PaymentModeID = payment.PaymentModes.CreditCardPayment.PaymentModeID;
                        },
                        CreateChequePaymentDto: function () {
                            payment.PaymentDetailDto = ObjectFactoryService.Objects.Payment.PaymentDetail.GetChequePaymentDetailDto();
                            payment.PaymentDetailDto.ChequeDate = new Date(Date.now());
                            payment.PaymentDetailDto.ChequeRealizedDate = new Date(Date.now());
                            payment.PaymentDetailDto.PaymentModeID = payment.PaymentModes.ChequePayment.PaymentModeID;
                        },
                        CreateDutyMealPaymentDto: function () {
                            payment.PaymentDetailDto = ObjectFactoryService.Objects.Payment.PaymentDetail.GetDutyMealPaymentDetailDto();
                            payment.PaymentDetailDto.PaymentModeID = payment.PaymentModes.DutyMealPayment.PaymentModeID;
                        },
                        CreateCityLedgerPaymentDto: function () {
                            payment.PaymentDetailDto = ObjectFactoryService.Objects.Payment.PaymentDetail.GetCityLedgerPaymentDetailDto();
                            payment.PaymentDetailDto.PaymentModeID = payment.PaymentModes.CityLedgerPayment.PaymentModeID;
                        },
                        CreateAdvancePaymentDto: function () {
                            payment.PaymentDetailDto = ObjectFactoryService.Objects.Payment.PaymentDetail.GetAdvancePaymentDetailDto();
                            payment.PaymentDetailDto.PaymentModeID = payment.PaymentModes.AdvancePayment.PaymentModeID;
                        }
                    };

                    payment.FilterAdvanceDeposits = function (guestID) {

                        let filteredList = filterFilter(advanceDeposits, function (elem) {
                            return elem.GuestId == guestID;
                        });

                        payment.AdvanceDepositList = (filteredList === undefined) ? [] : filteredList;
                        console.log(payment.AdvanceDepositList);
                    };

                    payment.MakePayment = function () {
                        var totalPaidAmount = 0;

                        if (DataModule.AdvanceDeposit.IsAdvanceDepositOn()) {
                            DataModule.AdvanceDeposit.MakeAdvanceDeposit();
                            return false;
                        }
                        else {
                            let grandTotal = Number(scope.HomeDataModule.SelectedOrder.Order.TotalPrice);
                            payment.PaymentsList.forEach(function (elem) {
                                totalPaidAmount += Number(elem.PayAmount);
                            });

                            if (totalPaidAmount < grandTotal) {
                                comSingleButtonErrorAlert("Settle the bill please", "You have to settle the total bill", "Got it!");
                                return false;
                            }
                            else if (grandTotal==0) {
                                let cashPaymentDto = ObjectFactoryService.Objects.Payment.PaymentDetail.GetCashPaymentDetailDto();
                                cashPaymentDto.PaymentModeID = payment.PaymentModes.CashPayment.PaymentModeID;
                                payment.PaymentsList = [cashPaymentDto];
                            }
                        }

                        var paymentDto = ObjectFactoryService.Objects.Payment.GetPaymentDto();
                        var orderReservationIDs = ObjectFactoryService.Objects.Payment.GetOrderReservationIdsDto();

                        paymentDto.paymentHeaderRequestDto.PaymentDate = "/Date(" + Date.now() + ")/";
                        paymentDto.paymentDetailResponseDtoList = payment.PaymentsList;

                        if (DataModule.MultiplePayment.MultipleOrders.length > 0) {

                            let netPrice = 0;
                            for (let i = 0; i < DataModule.MultiplePayment.MultipleOrders.length; i++) {
                                orderReservationIDs = ObjectFactoryService.Objects.Payment.GetOrderReservationIdsDto();
                                orderReservationIDs.OrderId = DataModule.MultiplePayment.MultipleOrders[i].OrderID;
                                orderReservationIDs.ReservationId = DataModule.MultiplePayment.MultipleOrders[i].ReservationId;
                                paymentDto.paymentHeaderRequestDto.OrderReservationIds.push(orderReservationIDs);
                                netPrice += DataModule.MultiplePayment.MultipleOrders[i].NetPrice;
                            }

                            paymentDto.paymentHeaderRequestDto.NetPrice = netPrice;
                        }
                        else {
                            orderReservationIDs.OrderId = CurrentOrder.OrderID;
                            orderReservationIDs.ReservationId = CurrentOrder.ReservationId;
                            paymentDto.paymentHeaderRequestDto.OrderReservationIds = [orderReservationIDs];
                            paymentDto.paymentHeaderRequestDto.NetPrice = CurrentOrder.NetPrice;
                        }

                        paymentDto.paymentHeaderRequestDto.ReceivedAmount = totalPaidAmount;

                        console.log(paymentDto);

                        TransactionHandler.Execute.Payment.Create((response)=>{
                            console.log(response);
                            if (response.IsSuccessFull) {

                                /// if dining order, cancel the reservation
                                if (scope.HomeDataModule.SelectedOrder.OrderCategory.Code ===
                                    scope.HomeDataModule.OrderCategories.DiningOrder.Code) {
                                }

                                comSingleButttonSuccessAlert("Payment Succeeded", "Payment has been made successfully", "Got it!");
                                scope.HomeDataModule.DeselectOrder();
                                scope.HomeDataModule.OrdersData.LoadOrders(scope.HomeDataModule.OrdersData.OrderCategory,
                                    function () {

                                    });
                            }
                        }, paymentDto);
                    };

                    /// Removes a payment detail ex: credit card payment, cash payment
                    /// from the payments list
                    payment.RemovePayment = function (paymentDetail) {

                        for (let i = 0; i < payment.PaymentsList.length; i++) {
                            if (payment.PaymentsList[i] === paymentDetail) {
                                payment.PaymentsList.splice(i, 1);
                                break;
                            }
                        }
                    };

                    payment.AddPayment = function () {
                        if (DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode != null &&
                            DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode !== undefined) {

                            console.error( payment.PaymentDetailDto.PayAmount);
                            if (payment.PaymentDetailDto.PayAmount == 0 ||
                                payment.PaymentDetailDto.PayAmount === undefined ||
                                payment.PaymentDetailDto.PayAmount === null) {
                                /// alert("Please provide paid amount");
                                console.error(payment.DutyMeal.SelectedEmployee);
                                comSingleButtonErrorAlert("Payment", "Please enter the paid amount", "Got it!");
                                return false;
                            }
                            else if (payment.PaymentSummary.SettledAmount >= payment.PaymentSummary.GrandTotal) {
                                /// alert("Already settled the bill");
                                comSingleButtonErrorAlert("Payment", "The bill has been settled already", "Got it!");
                                return false;
                            }

                            switch(DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode) {
                                case DataModule.NavigationHandler.RightPanel.Payment.ToCashPayment:

                                    let paymentDetail = payment.PaymentsList.find(function (elem) {
                                        if (elem.PaymentModeID == payment.PaymentDetailDto.PaymentModeID) {
                                            elem.PayAmount += payment.PaymentDetailDto.PayAmount;
                                            DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode();
                                            return true;
                                        }
                                    });

                                    if (paymentDetail === undefined) {
                                        payment.PaymentsList.push(payment.PaymentDetailDto);
                                    }

                                    console.log(scope.LeftPanelDataModule);
                                    DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode();
                                    break;
                                case DataModule.NavigationHandler.RightPanel.Payment.ToCreditCardPayment:
                                    /// /// alert("Credit Card");
                                    let issueDate = new Date(payment.PaymentDetailDto.CreditCardIssueDate);
                                    let expiryDate = new Date(payment.PaymentDetailDto.CreditCardExpiryDate);
                                    if (payment.PaymentDetailDto.CreditCardTypeID != 0 &&
                                        (payment.PaymentSummary.SettledAmount + payment.PaymentDetailDto.PayAmount) == payment.PaymentSummary.GrandTotal) {
                                        payment.PaymentDetailDto.CreditCardIssueDate = "/Date(" + issueDate.getTime() + ")/";
                                        payment.PaymentDetailDto.CreditCardExpiryDate = "/Date(" + expiryDate.getTime() + ")/";
                                        payment.PaymentsList.push(payment.PaymentDetailDto);
                                        DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode();
                                    }
                                    else if (payment.PaymentDetailDto.PayAmount != payment.PaymentSummary.GrandTotal) {
                                        comSingleButtonErrorAlert("CreditCard Payment",
                                            "Cannot pay less or more than the due amount",
                                            "Got it!");
                                    }
                                    else {
                                        comSingleButtonErrorAlert("CreditCard Payment",
                                            "Please select the credit card type. Ex: VISA, MASTERCARD," +
                                        " AMERICAN EXPRESS",
                                            "Got it!");
                                    }
                                    break;
                                case DataModule.NavigationHandler.RightPanel.Payment.ToChequePayment:
                                    let chequeDate = new Date(payment.PaymentDetailDto.ChequeDate);
                                    let realizedDate = new Date(payment.PaymentDetailDto.ChequeRealizedDate);

                                    if (payment.Cheque.SelectedBank != null &&
                                        payment.Cheque.SelectedBank.BankId !== undefined &&
                                        payment.PaymentDetailDto.ChequeNo !== "" &&
                                        payment.PaymentDetailDto.PayAmount <= payment.PaymentSummary.GrandTotal) {

                                        payment.PaymentDetailDto.BankId = payment.Cheque.SelectedBank.BankId;
                                        payment.PaymentDetailDto.BranchId = (payment.Cheque.SelectedBranch == null ||  payment.Cheque.SelectedBranch.BranchId === undefined) ? 0 : payment.Cheque.SelectedBranch.BranchId;
                                        payment.PaymentDetailDto.ChequeDate = "/Date(" + chequeDate.getTime() + ")/";
                                        payment.PaymentDetailDto.ChequeRealizedDate = "/Date(" + realizedDate.getTime() + ")/";
                                        payment.PaymentsList.push(payment.PaymentDetailDto);
                                        DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode();
                                    }
                                    else if (payment.PaymentDetailDto.PayAmount > payment.PaymentSummary.GrandTotal) {
                                        comSingleButtonErrorAlert("Payment", "Cannot pay more than the due amount", "Got it!");
                                    }
                                    else if (payment.PaymentDetailDto.ChequeNo === "") {
                                        comSingleButtonErrorAlert("Payment", "Please enter cheque number", "Got it!");
                                    }
                                    else {
                                        comSingleButtonErrorAlert("Payment", "Please select a bank", "Got it!");
                                    }

                                    break;
                                case DataModule.NavigationHandler.RightPanel.Payment.ToDutyMealPayment:
                                    if ((payment.PaymentSummary.SettledAmount + payment.PaymentDetailDto.PayAmount) == payment.PaymentSummary.DueAmount &&
                                        payment.DutyMeal.SelectedEmployee != null) {
                                        DataModule.Payment.PermissionRetrieval.ShowPopup(function (response) {

                                            payment.PaymentDetailDto.AuthorizedEmployeeID = response.UserID;
                                            payment.PaymentDetailDto.EmployeeID = payment.DutyMeal.SelectedEmployee.UserId;
                                            payment.PaymentsList.push(payment.PaymentDetailDto);
                                            DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode();
                                        });
                                    }
                                    else if (payment.DutyMeal.SelectedEmployee == null || payment.DutyMeal.SelectedEmployee.UserId === undefined) {
                                        /// alert("Please select an employee");
                                        comSingleButtonErrorAlert("Payment", "Please select an employee", "Got it!");
                                    }
                                    else {
                                        /// alert("Cannot enter less or more than the current amount");
                                        comSingleButtonErrorAlert("Payment", "Cannot pay less or more than the due amount", "Got it!");
                                    }
                                    break;
                                case DataModule.NavigationHandler.RightPanel.Payment.ToCityLedgerPayment:

                                    let paymentDetail2 = payment.PaymentsList.find(function (elem) {
                                        if (elem.PaymentModeID == payment.PaymentModes.CityLedgerPayment.PaymentModeID) {
                                            return true;
                                        }
                                    });

                                    if (paymentDetail2 === undefined) {
                                        if (payment.CityLedger.SelectedCityLedger != null &&
                                            payment.PaymentDetailDto.PayAmount === payment.PaymentSummary.GrandTotal) {
                                            payment.PaymentDetailDto.GuestName = payment.CityLedger.SelectedCityLedger.Name;
                                            payment.PaymentDetailDto.IdentityCardNO = payment.CityLedger.SelectedCityLedger.CityLedgerID;
                                            payment.PaymentsList.push(payment.PaymentDetailDto);
                                            DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode();
                                        }
                                        else if (payment.PaymentDetailDto.PayAmount !== payment.PaymentSummary.GrandTotal) {
                                            comSingleButtonErrorAlert("Payment", "Cannot pay less or more than the due amount", "Got it!");
                                        }
                                        else {
                                            comSingleButtonErrorAlert("Payment", "Please select a city ledger account.", "Got it!");
                                        }
                                    }
                                    else {
                                        comSingleButtonErrorAlert("Payment", "Only one city ledger account allowed for a given order", "Got it!");
                                        /// alert("Only one city ledger allowed for a given order");
                                    }

                                    break;
                                case DataModule.NavigationHandler.RightPanel.Payment.ToAdvancePayment:
                                    let balanceAmount = Number(payment.AdvancePayment.SelectedAdvanceDeposit.BalanceAmount);

                                    if (balanceAmount != 0) {
                                        payment.PaymentDetailDto.AdvanceID = payment.AdvancePayment.SelectedAdvanceDeposit.AdvanceID;
                                        payment.PaymentDetailDto.AvailableBalance = payment.AdvancePayment.SelectedAdvanceDeposit.BalanceAmount;
                                        payment.PaymentDetailDto.AdvanceTotalAmount = payment.AdvancePayment.SelectedAdvanceDeposit.AdvanceAmount;

                                        if (payment.PaymentSummary.DueAmount > -1) {
                                            payment.PaymentDetailDto.PayAmount = (payment.PaymentSummary.DueAmount >= balanceAmount) ? balanceAmount : payment.PaymentSummary.DueAmount;
                                            /// /// alert(payment.PaymentSummary.DueAmount);
                                            console.log(payment.PaymentSummary);
                                        }
                                        else {
                                            payment.PaymentDetailDto.PayAmount = 0;
                                        }
                                    }
                                    else {
                                        /// /// /// alert("dfd");
                                    }

                                    payment.PaymentsList.push(payment.PaymentDetailDto);
                                    DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode();
                                    break;
                                default:
                            }

                            console.log(payment.PaymentDetailDto);
                        }
                    };

                    payment.LoadData = {
                        LoadAdvanceDeposits: function () {
                            TransactionHandler.Execute.AdvanceDeposits.ReadAll(function (response) {
                                console.log(response);
                                /// advanceDeposits = response;
                                payment.AdvanceDepositList = response;
                            });
                        },

                        LoadGuestsList: function () {
                            TransactionHandler.Execute.Guests.ReadAll(function (response) {
                                console.log(response);
                                payment.GuestList = response;
                            });
                        },

                        LoadEmployeesList: function () {
                            TransactionHandler.Execute.Users.ReadAll(function (response) {
                                console.log(response);
                                payment.EmployeeList = response;
                            });
                        },

                        LoadBanksList: function () {
                            TransactionHandler.Execute.Bank.ReadAll(function (response) {
                                payment.BanksList = response;
                            });
                        },

                        LoadBranches: function (bankID) {
                            TransactionHandler.Execute.Branch.ReadByBankID(function (response) {
                                payment.BranchesList = response;
                            }, bankID);
                        },

                        LoadCityLedger: function () {
                            TransactionHandler.Execute.CityLedger.ReadAll(function (response) {
                                console.log(response);
                                payment.CityLedgerAccountsList = response;
                            });
                        },

                        LoadUserLevels: function () {
                            TransactionHandler.Execute.UserLevel.ReadAll(function (response) {
                                console.error(response);
                                payment.UserLevels = response.UserLevels;
                            });
                        }
                    };

                    payment.LoadBranches = function (bank) {

                        payment.BranchesList = [];
                        payment.Cheque.SelectedBank = bank;
                        payment.LoadData.LoadBranches(bank.BankId);
                    };

                    payment.BranchClick = function (branch) {
                        payment.Cheque.SelectedBranch = branch;
                    };

                    payment.PermissionRetrieval = (function () {
                        var permissionRetrieval = {};
                        var Callback = null;

                        permissionRetrieval.Callback = function (selectedUser, password) {
                            console.error(selectedUser);
                            if (selectedUser !== undefined && password !== undefined) {
                                var RestaurantID = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetLoginHelpingData()).RestaurantId;
                                /// /// /// alert(RestaurantID);
                                TransactionHandler.Execute.AuthenticateUser(selectedUser.UserId,
                                    password, RestaurantID, function (response) {
                                        if ("Error" in response) {

                                        }
                                        else {
                                            /// TransactionHandlerService.Config.SetSessionKey(response.);
                                            console.log(response);
                                            console.log(response.data.SessionKey);
                                            if (response.data.IsSuccessFull) {
                                                Callback(response.data);
                                            }
                                            else {
                                                /// alert("Username or password is wrong");
                                                comSingleButtonInfoAlert("Invalid Credentials", "Password is incorrect", "Got it!");
                                            }
                                        }
                                    });
                            }
                        };

                        permissionRetrieval.UserLevels = [];
                        permissionRetrieval.Users = [];
                        permissionRetrieval.Show = false;

                        permissionRetrieval.ShowPopup = function (callback) {
                            Callback = callback;
                            permissionRetrieval.Show = true;
                        };

                        return permissionRetrieval;
                    })();

                    /// Initialization
                    (function () {
                        payment.CreateDto.CreateCashPaymentDto();
                        payment.LoadData.LoadCityLedger();
                    })();

                    return payment;
                })();

                /// Handles advance deposits
                DataModule.AdvanceDeposit = (function () {
                    var advanceDeposit = {};
                    var isAdvanceDepositOn = false;

                    advanceDeposit.IsAdvanceDepositOn = ()=>isAdvanceDepositOn;

                    advanceDeposit.ToggleAdvanceDeposit = function () {
                        isAdvanceDepositOn = !isAdvanceDepositOn;

                        if (isAdvanceDepositOn) {
                            DataModule.NavigationHandler.RightPanel.ToAdvanceDeposit();
                        }
                    };

                    advanceDeposit.AdvanceAmount = 0;

                    scope.$watch("PaymentDataModule.Payment.PaymentsList", function (newVal) {
                        if (newVal !== undefined && Array.isArray(newVal)) {
                            advanceDeposit.AdvanceAmount = 0;
                            newVal.forEach(function (elem) {
                                advanceDeposit.AdvanceAmount += elem.PayAmount;
                            });
                        }
                    }, true);

                    advanceDeposit.MakeAdvanceDeposit = function () {
                        var paymentDto = ObjectFactoryService.Objects.Payment.GetAdvanceDepositDto();
                        var restaurantID = JSON.parse(MasterDataStorageHandler.DataStorageHandler.GetLoginHelpingData()).RestaurantId;

                        /// alert(paymentDto);
                        if (scope.HomeDataModule.LeftPanelDataModule.AdvanceDeposit.SelectedGuest == null &&
                            scope.HomeDataModule.LeftPanelDataModule.AdvanceDeposit.SelectedGuest == undefined) {
                            /// console.log("Select a guest");
                            comSingleButtonErrorAlert("Advance Deposit", "Please select a guest before attempting to confirm", "Got it!");
                            /// alert("Select a guest");
                            return false;
                        }
                        else if (DataModule.Payment.PaymentsList.length == 0) {
                            /// alert("First add payments");
                            comSingleButtonErrorAlert("Advance Deposit", "Please add payments before attempting to confirm", "Got it!");
                            return false;
                        }

                        var selectedGuest = scope.HomeDataModule.LeftPanelDataModule.AdvanceDeposit.SelectedGuest;

                        /// console.log(selectedGuest);

                        paymentDto.paymentAdvanceRequest.GuestID = selectedGuest.GuestId;
                        paymentDto.paymentAdvanceRequest.AdvanceAmount = advanceDeposit.AdvanceAmount;
                        paymentDto.paymentAdvanceRequest.BalanceAmount = advanceDeposit.AdvanceAmount;
                        paymentDto.paymentAdvanceRequest.RestaurantID = restaurantID;
                        paymentDto.paymentAdvanceRequest.UserId = 0;
                        paymentDto.paymentAdvanceRequest.Remarks = scope.HomeDataModule.LeftPanelDataModule.AdvanceDeposit.Remarks;
                        paymentDto.paymentAdvanceRequest.Guest.GuestID = selectedGuest.GuestId;

                        paymentDto.paymentDetailRequest = DataModule.Payment.PaymentsList;

                        /// console.log(paymentDto);

                        TransactionHandler.Execute.AdvanceDeposits.Create(function (response) {
                            /// console.log(response);
                            if (response.IsSuccessFull) {
                                DataModule.Payment.PaymentsList = [];
                                scope.HomeDataModule.LeftPanelDataModule.AdvanceDeposit.SelectedGuest = null;
                            }
                        }, paymentDto);
                    };

                    advanceDeposit.OnAdvanceDeposit = function () {
                        if (!advanceDeposit.IsAdvanceDepositOn()) {
                            advanceDeposit.ToggleAdvanceDeposit();
                        }
                    };

                    advanceDeposit.CancelAdvanceDeposit = function () {
                        if (advanceDeposit.IsAdvanceDepositOn()) {
                            advanceDeposit.ToggleAdvanceDeposit();
                            DataModule.Payment.PaymentsList.splice(0, DataModule.Payment.PaymentsList.length);

                            if (scope.HomeDataModule.SelectedOrder.Order.OrderID === undefined) {
                                DataModule.NavigationHandler.RightPanel.ToMultiplePayment();
                            }
                            else {
                                DataModule.NavigationHandler.RightPanel.Payment.ToCashPayment();
                            }
                        }
                    };

                    advanceDeposit.AddPayment = function () {

                        if (DataModule.Payment.PaymentDetailDto.PayAmount == 0) {
                            /// alert("Please provide paid amount");
                            comSingleButtonErrorAlert("Payment", "Please provide the paid amount", "Got it!");
                            return false;
                        }

                        switch(DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode) {
                            case DataModule.NavigationHandler.RightPanel.Payment.ToCashPayment:

                                let paymentDetail = DataModule.Payment.PaymentsList.find(function (elem) {
                                    if (elem.PaymentModeID == DataModule.Payment.PaymentDetailDto.PaymentModeID) {
                                        elem.PayAmount += DataModule.Payment.PaymentDetailDto.PayAmount;
                                        DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode();
                                        return true;
                                    }
                                });

                                if (paymentDetail === undefined) {
                                    DataModule.Payment.PaymentsList.push(DataModule.Payment.PaymentDetailDto);
                                    console.log(scope.LeftPanelDataModule);
                                    DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode();
                                }
                                break;
                            case DataModule.NavigationHandler.RightPanel.Payment.ToCreditCardPayment:
                                /// /// alert("Credit Card");
                                let issueDate = new Date(DataModule.Payment.PaymentDetailDto.CreditCardIssueDate);
                                let expiryDate = new Date(DataModule.Payment.PaymentDetailDto.CreditCardExpiryDate);
                                if (DataModule.Payment.PaymentDetailDto.CreditCardTypeID == 0) {
                                    DataModule.Payment.PaymentDetailDto.CreditCardIssueDate = "/Date(" + issueDate.getTime() + ")/";
                                    DataModule.Payment.PaymentDetailDto.CreditCardExpiryDate = "/Date(" + expiryDate.getTime() + ")/";
                                    DataModule.Payment.PaymentsList.push(DataModule.Payment.PaymentDetailDto);
                                    DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode();
                                }
                                else {
                                    comSingleButtonErrorAlert("CreditCard Payment", "Please select the credit card type. Ex: VISA, MASTERCARD," +
                                    " AMERICAN EXPRESS", "Got it!");
                                }
                                break;
                            case DataModule.NavigationHandler.RightPanel.Payment.ToChequePayment:
                                if (DataModule.Payment.Cheque.SelectedBank != null) {

                                    let chequeDate = new Date(DataModule.Payment.PaymentDetailDto.ChequeDate);
                                    let realizedDate = new Date(DataModule.Payment.PaymentDetailDto.ChequeRealizedDate);
                                    DataModule.Payment.PaymentDetailDto.BankId = DataModule.Payment.Cheque.SelectedBank.BankId;
                                    DataModule.Payment.PaymentDetailDto.BranchId = (DataModule.Payment.Cheque.SelectedBranch.BranchId === undefined) ? 0 : DataModule.Payment.Cheque.SelectedBranch.BranchId;
                                    DataModule.Payment.PaymentDetailDto.ChequeDate = "/Date(" + chequeDate.getTime() + ")/";
                                    DataModule.Payment.PaymentDetailDto.ChequeRealizedDate = "/Date(" + realizedDate.getTime() + ")/";
                                    DataModule.Payment.PaymentsList.push(DataModule.Payment.PaymentDetailDto);
                                    DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode();
                                }
                                else {
                                    comSingleButtonErrorAlert("Payment", "Please select a bank", "Got it!");
                                }
                                break;
                            default:
                        }
                    };

                    return advanceDeposit;
                })();

                DataModule.NavigationHandler = {
                    RightPanel: {
                        Payment: {

                            CurrentPaymentMode: null,

                            ToCashPayment: function () {
                                if (!DataModule.AdvanceDeposit.IsAdvanceDepositOn()) {
                                    DataModule.NavigationHandler.RightPanel.ToPayment();
                                }
                                scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.PaymentPanelView.BodyArea.RightPanel.BodyArea.PaymentMode.ToCashPayment();
                                DataModule.Payment.CreateDto.CreateCashPaymentDto();
                                DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode = DataModule.NavigationHandler.RightPanel.Payment.ToCashPayment;
                            },

                            ToCreditCardPayment: function () {
                                if (!DataModule.AdvanceDeposit.IsAdvanceDepositOn()) {
                                    DataModule.NavigationHandler.RightPanel.ToPayment();
                                }
                                scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.PaymentPanelView.BodyArea.RightPanel.BodyArea.PaymentMode.ToCreditCardPayment();
                                DataModule.Payment.CreateDto.CreateCreditCardPaymentDto();
                                DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode = DataModule.NavigationHandler.RightPanel.Payment.ToCreditCardPayment;
                            },

                            ToChequePayment: function () {
                                if (!DataModule.AdvanceDeposit.IsAdvanceDepositOn()) {
                                    DataModule.NavigationHandler.RightPanel.ToPayment();
                                }
                                scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.PaymentPanelView.BodyArea.RightPanel.BodyArea.PaymentMode.ToChequePayment();
                                DataModule.Payment.CreateDto.CreateChequePaymentDto();
                                DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode = DataModule.NavigationHandler.RightPanel.Payment.ToChequePayment;
                                DataModule.Payment.LoadData.LoadBanksList();
                                DataModule.Payment.Cheque.SelectedBank = null;
                                DataModule.Payment.Cheque.SelectedBranch = null;
                            },

                            ToDutyMealPayment: function () {
                                if (!DataModule.AdvanceDeposit.IsAdvanceDepositOn()) {

                                    scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.PaymentPanelView.BodyArea.RightPanel.BodyArea.PaymentMode.ToDutyMealPayment();
                                    DataModule.Payment.CreateDto.CreateDutyMealPaymentDto();
                                    DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode = DataModule.NavigationHandler.RightPanel.Payment.ToDutyMealPayment;
                                    DataModule.Payment.LoadData.LoadEmployeesList();
                                    DataModule.Payment.LoadData.LoadUserLevels();
                                    DataModule.Payment.DutyMeal.SelectedEmployee = null;
                                }
                            },

                            ToCityLedgerPayment: function () {
                                if (!DataModule.AdvanceDeposit.IsAdvanceDepositOn()) {

                                    scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.PaymentPanelView.BodyArea.RightPanel.BodyArea.PaymentMode.ToCityLedgerPayment();
                                    DataModule.Payment.CreateDto.CreateCityLedgerPaymentDto();
                                    DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode = DataModule.NavigationHandler.RightPanel.Payment.ToCityLedgerPayment;
                                    DataModule.Payment.LoadData.LoadCityLedger();
                                    DataModule.Payment.CityLedger.SelectedCityLedger = null;
                                }
                            },

                            ToAdvancePayment: function () {
                                if (!DataModule.AdvanceDeposit.IsAdvanceDepositOn()) {

                                    scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.PaymentPanelView.BodyArea.RightPanel.BodyArea.PaymentMode.ToAdvancePayment();
                                    DataModule.Payment.CreateDto.CreateAdvancePaymentDto();
                                    DataModule.NavigationHandler.RightPanel.Payment.CurrentPaymentMode = DataModule.NavigationHandler.RightPanel.Payment.ToAdvancePayment;
                                    DataModule.Payment.LoadData.LoadAdvanceDeposits();
                                    DataModule.Payment.AdvancePayment.SelectedAdvanceDeposit = null;
                                    /// DataModule.Payment.LoadData.LoadGuestsList();
                                }
                            }
                        },

                        ToMultiplePayment: function () {
                            if (!DataModule.AdvanceDeposit.IsAdvanceDepositOn()) {
                                DataModule.Payment.PaymentsList.splice(0, DataModule.Payment.PaymentsList.length);
                                scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.PaymentPanelView.BodyArea.RightPanel.BodyArea.ToMultiplePayment();
                                scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.BodyArea.ToBillDisplayView();
                            }
                            else {
                                $.Notify({
                                    caption: 'Advance Deposit',
                                    content: 'Cancel the advance deposit first!',
                                    type: '/// alert'
                                });
                            }
                        },
                        ToAdvanceDeposit: function () {
                            DataModule.Payment.PaymentsList.splice(0, DataModule.Payment.PaymentsList.length);
                            scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.PaymentPanelView.BodyArea.RightPanel.BodyArea.ToAdvanceDeposit();
                            scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.BodyArea.ToGuestCreationPanel();
                            scope.HomeDataModule.SelectedOrder.MultipleOrders = [];
                        },
                        ToPayment: function () {
                            /*/// alert("ToPayment");*/
                            if (scope.HomeDataModule.SelectedOrder.Order.OrderID !== undefined) {
                                scope.UrlFactory.UrlExchanger.HomePage.MiddlePanel.BodyArea.PaymentPanelView.BodyArea.RightPanel.BodyArea.ToPayment();
                                scope.UrlFactory.UrlExchanger.HomePage.LeftPanel.BodyArea.ToBillDisplayView();
                            }
                            else {
                                /// alert("dsdf");
                            }
                        }
                    }
                };

                /// Handles multiple payments
                DataModule.MultiplePayment = (function () {
                    var multiplePayment = {};

                    multiplePayment.MultipleOrders = scope.HomeDataModule.SelectedOrder.MultipleOrders;
                    multiplePayment.OrderType = null;
                    multiplePayment.Orders = {
                        DiningOrders: [],
                        TakeoutOrders: [],
                        DeliveryOrders: [],
                        TabOrders: []
                    };

                    var UpdateSummary = function (order) {
                        let summary = scope.HomeDataModule.SelectedOrder.PricesSummary;
                        summary.NetTotal += order.NetPrice;
                        summary.DiscountTotal += order.DiscountPrice + order.LineDiscountPrice;
                        summary.GrandTotal += order.TotalPrice;
                        summary.ServiceCharge += order.ServiceChargePrice;

                    };

                    multiplePayment.AddOrder = function (e, order) {

                        if (multiplePayment.OrderType == null || multiplePayment.OrderType == order.OrderType) {

                            if (multiplePayment.MultipleOrders.length > 0) {
                                for (let i = 0; i < multiplePayment.MultipleOrders.length; i++) {
                                    if (multiplePayment.MultipleOrders[i] === order) {
                                        multiplePayment.MultipleOrders.splice(i, 1);
                                        if (multiplePayment.MultipleOrders.length == 0) {
                                            multiplePayment.OrderType = null;
                                        }
                                        break;
                                    }
                                    else if (i == (multiplePayment.MultipleOrders.length - 1)) {
                                        multiplePayment.OrderType = order.OrderType;
                                        multiplePayment.MultipleOrders.push(order);
                                        /// alert("An order added to the mulyiple payment");
                                        break;
                                    }
                                }
                            }
                            else {
                                multiplePayment.OrderType = order.OrderType;
                                multiplePayment.MultipleOrders.push(order);
                                /// alert("An order added to the mulyiple payment");
                            }
                        }
                        else {
                            comSingleButtonInfoAlert("Multiple Payment", "Please select orders of the same type.",
                            "Got it!");
                            /// alert("Please select same type orders");
                        }
                    };

                    multiplePayment.LoadOrders = function () {
                        let diningOrderCategoryID = scope.HomeDataModule.OrderCategories.DiningOrder.OrderCategoryId;
                        let takeoutOrderCategoryID = scope.HomeDataModule.OrderCategories.TakeoutOrder.OrderCategoryId;
                        let deliveryOrderCategoryID = scope.HomeDataModule.OrderCategories.DeliveryOrder.OrderCategoryId;
                        let tabOrderCategoryID = scope.HomeDataModule.OrderCategories.TabOrder.OrderCategoryId;

                        TransactionHandler.Execute.Order.ReadByOrderCategoryId(function (response) {
                            console.log(response);
                            multiplePayment.Orders.DiningOrders = response.OrderHeaderResponse;
                        }, diningOrderCategoryID);

                        TransactionHandler.Execute.Order.ReadByOrderCategoryId(function (response) {
                            multiplePayment.Orders.TakeoutOrders = response.OrderHeaderResponse;
                        }, takeoutOrderCategoryID);

                        TransactionHandler.Execute.Order.ReadByOrderCategoryId(function (response) {
                            multiplePayment.Orders.DeliveryOrders = response.OrderHeaderResponse;
                        }, deliveryOrderCategoryID);

                        TransactionHandler.Execute.Order.ReadByOrderCategoryId(function (response) {
                            multiplePayment.Orders.TabOrders = response.OrderHeaderResponse;
                        }, tabOrderCategoryID);
                    };

                    return multiplePayment;
                })();

                /// Initialization
                (function () {
                    if (scope.HomeDataModule.SelectedOrder.Order.OrderID !== undefined) {
                        DataModule.NavigationHandler.RightPanel.ToPayment();
                    }
                    else {
                        DataModule.NavigationHandler.RightPanel.ToAdvanceDeposit();
                    }

                    DataModule.NavigationHandler.RightPanel.Payment.ToCashPayment();
                    DataModule.MultiplePayment.LoadOrders();
                    scope.HomeDataModule.SelectedOrder.MultipleOrders.splice(0,
                        scope.HomeDataModule.SelectedOrder.MultipleOrders.length);
                })();

                return DataModule;
            })(scope);

        }
    });
    cloudPOS.ng.application.controller('PaymentPanelController', [
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
        cloudPOS.controllers.PaymentPanelController
    ]).run(function ($log) {
        $log.info("PaymentPanelController initialized");
    });
}(cloudPOS.controllers || {}));
