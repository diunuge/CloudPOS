(function (module) {
    cloudPOS.services = _.extend(module, {
        TransactionHandlerService: function ($http, DataAccessService, CommonMessages, ObjectFactoryService) {

            /// Maintains resources from the IntaCloudPOS server.
            /// All the communication tasks with server is performed using these resources.
            /// Be careful when adding new resources, because it may break the flow of the resource container.
            var cloudPosResources = new (function () {
                /// CloudPOS QA
                /// this.Host = "http://45.35.4.156:3232";

                /// CloudPOS Dev
                this.Host = "http://45.35.4.156:3333";

                /// CloudPOS Local
                /// this.Host = "http://192.168.1.25:5555";

                /// Maintains wcf services that are exposed by the server.
                /// All the other resources have to be accessed through main wcf services.
                this.MasterService = this.Host + "/MasterService.svc";
                this.SecurityService = this.Host + "/SecurityService.svc";
                this.OrderService = this.Host + "/OrderService.svc";
                this.ReservationService = this.Host + "/ReservationService.svc";
                this.AdminService = this.Host + "/AdminService.svc";
                this.PaymentService = this.Host + "/PaymentService.svc";
                this.InventoryService = this.Host + "/InventoryService.svc";

                /// Point out resources exposed by main wcf services

                /// Resources that are exposed through SecurityService
                /// User signIn resource
                this.AuthenticationUrl = this.SecurityService + "/UserSignIn";

                /// Resources that are exposed through MasterService
                /// Master data resources
                this.MasterData = this.MasterService + "/MasterData";

                /// Point out to the food items resource
                this.FoodItems = this.MasterData;
                this.FoodItem = this.FoodItems + "/{0}";

                /// Point out to the food remarks resource
                this.FoodRemarks = this.MasterData + "/FoodRemarks";

                /// Point out to the food categories resource
                this.FoodCategories = this.MasterData + "/FoodCategory";
                this.FoodCategory = this.FoodCategories + "/{0}";

                /// Point out to the food sub-categories resource.
                this.FoodSubCategories = this.MasterData + "/FoodSubCategory";
                this.FoodSubCategory = this.FoodSubCategories + "/{0}";

                /// Point out to the discounts
                this.Discounts = this.MasterService + "/discount";

                /// Point out to the tables resource in the database
                this.Tables = this.MasterData + "/Tables";

                /// Point out to the printers resource
                this.Printers = this.MasterData + "/Printers";

                /// Point out to the meal types
                this.MealTypes = this.MasterData + "/MealType";

                /// Resources of the order service
                /// Point out to the orders resource
                this.Orders = this.OrderService + "/Orders";

                /// Point out to a specific order
                this.Order = this.Orders + "/{0}";

                /// Point out to the order categories resource
                this.OrderCategories = this.Orders + "/categories";

                /// Point out to a specific order category resource
                this.OrderCategory = this.OrderCategories + "/{0}";

                /// Point out to the orders resource belonging to a specific category.
                this.OrdersByCategoryId = this.OrderCategory + "?command={1}";

                /// Point out to the reorder resource
                this.Reorder = this.Order + "/Reorder";

                /// Resources exposed through admin service
                /// Retrieve guests
                this.Guests = this.AdminService + "/guests";

                /// Points to the user privileges
                this.UserPrivileges = this.AdminService + "/UserPrivileges";

                /// Points to the system menus resource
                this.SystemMenus = this.AdminService + "/SystemMenus";

                /// Point out to the user level rules resource
                this.UserLevelRules = this.SystemMenus + "/UserLevelRules";

                /// Point out to the user level privileges resource
                this.UserLevelPrivileges = this.UserPrivileges + "/UserLevelPrivileges";

                /// Point out to a particular guest
                this.Guest = this.AdminService + "/guests/{0}";

                /// Resources exposed through Messages extension of the admin service
                this.Messages = this.AdminService + "/Messages";

                this.Floor = this.AdminService + "/Floor";

                /// Point out to the order cancellation messages resource
                this.OrderCancellationMessages = this.Messages + "/OrderCancellationMessages";

                /// Point out to the taxes resource
                this.Taxes = this.AdminService + "/tax";

                this.TaxById = this.Taxes + "/{0}";

                this.TaxCode = this.AdminService + "/taxCode";

                /// Point out to the service charge resource
                this.ServiceCharge = this.AdminService + "/serviceCharge";

                this.DeliveryZones = this.AdminService + "/deliveryZone";

                /// Point out to the users resource
                this.Users = this.AdminService + "/Users";

                /// Point out to the user levels
                this.UserLevels = this.Users + "/userLevel";

                this.BookingCalendar = this.AdminService + "/calendar";

                /// Bank resource
                this.Bank = this.AdminService + "/bank";

                this.Branches = this.AdminService + "/branch";

                this.Branch = this.Branches + "/{0}";

                this.SystemSettings = this.AdminService + "/systemSetting";

                /// Point out to the timeSlot resource
                this.TimeSlots = this.BookingCalendar + "/slots";

                /// Resources of the reservation service
                /// Point out to the reservation resource
                this.Reservations = this.ReservationService + "/reservations";

                /// Point out to the reservations resource.
                this.Reservation = this.Reservations + "/{0}";

                this.Payments = this.PaymentService + "/payments";

                this.AdvanceDeposit = this.PaymentService + "/deposit";

                this.CityLedger = this.PaymentService + "/cityLedger";

                /// Handles inventory services

                this.Inventory = this.InventoryService + "/Inventory";

                /// Food recipe resource
                this.FoodRecipe = this.Inventory + "/FoodRecipe";

                /// Inventory item types
                this.ItemType = this.Inventory + "/ItemType";

                this.Item = this.Inventory + "/Items";

            })();

            /// Contains allowed http methods to be used with restful api
            var httpMethods = {
                GET: "GET",
                POST: "POST",
                PUT: "PUT",
                DELETE: "DELETE"
            };

            /// Set Configurations
            this.Config = {
                SetSessionKey: function (sessionKey) {
                    DataAccessService.SetAuthenticationTicket(sessionKey);
                }
            };

            /// Object containing methods for communication purposes with the server
            this.Execute = {};

            /// Authenticates the user
            /// Return an object containing SessionKey, UserId, RestaurantId
            this.Execute.AuthenticateUser = function(username, password, restaurantId, callback) {
                try {

                    var authenticationTicket = {username: username, password: password, restaurantId: restaurantId};
                    DataAccessService.AuthenticateUser(cloudPosResources.AuthenticationUrl, authenticationTicket, false, callback);
                }
                catch (ex) {
                    console.error("Authentication failed.");
                }
            };

            /// Handles CRUD operations on FoodItems
            this.Execute.FoodItem = {

                Create: function (foodItem) {

                    DataAccessService.POST(
                        cloudPosResources.FoodItems,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, foodItem, false, undefined, undefined);
                },

                /// Read all the food items from the database
                /// and return an array of food items
                ReadAll: function (callback) {

                    DataAccessService.GET(
                        cloudPosResources.FoodItems,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                },

                /// Retrieve a food item from the database using a foodId
                ReadById: function (callback, foodId) {

                    DataAccessService.GET(
                        cloudPosResources.FoodItem.replace("{0}", foodId),
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                },

                UpdateById: function (callback, foodId, foodItem) {

                    DataAccessService.PUT(
                        cloudPosResources.FoodItem.replace("{0}", foodId),
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, foodItem, false, undefined, undefined);
                },

                DeleteById: function (foodId) {

                    DataAccessService.DELETE(
                        cloudPosResources.FoodItem.replace("{0}", foodId),
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles CRUD operations on resource foodCategory
            this.Execute.FoodCategory = {

                Create: function (foodCategoryItem , callback) {

                    let request = {
                        foodCategoryRequestDto: foodCategoryItem
                    };

                     DataAccessService.POST(
                        cloudPosResources.FoodCategories,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, request, false, undefined, undefined);

                },

                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.FoodCategories,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined)
                },

                ReadById: function (foodCategoryId) {
                    DataAccessService.GET(
                        cloudPosResources.FoodItem.replace("{0}", foodCategoryId),
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                },

                UpdateById: function (foodCategoryId, foodCategory, callback) {
                    var request = {
                        foodCategoryRequestDto: foodCategory
                    };
                    DataAccessService.PUT(
                        cloudPosResources.FoodCategory.replace("{0}", foodCategoryId),
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, request, false, undefined, undefined);
                },

                DeleteById: function (foodCategoryId, callback) {

                    var request = {
                        foodCategoryRequestDto: {}
                    };

                    console.error(request);

                      DataAccessService.DELETE(
                        cloudPosResources.FoodCategory.replace("{0}", foodCategoryId),
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, request, undefined, false, undefined);
                }
            };

            /// Handles CRUD operations on foodSubCategory
            this.Execute.FoodSubCategory = {

                Create: function (foodSubCategoryItem, callback) {

                    var request = {
                        request: foodSubCategoryItem
                    };

                    console.log(request);

                    DataAccessService.POST(
                        cloudPosResources.FoodSubCategories,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, request, false, undefined, undefined);
                },

                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.FoodSubCategories,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                },

                ReadById: function (foodSubCategoryId) {
                         DataAccessService.GET(
                         cloudPosResources.FoodItem.replace("{0}", foodSubCategoryId),
                         function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                },

                UpdateById: function (foodSubCategoryId, foodSubCategoryDto, callback) {

                    var request = {
                        request: foodSubCategoryDto
                    };
                    DataAccessService.PUT(
                        cloudPosResources.FoodSubCategory.replace("{0}", foodSubCategoryId),
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, request, false, undefined, undefined);
                },

                DeleteById: function (foodSubCategoryId) {
                    var request = {
                        foodCategoryRequestDto: {}
                    };

                    DataAccessService.DELETE(
                        cloudPosResources.FoodSubCategory.replace("{0}", foodSubCategoryId),
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        },{}, undefined, false, undefined);
                }
            };

            this.Execute.Printers = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.Printers,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            this.Execute.MealTypes = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.MealTypes,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles CRUD operations on tables resource
            this.Execute.Tables = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.Tables,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles CRUD operations on food remarks resource
            this.Execute.FoodRemarks = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.FoodRemarks,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Orders rest API handlers
            this.Execute.Order = {

                /// Create a new order by using
                Create: function (callback, orderHeaderRequestList, orderDetailsRequestList,
                                  isDelete, isCooked, isLineDiscountGiven) {

                    var Data = {
                        "orderHeaderRequestDtoList": [orderHeaderRequestList],
                        "orderDetailRequestDtoList": orderDetailsRequestList,
                        "isDelete": "false",
                        "isCooked": "false",
                        "isLineDiscountGiven": "false"
                    };

                    console.log((Data));

                    DataAccessService.POST(
                        cloudPosResources.Orders,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, Data, false, undefined, undefined);
                },

                /// Read all the orders
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.Orders,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                },

                /// Reads order categories
                ReadOrderCategories: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.OrderCategories,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                },

                /// Read all the orders belonging to a particular category
                /// from the database
                ReadByOrderCategoryId: function (callback, categoryId) {
                    DataAccessService.POST(
                        cloudPosResources.OrdersByCategoryId.replace("{0}", categoryId).replace("{1}", "getOrders"),
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, {}, false, undefined, undefined);
                },

                ReadById: function (callback, orderId) {
                    DataAccessService.GET(
                        cloudPosResources.Order.replace("{0}", orderId),
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                },

                UpdateById: function (callback, orderId, orderHeaderRequestList, orderDetailsRequestList, guestDetails,
                    isDelete, isCooked, isLineDiscountGiven) {
                    var Data = {
                        "orderHeaderRequestDtoList": [orderHeaderRequestList],
                        "orderDetailRequestDtoList": orderDetailsRequestList,
                        "guestRequestDto": {
                            "IsNewGuest": "false"
                        },
                        "isDelete": "false",
                        "isCooked": "false",
                        "isLineDiscountGiven": "false"
                    };

                    console.log((Data));

                    DataAccessService.PUT(
                        cloudPosResources.Order.replace("{0}", orderId),
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, Data, false, undefined, undefined);
                },

                DeleteById: function () {

                }
            };

            this.Execute.Reorder = {
                ReadAll: function (callback, orderID) {
                    DataAccessService.GET(
                        cloudPosResources.Reorder.replace("{0}", orderID),
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles order details
            this.Execute.OrderDetails = {
                Create: function () {},
                ReadAllByOrderId: function (orderId) {},
                UpdateById: function (orderDetailId) {},
                DeleteById: function (orderDetailId) {}
            };

            /// Handles reservations resource
            this.Execute.Reservations = {

                Create: function (callback, reservation) {

                    DataAccessService.POST(
                        cloudPosResources.Reservations,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, reservation, false, undefined, undefined);
                },
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.Reservations,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                },
                ReadById: function () {},
                UpdateById: function (callback, reservation, reservationID) {
                    DataAccessService.PUT(
                        cloudPosResources.Reservation.replace("{0}", reservationID),
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, reservation, false, undefined, undefined);
                },
                DeleteById: function () {}
            };

            /// Handles admin service resources
            this.Execute.Guests = {

                /// Creates a new guest
                Create: function (callback, guestDto) {
                    DataAccessService.POST(
                        cloudPosResources.Guests,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, guestDto, false, undefined, undefined);
                },

                /// Update a guest resource
                UpdateByID: function (callback, guestDto, guestID) {
                    DataAccessService.PUT(
                        cloudPosResources.Guest.replace("{0}", guestID),
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, guestDto, false, undefined, undefined);
                },

                /// Retrieve all the guests from the database
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.Guests,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles user object
            this.Execute.Users = {
                Create: function () {},
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.Users,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles tax object
            this.Execute.Tax = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.Taxes,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                },

                /// Retrieve taxes from the server
                ReadAll2: function (callback, isCurrentTax) {
                    DataAccessService.GET(
                        cloudPosResources.Taxes + "/" + isCurrentTax,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                },

                Create: function (callback, taxDto) {
                    DataAccessService.POST(
                        cloudPosResources.Taxes,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, taxDto, false, undefined, undefined);
                },

                Update: function (callback, taxHeaderID, taxDto) {
                    DataAccessService.PUT(
                        cloudPosResources.TaxById.replace("{0}", taxHeaderID),
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, taxDto, false, undefined, undefined);
                }
            };

            /// Handles TaxCode resource
            this.Execute.TaxCode = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.TaxCode,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles service charge resource
            this.Execute.ServiceCharge = {
                ReadServiceCharge: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.ServiceCharge,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Delivery zones
            this.Execute.DeliveryZones = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.DeliveryZones,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles User Privileges Resource
            this.Execute.UserPrivileges = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.UserPrivileges,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles System Menus Resource
            this.Execute.SystemMenus = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.SystemMenus,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles user level rules resource
            this.Execute.UserLevelRules = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.UserLevelRules,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles user level privileges resource
            this.Execute.UserLevelPrivileges = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.UserLevelPrivileges,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles payment resource CRUD operations
            this.Execute.Payment = {
                Create: function (callback, paymentDto) {
                    DataAccessService.POST(
                        cloudPosResources.Payments,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, paymentDto, false, undefined, undefined);
                }
            };

            /// Handles advance deposits
            this.Execute.AdvanceDeposits = {
                Create: function (callback, depositDto) {
                    DataAccessService.POST(
                        cloudPosResources.AdvanceDeposit,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, depositDto, false, undefined, undefined);
                },
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.AdvanceDeposit,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles discounts resource CRUD operations
            this.Execute.Discount = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.Discounts,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles timeSlots resource CRUD operations
            this.Execute.TimeSlot = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.TimeSlots,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles bank resource
            this.Execute.Bank = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.Bank,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles branch resource
            this.Execute.Branch = {
                ReadByBankID: function (callback, bankID) {
                    DataAccessService.GET(
                        cloudPosResources.Branch.replace("{0}", bankID),
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Load system settings from the server
            this.Execute.SystemSettings = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.SystemSettings,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles city ledger resource
            this.Execute.CityLedger = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.CityLedger,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles user level resource
            this.Execute.UserLevel = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.UserLevels,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                },

                Create: function (callback, userLevelDto) {
                    DataAccessService.POST(
                        cloudPosResources.UserLevels,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, userLevelDto, false, undefined, undefined);
                }
            };

            /// Handles
            this.Execute.Floor = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.Floor,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Handles inventory resources

            /// FoodRecipe
            this.Execute.FoodRecipe = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.FoodRecipe,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                },

                Create: function (foodRecipe, callback) {
                    DataAccessService.POST(
                        cloudPosResources.FoodRecipe,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, foodRecipe, false, undefined, undefined);
                }
            };

            /// Item Types
            this.Execute.ItemType = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.ItemType,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };

            /// Items
            this.Execute.Items = {
                ReadAll: function (callback) {
                    DataAccessService.GET(
                        cloudPosResources.Item,
                        function (response) {
                            if ("Error" in response) {
                                console.error("");
                                throw "";
                            } else {
                                console.log(CommonMessages.InfoMessages.dataRetrievedSuccessfully);
                                callback(response.data);
                            }
                        }, undefined, false, undefined);
                }
            };
        }
    });
    cloudPOS.ng.services.service('TransactionHandlerService', [
        '$http',
        'DataAccessService',
        'CommonMessages',
        'ObjectFactoryService',
        cloudPOS.services.TransactionHandlerService
    ]).run(function ($log) {
        $log.info("TransactionHandlerService initialized");
    });
}(cloudPOS.services || {}));
