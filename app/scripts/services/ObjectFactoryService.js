(function (module) {
    cloudPOS.services = _.extend(module, {
        ObjectFactoryService: function () {

            /// Contains objects which are used as parameters in http requests and responses
            var objects = {

                OrderData: {
                    orderHeaderRequestDtoList: [
                        {
                            OrderID: "0",
                            GuestID: "0",
                            ReservationId: "0",
                            ResId: "2000",
                            NetPrice: "0",
                            DiscountID: "0",
                            DiscountPrice: "0",
                            TaxID: "0",
                            TaxPrice: "0",
                            VatClaimID: "0",
                            VatClaimPrice: "0",
                            ServiceChargeID: "0",
                            ServiceChargePrice: "0",
                            TotalPrice: "0",
                            TotItem: "0",
                            OrderType: "T",
                            Status: "1",
                            UserId: "1",
                            TableNo: "0",
                            OrderCancellationReason: "null",
                            CancelUserID: "0",
                            IsBillDiscountEnabled: "false",
                            DeliveryCharges: "0",
                            LineDiscountPrice: "0",
                            OrderToken: "null",
                            IsHeaderServiceChargeOn: "false"
                        }
                    ],

                    orderDetailRequestDtoList: [
                        {
                            "OrderDetailID": "0",
                            "OrderID": "0",
                            "FoodId": "0",
                            "ItemId": "0",
                            "GuestID": "0",
                            "ResId": "2000",
                            "Quantity": "1",
                            "NetPrice": 0,
                            "DiscountID": 0,
                            "DiscountPrice": "0",
                            "TaxID": "0",
                            "TaxPrice": 0,
                            "VatClaimID": 0,
                            "VatClaimPrice": 0,
                            "ServiceChargeID": 0,
                            "ServiceChargePrice": 0,
                            "TotalPrice": 0,
                            "Remarks": "",
                            "Status": "C",
                            "Tag": "0",
                            "IsCompliment": "false",
                            "UserId": "1",
                            "OrderReservationID": "0",
                            "LineDiscountID": "0",
                            "LineDiscountPrice": "0",
                            "CoverNumber": "0",
                            "ModifierRefID": "0",
                            "IsNet": "false",
                            "IsLineVatOn": "true",
                            "IsLineOtherTaxOn": "true",
                            "IsLineServiceChargeOn": "true",
                            "IsDayEnd": "false",
                            "IsQuantityBasedOrder": "false",
                            "FoodSize": 0,
                            "FoodPrice": 0,
                            "IsModifier": "false",
                            "FoodName": ""
                        }
                    ],

                    guest: null,
                    isDelete: "false",
                    isCooked: "false",
                    isLineDiscountGiven: "false"
                },

                /// Contains Data Transfer Objects (DTO) of the admin resources
                AdminData: {
                    Guest: {
                        "GuestId": "0",
                        "Title": "1",
                        "Description": "",
                        "FirstName": "",
                        "LastName": "",
                        "Mobile": "",
                        "Email": "",
                        "Status": "1",
                        "OrderType": "",
                        "SelectedAddressID": "0",
                        "RiderID": "0",
                        "GuestAddressList": [
                            {
                                "AddressID": 0,
                                "GuestId": 0,
                                "Location": "",
                                "Address1": "",
                                "Address2": "",
                                "City": "",
                                "State": "",
                                "PostalCodeID": 0,
                                "Country": "",
                                "WorkPlace": "",
                                "ZoneCode": 0,
                                "DeliveryRate": 0,
                                "Status": 1
                            }
                        ],
                        "FoodComment": "",
                        "PhoneNumber": "0"
                    },

                    UserLevel: {
                        "UserLevelId": 0,
                        "ResId": 0,
                        "UserLevelName": "",
                        "Status": 1
                    },

                    UserLevelRule: {
                        "UserLevelRuleId": 0,
                        "UserLevelId": 0,
                        "ResId": 0,
                        "RuleId": 0,
                        "IsMenu": false,
                        "Status": 1
                    },

                    UserLevelPrivilege: {
                        "UserLevelPrivilegeId": 0,
                        "UserLevelId": 0,
                        "ResId": 0,
                        "PrivilegeId": 1,
                        "Status": 1
                    }
                },

                /// Contains Data Transfer Objects (DTO) of the master resources
                MasterData: {
                    FoodDto: {
                        Name: "",
                        Description: "",
                        Price: 0.0,
                        FoodCatId: 0,
                        FoodTypeId: 0,
                        FoodDpId: 0,
                        MealTypeId: 0,
                        MakeTime: 0,
                        CalorieCount: 0,
                        IsMealTypeNeeded: false,
                        IsOpen: false,
                        IsModifier: false,
                        HasModifier: false,
                        IsRecipe: false,
                        FoodCost: 0.0,
                        StandardCost: 0.0,
                        CookingTime: 0,
                        MeasureTypeId: 0,
                        Measurable: false
                    },

                    FoodCategoryDto: {
                        FoodCatId: -1,
                        Description: "",
                        IndexID: 0
                    },

                    FoodSubCategoryDto: {
                        FoodTypeId: -1,
                        IndexId: 0,
                        Name: "",
                        FoodCatId: "",
                        MealTypeId: ""
                    }
                },

                /// Contains Data Transfer Objects (DTO) of the payment resources
                PaymentData: {
                    Payment: {
                        paymentHeaderRequestDto: {
                            PaymentHeaderID: 0,
                            RestaurantId: 2000,
                            OrderReservationIds: [],
                            PaymentDate: null,
                            NetPrice: 0.0
                        },
                        paymentDetailResponseDtoList: [],

                        /// Assign number of order detail objects that has been added to the payment
                        payEquityCount: 1
                    },

                    OrderReservationIds: {
                        OrderId: "0",
                        ReservationId: "0",
                        PaymentVAT: null,
                        ReceivedAmount: "0.0"
                    },

                    paymentTypes: {

                        /// Common properties
                        Normal: {
                            PaymentDetailID: 0,
                            PaymentID: 0,
                            PaymentModeID: 1,
                            PayAmount: 0.0
                        },

                        CreditCardPayment: {
                            CreditCardHolderName: "",
                            CreditCardTypeID: "",
                            CreditCardNo: "",
                            CreditCardIssueDate: "",
                            CreditCardExpiryDate: ""
                        },

                        Cheque: {
                            ChequeNo: "",
                            CompanyName: "",
                            ChequeDate: "",
                            BankId: "",
                            BranchId: "",
                            ChequeRealizedDate: ""
                        },

                        DutyMeal: {
                            EmployeeID: "",
                            AuthorizedEmployeeID: ""
                        },

                        CityLedger: {
                            GuestName: "",
                            IdentityCardNO: ""
                        },

                        Advance: {
                            AdvanceID: "",
                            AvailableBalance: "",
                            AdvanceTotalAmount: ""
                        }
                    },

                    AdvanceDeposit: {
                        paymentAdvanceRequest: {
                            GuestID: 0,
                            AdvanceAmount: 0,
                            BalanceAmount: 0,
                            RestaurantID: 0,
                            UserId: 0,
                            Remarks: "",
                            Guest: {
                                GuestID: 0
                            }
                        },
                        paymentDetailRequest: []
                    }
                },

                /// Contains Data Transfer Objects (DTO) of the reservation resources
                ReservationData: {

                    reservationHeader: {
                        "ReservationId": "0",
                        "ResId": "0",
                        "NoTables": "1",
                        "ReservationType": "STANDARD",
                        "ReservationDate": "",
                        "Description": "OPEN TABLE",
                        "NoOfGuest": 1,
                        "Status": "C",
                        "GuestId": ""
                    },

                    reservationDetailList: {
                        "ReservationId": "0",
                        "RestaurantID": "0",
                        "TableNo": "1",
                        "NoTables": []
                    },

                    guestDetails: null
                },

                /// Inventory Dtos
                Inventory: {
                    FoodRecipe: {
                        Name: "",
                        ItemTypeId: 0,
                        ItemTypeName: "",
                        NoOfDays: 0,
                        MeasureTypeId: 0,
                        IsPreferedParentMeasureType: 0,
                        IsRawMaterial: false,
                        AvgCost: 0.0
                    },

                    RecipeItem: {
                        ItemId: 0,
                        Quantity: 0,
                        Note: "",
                        AvgPricePerUnit: 0.0,
                        UnitOfMeasureID: 0.0,
                        IsRecipe: false
                    }
                }
            };

            /// Provides an interface to retrieve objects
            this.Objects = {

                Payment: {
                    GetPaymentDto: function () {

                        var paymentDto = Object.assign({}, objects.PaymentData.Payment);
                        paymentDto.paymentHeaderRequestDto = Object.assign({}, objects.PaymentData.Payment.paymentHeaderRequestDto);
                        paymentDto.paymentHeaderRequestDto.OrderReservationIds = [];
                        paymentDto.paymentDetailResponseDtoList = [];
                        return paymentDto;
                    },

                    GetPaymentHeader: function () {
                        var paymentHeader = Object.assign({}, objects.PaymentData.Payment.paymentHeaderRequestDto);
                        paymentHeader.OrderReservationIds = [];
                        return paymentHeader;
                    },

                    GetAdvanceDepositDto: function () {
                        var advanceDepositDto = Object.assign({}, objects.PaymentData.AdvanceDeposit);
                        advanceDepositDto.paymentAdvanceRequest = Object.assign({}, objects.PaymentData.AdvanceDeposit.paymentAdvanceRequest);
                        advanceDepositDto.paymentAdvanceRequest.Guest = Object.assign({}, objects.PaymentData.AdvanceDeposit.paymentAdvanceRequest.Guest);
                        advanceDepositDto.paymentDetailRequest = [];

                        return advanceDepositDto;
                    },

                    PaymentDetail: {
                        GetCashPaymentDetailDto: function () {

                            var paymentDetailDto = Object.assign({}, objects.PaymentData.paymentTypes.Normal);
                            console.log(paymentDetailDto);
                            return paymentDetailDto;
                        },

                        GetChequePaymentDetailDto: function () {

                            var paymentDetailDto = Object.assign({}, objects.PaymentData.paymentTypes.Normal,
                                objects.PaymentData.paymentTypes.Cheque);
                            return paymentDetailDto;
                        },

                        GetCreditCardPaymentDetailDto: function () {

                            var paymentDetailDto = Object.assign({}, objects.PaymentData.paymentTypes.Normal,
                                objects.PaymentData.paymentTypes.CreditCardPayment);
                            return paymentDetailDto;
                        },

                        GetDutyMealPaymentDetailDto: function () {

                            var paymentDetailDto = Object.assign({}, objects.PaymentData.paymentTypes.Normal,
                                objects.PaymentData.paymentTypes.DutyMeal);
                            return paymentDetailDto;
                        },

                        GetCityLedgerPaymentDetailDto: function () {

                            var paymentDetailDto = Object.assign({}, objects.PaymentData.paymentTypes.Normal,
                                objects.PaymentData.paymentTypes.CityLedger);
                            return paymentDetailDto;
                        },

                        GetAdvancePaymentDetailDto: function () {

                            var paymentDetailDto = Object.assign({}, objects.PaymentData.paymentTypes.Normal,
                                objects.PaymentData.paymentTypes.Advance);
                            return paymentDetailDto;
                        }
                    },

                    GetOrderReservationIdsDto: function () {

                        var orderReservationId = Object.assign({}, objects.PaymentData.OrderReservationIds);
                        return orderReservationId;
                    }
                },

                Order: {
                    GetOrderDto: function () {
                        let orderDto = Object.assign({}, objects.OrderData);
                        orderDto.orderDetailRequestDtoList = [];
                        orderDto.orderHeaderRequestDtoList = [];
                        orderDto.guest = Object.assign({}, objects.AdminData.Guest);
                        return orderDto
                    },

                    GetOrderHeaderDto: function () {
                        let orderHeader = Object.assign({}, objects.OrderData.orderHeaderRequestDtoList[0]);
                        return orderHeader;
                    },

                    GetOrderDetailDto: function () {
                        let orderDetail = Object.assign({}, objects.OrderData.orderDetailRequestDtoList[0]);
                        return orderDetail;
                    }
                },

                Reservations: {

                    GetReservationDto: function () {
                        let reservationDto = Object.assign({}, objects.ReservationData);
                        reservationDto.reservationHeader = Object.assign({}, objects.ReservationData.reservationHeader);
                        reservationDto.reservationDetailList = Object.assign({}, objects.ReservationData.reservationDetailList);
                        reservationDto.reservationDetailList.NoTables = [];
                        reservationDto.guestDetails = Object.assign({}, objects.AdminData.Guest);
                        return reservationDto;
                    },

                    GetReservationHeaderDto: function () {
                        let reservationHeader = Object.assign({}, objects.ReservationData.reservationHeader);
                        return reservationHeader;
                    },

                    GetReservationDetailDto: function () {
                        let reservationDetail = Object.assign({}, objects.ReservationData.reservationDetailList);
                        return reservationDetail;
                    }
                },

                Admin: {
                    GetGuestDto: function () {
                        let guest =  {guest: Object.assign({}, objects.AdminData.Guest)};
                        guest.GuestAddressList = [];
                        return guest;
                    },

                    GetGuestAddressDto: function () {
                        let guestAddress = Object.assign({}, objects.AdminData.Guest.GuestAddressList[0]);
                        return guestAddress;
                    },

                    GetUserLevel: function () {
                        return Object.assign({}, objects.AdminData.UserLevel);
                    },

                    GetUserLevelRule: function () {
                        return Object.assign({}, objects.AdminData.UserLevelRule);
                    },

                    GetUserLevelPrivilege: function () {
                        return Object.assign({}, objects.AdminData.UserLevelPrivilege);
                    }
                },

                MasterData: {
                    GetFoodDto: function () {
                        return Object.assign({}, objects.MasterData.FoodDto);
                    },

                    GetFoodCategoryDto: function () {
                        return Object.assign({}, objects.MasterData.FoodCategoryDto);
                    },
                    GetFoodSubCategoryDto: function () {
                        return Object.assign({}, objects.MasterData.FoodSubCategoryDto);
                    }
                },

                Inventory: {
                    GetItemDto: function () {
                        return Object.assign({}, objects.Inventory.FoodRecipe);
                    },

                    GetRecipeItemDto: function () {
                        return Object.assign({}, objects.Inventory.RecipeItem);
                    }
                }
            };
        }
    });
    cloudPOS.ng.services.service('ObjectFactoryService', [
        cloudPOS.services.ObjectFactoryService
    ]).run(function ($log) {
        $log.info("ObjectFactoryService initialized");
    });
}(cloudPOS.services || {}));
