(function (module) {
    cloudPOS.services = _.extend(module, {
        UrlFactory: function () {

            /// UrlsObject represents all the view resources of the application
            /// Developer should use view resources from this module without replicating same resources
            var urlsObject = {

                /// Main views of the application
                HeaderView: "views/header/headerView",
                MainPagesView: "views/mainView.html",
                LoginView: "views/login/loginView.html",
                HomeView: "views/home/homeView.html",
                AdminView: "views/admin/adminView.html",
                ReportView: "views/report/reportView.html",
                ReservationView: "views/reservation/reservationView.html",
                WastageView: "views/wastage/wastageView.html",

                /// Header view's middle panel area.
                /// This area is used to display information
                HeaderViewMiddlePanel: {
                    Default: "views/header/middlePanel/defaultView.html",
                    OrderInfoView: "views/header/middlePanel/orderInfoView.html"
                },

                /// Views of the home page

                /// Views of the left panel
                HomeViewLeftPanelOrdersDisplayArea: "views/home/leftPanel/ordersDisplayView.html",
                HomeViewLeftPanelMainDisplayArea: "views/home/leftPanel/leftPanelMainDisplayView.html",
                HomeViewLeftPanelOrderDetailDisplayView: "views/home/leftPanel/mainDisplayPanel/orderDetailDisplayPanelView.html",
                HomeViewLeftPanelPaymentDisplayView: "views/home/leftPanel/mainDisplayPanel/paymentDisplayPanelView.html",
                HomeViewLeftPanelReservationCheckInView: "views/home/leftPanel/mainDisplayPanel/reservationCheckInPanelView.html",
                HomeViewLeftPanelBillDisplayingPanel: "views/home/leftPanel/mainDisplayPanel/billDisplayPanelView.html",
                HomeViewLeftPanelGuestCreationPanel: "views/home/leftPanel/mainDisplayPanel/guestCreationPanel.html",
                HomeViewLeftPanelBottomMenu: "views/home/leftPanel/bottomMenuView.html",
                HomeViewLeftPanelPaymentCashPayment: "views/home/leftPanel/mainDisplayPanel/paymentView/cashPaymentView.html",
                HomeViewLeftPanelPaymentChequePayment: "views/home/leftPanel/mainDisplayPanel/paymentView/chequePaymentView.html",
                HomeViewLeftPanelPaymentDutyMealPayment: "views/home/leftPanel/mainDisplayPanel/paymentView/dutyMealPaymentView.html",
                HomeViewLeftPanelPaymentCreditCardPayment: "views/home/leftPanel/mainDisplayPanel/paymentView/creditCardPaymentView.html",
                HomeViewLeftPanelPaymentCityLedgerPayment: "views/home/leftPanel/mainDisplayPanel/paymentView/cityLedgerPaymentView.html",
                HomeViewLeftPanelPaymentAdvancePayment: "views/home/leftPanel/mainDisplayPanel/paymentView/advancePaymentView.html",
                HomeViewMiddlePanelOrderView: "views/home/middlePanel/orderPanelView.html",
                HomeViewMiddlePanelSplitView: "views/home/middlePanel/splitPanelView.html",
                HomeViewMiddlePanelNewOrderView: "views/home/middlePanel/newOrderPanelView.html",
                HomeViewMiddlePanelDiscountPanel: "views/home/middlePanel/discountPanelView.html",
                HomeViewMiddlePanelOrderViewHorizontalFoodCategoryView: "views/home/middlePanel/orderPanel/horizontalFoodCategoryPanelView.html",
                HomeViewMiddlePanelOrderViewVerticalFoodSubCategoryView: "views/home/middlePanel/orderPanel/verticalFoodTypePanelView.html",
                HomeViewMiddlePanelOrderViewFilteredItemsView: "views/home/middlePanel/orderPanel/filteredFoodItemsPanelView.html",

                /// Views of the home page's middle panel's newOrderPanel
                HomeViewMiddlePanelNewOrderViewBodyAreaDiningOrderView: "views/home/middlePanel/newOrderPanel/diningOrderView.html",
                HomeViewMiddlePanelNewOrderViewBodyAreaTakeoutOrderView: "views/home/middlePanel/newOrderPanel/takeoutOrderView.html",
                HomeViewMiddlePanelNewOrderViewBodyAreaDeliveryOrderView: "views/home/middlePanel/newOrderPanel/deliveryOrderView.html",
                HomeViewMiddlePanelNewOrderViewBodyAreaTabOrderView: "views/home/middlePanel/newOrderPanel/tabOrderView.html",

                /// Views of the home page's middle panel's MultipleOptionsPanelView
                HomeViewMiddlePanelMultipleOptionsPanelView: {
                    MainPanel: "views/home/middlePanel/multipleOptionsPanelView.html",
                    BodyArea: {
                        MultiplePayment: "views/home/middlePanel/multipleOptionsPanel/multiplePaymentView.html",
                        AdvanceDeposit: "views/home/middlePanel/multipleOptionsPanel/advanceDepositView.html",
                        DiscountPanel: "views/home/middlePanel/multipleOptionsPanel/discountPanelView.html"
                    }
                },

                HomeViewMiddlePanelPaymentPanelView: {
                    BodyArea: "views/home/middlePanel/paymentPanelView.html",
                    RightPanel: {
                        BodyArea: "",
                        PaymentOptions: {
                            CashPaymentView: "views/home/middlePanel/PaymentPanel/PaymentModes/cashPaymentView.html",
                            CreditCardPaymentView: "views/home/middlePanel/PaymentPanel/PaymentModes/creditCardPaymentView.html",
                            ChequePaymentView: "views/home/middlePanel/PaymentPanel/PaymentModes/chequePaymentView.html",
                            DutyMealPaymentView: "views/home/middlePanel/PaymentPanel/PaymentModes/dutyMealPaymentView.html",
                            CityLedgerPaymentView: "views/home/middlePanel/PaymentPanel/PaymentModes/cityLedgerPaymentView.html",
                            AdvancePaymentView: "views/home/middlePanel/PaymentPanel/PaymentModes/advancePaymentView.html"
                        },
                        PaymentView: "views/home/middlePanel/PaymentPanel/paymentView.html",
                        MultiplePaymentView: "views/home/middlePanel/PaymentPanel/multiplePaymentView.html",
                        AdvanceDepositView: "views/home/middlePanel/PaymentPanel/advanceDepositView.html"
                    }
                },

                AdminPanelView: {
                    MasterDataMgt: {
                        ContentArea: {
                            FoodsMgtView: "views/admin/admin/rightPanel/masterDataManagement/foodsView.html",
                            FoodTypesMgtView: "",
                            FoodCategoriesMgtView: "",
                            TablesMgtView: "",
                            MessagesMgtView: "",
                            DeliveryZoneMgtView: ""
                        }
                    }
                }
            };

            /// Url Holders. These variables are included as values of ng-include directives.
            this.UrlHolders = {
                RootViewUrl: urlsObject.LoginView,
                MainPagesUrl: urlsObject.HomeView,
                HeaderViewMiddlePanel: urlsObject.HeaderViewMiddlePanel.Default,
                HomePageLeftPanelMainBody: urlsObject.HomeViewLeftPanelOrdersDisplayArea,
                HomePageLeftPanelBodyArea: urlsObject.HomeViewLeftPanelOrderDetailDisplayView,
                HomePageLeftPanelPaymentOption: urlsObject.HomeViewLeftPanelPaymentCashPayment,
                HomePageMiddlePanelBodyArea: urlsObject.HomeViewMiddlePanelOrderView,

                HomeViewLeftPanelOrderDetailDisplayView: urlsObject.HomeViewLeftPanelOrderDetailDisplayView,
                HomeViewLeftPanelOrderPaymentDisplayView: urlsObject.HomeViewLeftPanelPaymentDisplayView,

                /// Url holders of the newOrderPanel of the HomePage's middle panel
                HomeViewMiddlePanelNewOrder: {
                    BodyArea: urlsObject.HomeViewMiddlePanelNewOrderViewBodyAreaTakeoutOrderView
                },

                HomeViewMiddlePanelMultipleOptionsPanel: {
                    BodyArea: urlsObject.HomeViewMiddlePanelMultipleOptionsPanelView.BodyArea.MultiplePayment
                },

                HomeViewMiddlePanelPaymentPanel: {
                    LeftPanel: {
                    },
                    RightPanel: {
                        BodyArea: urlsObject.HomeViewMiddlePanelPaymentPanelView.RightPanel.PaymentView,
                        PaymentOptionsArea : urlsObject.HomeViewMiddlePanelPaymentPanelView.RightPanel.PaymentOptions.CashPaymentView
                    }
                },

                AdminPanel: {
                    RightPanel: {
                        MasterDataMgtPanel: {
                            ContentArea: urlsObject.AdminPanelView.MasterDataMgt.ContentArea.FoodsMgtView
                        }
                    }
                }
            };

            /// Reset UrlHolder's values
            this.ResetUrlFactory = new (function (This) {
                this.ResetHomePage = function () {

                    This.UrlExchanger.HomePage.LeftPanel.BodyArea.ToOrderDetailView();
                    This.UrlExchanger.HomePage.LeftPanel.PaymentOptions.ToCashView();
                    This.UrlExchanger.HomePage.MiddlePanel.BodyArea.ToOrderView();
                };
            })(this);

            /// Clone the urlsObject and make the cloned object public
            /// so as to avoid original object being modified by external scripts that use UrlFactory.
            this.UrlsObject = Object.assign({}, urlsObject);

            /// For usage inside inner objects.
            var urlHolders = this.UrlHolders;

            /// Views urls exchanger. This object used for navigation from one page to another.
            this.UrlExchanger = {};

            /// Exchange root view.
            this.UrlExchanger.ExchangeRootView = {
                ToLoginView: function () {
                    urlHolders.RootViewUrl = urlsObject.LoginView;
                },
                ToMainPagesView: function () {
                    urlHolders.RootViewUrl = urlsObject.MainPagesView;
                }
            };

            /// Exchange mainPages url Ex: home page, admin page, wastage page, and reservation page.
            this.UrlExchanger.ExchangeMainPagesView = {
                ToHomeView: function () {
                    urlHolders.MainPagesUrl = urlsObject.HomeView;
                },
                ToAdminView: function () {
                    urlHolders.MainPagesUrl = urlsObject.AdminView;
                },
                ToReservationView: function () {
                    urlHolders.MainPagesUrl = urlsObject.ReservationView;
                },
                ToWastageView: function () {
                    urlHolders.MainPagesUrl = urlsObject.WastageView;
                },
                ToReportView: function () {
                    urlHolders.MainPagesUrl = urlsObject.ReportView;
                }
            };

            /// Header view url exchangers
            this.UrlExchanger.HeaderView = {};

            /// Middle panel of the header view, which is used for exhibiting information
            this.UrlExchanger.HeaderView.MiddlePanel = {
                ToDefaultView: function () {
                    urlHolders.HeaderViewMiddlePanel = urlsObject.HeaderViewMiddlePanel.Default;
                },
                ToOrderInfoView: function () {
                    urlHolders.HeaderViewMiddlePanel = urlsObject.HeaderViewMiddlePanel.OrderInfoView;
                }
            };

            /// HomePage url exchangers
            this.UrlExchanger.HomePage = {};

            /// HomePage
            /// LeftPanel
            /// BodyArea url exchanger
            this.UrlExchanger.HomePage.LeftPanel = {
                BodyArea: {
                    ToPaymentView: function() {
                        urlHolders.HomePageLeftPanelBodyArea = urlsObject.HomeViewLeftPanelPaymentDisplayView;
                    },
                    ToOrderDetailView: function() {
                        urlHolders.HomePageLeftPanelBodyArea = urlsObject.HomeViewLeftPanelOrderDetailDisplayView;
                    },
                    ToReservationCheckInView: function () {
                        urlHolders.HomePageLeftPanelBodyArea = urlsObject.HomeViewLeftPanelReservationCheckInView;
                    },
                    ToBillDisplayView: function () {
                        urlHolders.HomePageLeftPanelBodyArea = urlsObject.HomeViewLeftPanelBillDisplayingPanel;
                    },
                    ToGuestCreationPanel: function () {
                        urlHolders.HomePageLeftPanelBodyArea = urlsObject.HomeViewLeftPanelGuestCreationPanel;
                    }
                },

                MainBodyArea: {
                    ToOrdersDisplayView: function () {
                        urlHolders.HomePageLeftPanelMainBody = urlsObject.HomeViewLeftPanelOrdersDisplayArea;
                    },
                    ToMainArea: function () {
                        urlHolders.HomePageLeftPanelMainBody = urlsObject.HomeViewLeftPanelMainDisplayArea;
                    }
                }
            };

            /// HomePage -> LeftPanel -> Payment
            this.UrlExchanger.HomePage.LeftPanel.PaymentOptions = {
                ToCashView: function () {
                    urlHolders.HomePageLeftPanelPaymentOption = urlsObject.HomeViewLeftPanelPaymentCashPayment;
                },
                ToCreditCardView: function () {
                    urlHolders.HomePageLeftPanelPaymentOption = urlsObject.HomeViewLeftPanelPaymentCreditCardPayment;
                },
                ToChequeView: function () {
                    urlHolders.HomePageLeftPanelPaymentOption = urlsObject.HomeViewLeftPanelPaymentChequePayment;
                },
                ToDutyMealView: function () {
                    urlHolders.HomePageLeftPanelPaymentOption = urlsObject.HomeViewLeftPanelPaymentDutyMealPayment;
                },
                ToCityLedgerView: function () {
                    urlHolders.HomePageLeftPanelPaymentOption = urlsObject.HomeViewLeftPanelPaymentCityLedgerPayment;
                },
                ToAdvanceView: function () {
                    urlHolders.HomePageLeftPanelPaymentOption = urlsObject.HomeViewLeftPanelPaymentAdvancePayment;
                }
            };

            /// HomePage -> MiddlePanel
            this.UrlExchanger.HomePage.MiddlePanel = {};

            /// HomePage -> MiddlePanel -> BodyArea
            this.UrlExchanger.HomePage.MiddlePanel.BodyArea = {
                ToOrderView: function () {
                    urlHolders.HomePageMiddlePanelBodyArea = urlsObject.HomeViewMiddlePanelOrderView;
                },
                ToNewOrderView: function () {
                    urlHolders.HomePageMiddlePanelBodyArea = urlsObject.HomeViewMiddlePanelNewOrderView;
                },
                ToSplitView: function () {
                    urlHolders.HomePageMiddlePanelBodyArea = urlsObject.HomeViewMiddlePanelSplitView;
                },
                ToDiscountView: function () {
                    urlHolders.HomePageMiddlePanelBodyArea = urlsObject.HomeViewMiddlePanelDiscountPanel;
                },
                ToMultipleOptionsPanelView: function () {
                    urlHolders.HomePageMiddlePanelBodyArea = urlsObject.HomeViewMiddlePanelMultipleOptionsPanelView.MainPanel;
                },
                ToPaymentPanelView: function () {
                    urlHolders.HomePageMiddlePanelBodyArea = urlsObject.HomeViewMiddlePanelPaymentPanelView.BodyArea;
                }
            };

            this.UrlExchanger.HomePage.MiddlePanel.BodyArea.PaymentPanelView = {
                BodyArea: {
                    RightPanel: {
                        BodyArea: {
                            PaymentMode: {
                                ToCashPayment: function () {
                                    urlHolders.HomeViewMiddlePanelPaymentPanel.RightPanel.PaymentOptionsArea = urlsObject.HomeViewMiddlePanelPaymentPanelView.RightPanel.PaymentOptions.CashPaymentView;
                                },
                                ToCreditCardPayment: function () {
                                    urlHolders.HomeViewMiddlePanelPaymentPanel.RightPanel.PaymentOptionsArea = urlsObject.HomeViewMiddlePanelPaymentPanelView.RightPanel.PaymentOptions.CreditCardPaymentView;
                                },
                                ToChequePayment: function () {
                                    urlHolders.HomeViewMiddlePanelPaymentPanel.RightPanel.PaymentOptionsArea = urlsObject.HomeViewMiddlePanelPaymentPanelView.RightPanel.PaymentOptions.ChequePaymentView;
                                },
                                ToDutyMealPayment: function () {
                                    urlHolders.HomeViewMiddlePanelPaymentPanel.RightPanel.PaymentOptionsArea = urlsObject.HomeViewMiddlePanelPaymentPanelView.RightPanel.PaymentOptions.DutyMealPaymentView;
                                },
                                ToCityLedgerPayment: function () {
                                    urlHolders.HomeViewMiddlePanelPaymentPanel.RightPanel.PaymentOptionsArea = urlsObject.HomeViewMiddlePanelPaymentPanelView.RightPanel.PaymentOptions.CityLedgerPaymentView;
                                },
                                ToAdvancePayment: function () {
                                    urlHolders.HomeViewMiddlePanelPaymentPanel.RightPanel.PaymentOptionsArea = urlsObject.HomeViewMiddlePanelPaymentPanelView.RightPanel.PaymentOptions.AdvancePaymentView;
                                }
                            },

                            ToMultiplePayment: function () {
                                urlHolders.HomeViewMiddlePanelPaymentPanel.RightPanel.BodyArea = urlsObject.HomeViewMiddlePanelPaymentPanelView.RightPanel.MultiplePaymentView;
                            },
                            ToAdvanceDeposit: function () {
                                urlHolders.HomeViewMiddlePanelPaymentPanel.RightPanel.BodyArea = urlsObject.HomeViewMiddlePanelPaymentPanelView.RightPanel.AdvanceDepositView;
                            },
                            ToPayment: function () {
                                urlHolders.HomeViewMiddlePanelPaymentPanel.RightPanel.BodyArea = urlsObject.HomeViewMiddlePanelPaymentPanelView.RightPanel.PaymentView;
                            }
                        }
                    }
                }
            };

            /// Change views of the newOrderPanel
            this.UrlExchanger.HomePage.MiddlePanel.BodyArea.NewOrderView = {
                BodyArea: {
                    ToDiningOrderView: function () {
                        urlHolders.HomeViewMiddlePanelNewOrder.BodyArea = urlsObject.HomeViewMiddlePanelNewOrderViewBodyAreaDiningOrderView;
                    },
                    ToTakeoutOrderView: function () {
                        urlHolders.HomeViewMiddlePanelNewOrder.BodyArea = urlsObject.HomeViewMiddlePanelNewOrderViewBodyAreaTakeoutOrderView;
                    },
                    ToDeliveryOrderView: function () {
                        urlHolders.HomeViewMiddlePanelNewOrder.BodyArea = urlsObject.HomeViewMiddlePanelNewOrderViewBodyAreaDeliveryOrderView;
                    },
                    ToTabOrderView: function () {
                        urlHolders.HomeViewMiddlePanelNewOrder.BodyArea = urlsObject.HomeViewMiddlePanelNewOrderViewBodyAreaTabOrderView;
                    }
                }
            };

            /// Change views of the MultipleOptionsPanel
            this.UrlExchanger.HomePage.MiddlePanel.BodyArea.MultipleOptionsPanelView = {
                BodyArea: {
                    ToMultiplePaymentView: function () {
                        urlHolders.HomeViewMiddlePanelMultipleOptionsPanel.BodyArea = urlsObject.HomeViewMiddlePanelMultipleOptionsPanelView.BodyArea.MultiplePayment;
                    },

                    ToAdvanceDepositView: function () {
                        urlHolders.HomeViewMiddlePanelMultipleOptionsPanel.BodyArea = urlsObject.HomeViewMiddlePanelMultipleOptionsPanelView.BodyArea.AdvanceDeposit;
                    },

                    ToDiscountPanelView: function () {
                        urlHolders.HomeViewMiddlePanelMultipleOptionsPanel.BodyArea = urlsObject.HomeViewMiddlePanelMultipleOptionsPanelView.BodyArea.DiscountPanel;
                    }
                }
            };

            this.UrlExchanger.AdminPage = {};

            this.UrlExchanger.AdminPage.MasterDataMgt = {
                ToFoodsMgtView: function () {
                    urlHolders.AdminPanel.RightPanel.MasterDataMgtPanel.ContentArea = urlsObject.AdminPanelView.MasterDataMgt.ContentArea.FoodsMgtView;
                },
                ToFoodTypesMgtView: function () {
                    urlHolders.AdminPanel.RightPanel.MasterDataMgtPanel.ContentArea = urlsObject.AdminPanelView.MasterDataMgt.ContentArea.FoodsMgtView;
                },
                ToFoodCategoriesMgtView: function () {
                    urlHolders.AdminPanel.RightPanel.MasterDataMgtPanel.ContentArea = urlsObject.AdminPanelView.MasterDataMgt.ContentArea.FoodsMgtView;
                },
                ToTablesMgtView: function () {
                    urlHolders.AdminPanel.RightPanel.MasterDataMgtPanel.ContentArea = urlsObject.AdminPanelView.MasterDataMgt.ContentArea.FoodsMgtView;
                },
                ToMessagesMgtView: function () {
                    urlHolders.AdminPanel.RightPanel.MasterDataMgtPanel.ContentArea = urlsObject.AdminPanelView.MasterDataMgt.ContentArea.FoodsMgtView;
                },
                ToDeliveryMgtView: function () {
                    urlHolders.AdminPanel.RightPanel.MasterDataMgtPanel.ContentArea = urlsObject.AdminPanelView.MasterDataMgt.ContentArea.FoodsMgtView;
                }
            };
        }
    });

    cloudPOS.ng.services.service('UrlFactory', [
        cloudPOS.services.UrlFactory
    ]).run(function ($log) {
        $log.info("UrlFactory initialized");
    });
}(cloudPOS.services || {}));
