(function (module) {
    cloudPOS.controllers = _.extend(module, {
        MasterDataFoodMgController: function (scope, TransactionHandler, filterFilter,
                                              ObjectFactoryService, $timeout, $mdSidenav, $mdUtil, $log) {
            scope.MasterDataFoodMgDataModule = (function () {
                var DataModule = {};

                DataModule.Resources = (function () {
                    var resources = {};

                    resources.FilteredItems = [];

                    resources.Foods = [];

                    resources.FoodCategories = [];

                    resources.FoodSubCategories = [];

                    resources.FoodRecipes = [];

                    resources.Items = [];

                    resources.ItemTypes = [];

                    resources.Printers = [];

                    resources.MeasureTypes = [];

                    resources.MealType = [];

                    resources.LoadFoods = function (callback) {
                        TransactionHandler.Execute.FoodItem.ReadAll((response)=> {
                            resources.Foods = response;
                            callback(response);
                        });
                    };

                    resources.LoadFoodSubCategories = function (callback) {
                        TransactionHandler.Execute.FoodSubCategory.ReadAll((response)=> {
                            resources.FoodSubCategories = response;
                            callback(response);
                        });
                    };

                    resources.LoadFoodCategories = function (callback) {
                        TransactionHandler.Execute.FoodCategory.ReadAll((response)=> {
                            resources.FoodCategories = response;
                            callback(response);
                        });
                    };

                    resources.LoadFoodRecipes = function (callback) {
                        TransactionHandler.Execute.FoodRecipe.ReadAll((response)=> {
                            resources.FoodRecipes = response;
                            callback(response);
                        });
                    };

                    resources.LoadItemTypes = function (callback) {
                        TransactionHandler.Execute.ItemType.ReadAll((response)=> {
                            resources.ItemTypes = response;
                            callback(response);
                        });
                    };

                    resources.LoadItems = function (callback) {
                        TransactionHandler.Execute.Items.ReadAll((response)=> {
                            resources.Items = response;
                            callback(response);
                        });
                    };

                    resources.LoadPrinters = function (callback) {
                        TransactionHandler.Execute.Printers.ReadAll((response)=> {
                            resources.Printers = response;
                            console.log(response);
                            callback(response);
                        });
                    };

                    resources.LoadMealTypes = function (callback) {
                        TransactionHandler.Execute.MealTypes.ReadAll((response)=> {
                            resources.MealTypes = response;
                            console.log(response);
                            callback(response);
                        });
                    };

                    return resources;
                })();

                DataModule.Filter = (function () {
                    var filter = {};

                    filter.FilteredItems = [];

                    filter.FilteringWord = "";

                    filter.Filter = function (searchingWord) {

                        if (searchingWord !== undefined && searchingWord !== "") {
                            let items = filterFilter(DataModule.Resources.Foods, function (elem) {
                                return (elem.Name.toUpperCase().indexOf(searchingWord.toUpperCase()) !== -1);
                            });

                            filter.FilteredItems = (items === undefined) ? [] : items;
                        }
                        else {
                            filter.FilteredItems = DataModule.Resources.Foods;
                        }
                    };

                    scope.$watch(()=>filter.FilteringWord, function (newVal) {
                        filter.Filter(newVal);
                    });

                    filter.GetFoodCategoryName = function (categoryId) {
                        let category = DataModule.Resources.FoodCategories.find(function (elem) {
                            return elem.FoodCatId == categoryId;
                        });

                        return (category === undefined) ? "" : category.Description;
                    };

                    filter.GetFoodSubCategoryName = function (subCategoryId) {
                        let subCategory = DataModule.Resources.FoodSubCategories.find(function (elem) {
                            return elem.FoodTypeId == subCategoryId;
                        });

                        return (subCategory === undefined) ? "" : subCategory.Name;
                    };

                    return filter;
                }) ();

                DataModule.RecipeMgt = (function () {
                    var recipeMgt = {};

                    recipeMgt.ItemDto = null;

                    recipeMgt.FoodDto = null;

                    recipeMgt.RecipeItemDtosList = [];

                    recipeMgt.SelectedValues = {
                        Printer: null,
                        FoodType: null,
                        ItemType: null,
                        MeasureType: null
                    };

                    scope.$watch(()=> recipeMgt.SelectedValues.FoodType, function (newVal) {
                        /// console.error(newVal);
                    });

                    recipeMgt.AddRecipe = function () {

                    };

                    recipeMgt.MealType = (function () {
                        var mealType = {};
                        mealType.OnTable = false;
                        mealType.Delivery = false;
                        mealType.Takeout = false;
                        mealType.GetMealType = function () {
                            let MealTypes = scope.ReferenceData.MealTypes;
                            let CurMealType = undefined;
                            let OnTable = (mealType.OnTable) ? MealTypes.Table.MealTypeName : "";
                            let Delivery = (mealType.Delivery) ? MealTypes.Delivery.MealTypeName : "";
                            let Takeout = (mealType.Takeout) ? MealTypes.TakeAway.MealTypeName : "";

                            if (!(mealType.OnTable && mealType.Delivery && mealType.Takeout)) {
                                (function () {
                                    var prevCount = 0;
                                    for (let key in MealTypes) {
                                        let curCount = 0;
                                        if (MealTypes[key] !== undefined) {
                                            (MealTypes[key].MealTypeName.indexOf(OnTable) > -1) ? curCount++ : 0;
                                            (MealTypes[key].MealTypeName.indexOf(Delivery) > -1) ? curCount++ : 0;
                                            (MealTypes[key].MealTypeName.indexOf(Takeout) > -1) ? curCount++ : 0;

                                            if (curCount > prevCount) {
                                                prevCount = curCount;
                                                CurMealType = MealTypes[key];
                                            }
                                        }
                                    }
                                })();
                            }
                            else {
                                CurMealType = MealTypes.ALL;
                            }

                            return CurMealType;
                        };

                        mealType.SetMealType = function (mealtype) {
                            let MealTypes = scope.ReferenceData.MealTypes;
                            let OnTable = MealTypes.Table.MealTypeName;
                            let Delivery = MealTypes.Delivery.MealTypeName;
                            let Takeout = MealTypes.TakeAway.MealTypeName;

                            if (mealtype === undefined || mealtype.MealTypeName === undefined) {
                                return false;
                            }

                            if (MealTypes.ALL.MealTypeName === mealtype.MealTypeName) {
                                mealType.OnTable = true;
                                mealType.Delivery = true;
                                mealType.Takeout = true;
                            }
                            else {
                                mealType.OnTable = (mealtype.MealTypeName.indexOf(OnTable) > -1);
                                mealType.Delivery = (mealtype.MealTypeName.indexOf(Delivery) > -1);
                                mealType.Takeout = (mealtype.MealTypeName.indexOf(Takeout) > -1);
                            }
                        };

                        return mealType;
                    })();

                    scope.$watch(()=>recipeMgt.FoodDto.HasModifier, function (newVal) {
                        if (newVal) {
                            recipeMgt.FoodDto.IsModifier = false;
                        }
                    });

                    scope.$watch(()=>recipeMgt.FoodDto.IsModifier, function (newVal) {
                        if (newVal) {
                            recipeMgt.FoodDto.HasModifier = false;
                        }
                    });

                    recipeMgt.ToggleCharm = function () {
                        var charm = $("div[data-role='charm']#recipeItemAddingCharm");
                        toggleMetroCharm(charm, "right");
                    };

                    /// Select a food item and retrieve related other objects
                    recipeMgt.SelectRecipe = function (e, foodItem) {

                        if (recipeMgt.FoodDto.FoodId === foodItem.FoodId) {
                            recipeMgt.ItemDto = ObjectFactoryService.Objects.Inventory.GetItemDto();
                            recipeMgt.RecipeItemDto = ObjectFactoryService.Objects.Inventory.GetRecipeItemDto();
                            recipeMgt.FoodDto = ObjectFactoryService.Objects.MasterData.GetFoodDto();
                            recipeMgt.MealType.Delivery = false;
                            recipeMgt.MealType.OnTable = false;
                            recipeMgt.MealType.Takeout = false;
                            DataModule.Filter.Filter("a");
                            DataModule.Filter.Filter();
                            return false;
                        }

                        var item = DataModule.Resources.Items.find(function (elem) {
                            return (elem.ItemId == foodItem.ItemId);
                        });
                        var recipeId = DataModule.Resources.FoodRecipes.find(function (elem) {
                            return (elem.FoodId==foodItem.FoodId);
                        });
                        recipeId = (recipeId===undefined) ? 0 : recipeId.FoodRecipeID;

                        if (item === undefined) {
                            return false;
                        }

                        recipeMgt.FoodDto = $.extend({}, foodItem);
                        recipeMgt.ItemDto = $.extend({}, item);

                        recipeMgt.MealType.SetMealType((function () {
                            let mealTypeId = recipeMgt.FoodDto.MealTypeId;
                            let mealTypes = scope.ReferenceData.MealTypes;
                            let response = undefined;
                            for (let key in mealTypes) {
                                if (mealTypes[key].MealTypeID == mealTypeId) {
                                    response = mealTypes[key];
                                    /// console.error(mealTypes[key]);
                                }
                            }

                            return response;
                        })());

                        recipeMgt.SelectedValues.FoodType = (function (foodItem) {
                            let foodType = DataModule.Resources.FoodSubCategories.find(function (elem) {
                                return (foodItem.FoodTypeId === elem.FoodTypeId);
                            });

                            return (foodType === undefined) ? null : foodType;
                        })(foodItem);

                        recipeMgt.SelectedValues.ItemType = (function (item) {
                            let itemType = DataModule.Resources.Items.find(function (elem) {
                                return (item.ItemId === elem.ItemId);
                            });

                            return (itemType === undefined) ? null : itemType;
                        })(item);

                        if (!recipeMgt.ItemDto.IsRawMaterial) {

                            let list = filterFilter(DataModule.Resources.FoodRecipes, function (elem) {
                                return (foodItem.FoodId == elem.FoodId);
                            });

                            list = (list === undefined) ? [] : list;

                            recipeMgt.RecipeItemDtosList = [];
                            list.forEach(function (elem) {
                                recipeMgt.RecipeItemDtosList.push($.extend({}, elem));
                            });
                        }
                    };

                    /// Create a new recipe
                    recipeMgt.CreateRecipe = (function () {
                        var hasInitialized = false;

                        var validation = function () {
                           /* return (recipeMgt.FoodDto.Name.length > 0 && recipeMgt.FoodDto.Price > 0 &&
                                recipeMgt.FoodDto.FoodTypeId > 0 && recipeMgt.FoodDto.ItemId > 0 &&
                                recipeMgt.FoodDto.FoodDpId > 0 && recipeMgt.FoodDto.MeasureTypeId > 0);*/
                             return (recipeMgt.FoodDto.Name.length > 0 &&
                             recipeMgt.FoodDto.Price > 0 &&
                             recipeMgt.SelectedValues.FoodType != null);
                        };

                        return function () {

                            if (recipeMgt.FoodDto.FoodId > 0) {
                                comSingleButtonErrorAlert("Food Recipe", "Update feature is under development.", "Got it!");
                                return false;
                            }

                            if (hasInitialized) {
                                return false;
                            }
                            else {
                                hasInitialized = true;
                            }

                            try {
                                recipeMgt.FoodDto.IsModifier = (recipeMgt.FoodDto.IsModifier) ? 1 : 0;
                                recipeMgt.FoodDto.HasModifier = (recipeMgt.FoodDto.HasModifier) ? 1 : 0;
                                recipeMgt.FoodDto.IsRecipe = (recipeMgt.ItemDto.IsRawMaterial) ? 0 : 1;
                                recipeMgt.FoodDto.IsOpen = (recipeMgt.FoodDto.IsOpen) ? 1 : 0;
                                recipeMgt.FoodDto.Name = recipeMgt.ItemDto.Name;
                                recipeMgt.FoodDto.FoodCatId = recipeMgt.SelectedValues.FoodType.FoodCatId;
                                recipeMgt.FoodDto.IsServiceChargeOn = recipeMgt.FoodDto.ServiceChargeOn;
                                recipeMgt.FoodDto.MealTypeId = (function () {
                                    let mealtype = recipeMgt.MealType.GetMealType();
                                    console.error(mealtype);
                                    return (mealtype === undefined) ? 0 : mealtype.MealTypeID;
                                })();
                                recipeMgt.ItemDto.ItemTypeId = recipeMgt.SelectedValues.ItemType.ItemTypeId;
                                recipeMgt.FoodDto.FoodTypeId = recipeMgt.SelectedValues.FoodType.FoodTypeId;
                            }
                            catch(ex) {
                                hasInitialized = false;
                                comSingleButtonInfoAlert("Food Recipe", "Please fill all the required fields", "Got it!");
                                return false;
                            }

                            var reguest = {
                                itemRequest: recipeMgt.ItemDto,
                                foodRequest: recipeMgt.FoodDto,
                                foodRecipeRequestList: []
                            };

                            if (validation()) {

                                console.error(reguest);

                                TransactionHandler.Execute.FoodRecipe.Create(reguest, (response)=> {
                                    if ("Error" in response) {

                                    }
                                    else if (response.IsSuccessFull) {
                                        comSingleButttonSuccessAlert("Food Recipe", "New Food item created successfully", "Got it!");
                                    }
                                    else {
                                        switch (response.Message.toUpperCase()) {
                                            case "FOOD DUPLICATED":
                                                comSingleButtonInfoAlert("Food Recipe", "Item name already exists. Try another name", "Got it!");
                                                break;
                                            default:
                                        }
                                    }
                                    console.error(response);

                                    hasInitialized = false;
                                });
                            }
                            else {
                                hasInitialized = false;
                                comSingleButtonInfoAlert("Food Recipe", "Please fill all the required fields", "Got it!");
                            }
                        };
                    })();

                    (function () {
                        recipeMgt.ItemDto = ObjectFactoryService.Objects.Inventory.GetItemDto();
                        recipeMgt.RecipeItemDto = ObjectFactoryService.Objects.Inventory.GetRecipeItemDto();
                        recipeMgt.FoodDto = ObjectFactoryService.Objects.MasterData.GetFoodDto();
                    })();

                    return recipeMgt;
                })();

                DataModule.FoodClassification = (function () {
                    var foodClassification = {};

                    foodClassification.OpenCharm = function (e, eventType) {
                        if (eventType === "FoodCategory") {
                            foodClassification.toggleLeft = buildToggler('foodCategoryPanel');
                            foodClassification.toggleLeft();
                        }
                        else if (eventType === "FoodSubCategory") {
                            foodClassification.toggleLeft = buildToggler('foodSubCategoryPanel');
                            foodClassification.toggleLeft();
                        }
                    };

                    function buildToggler(navID) {
                        var debounceFn =  $mdUtil.debounce(function(){
                            $mdSidenav(navID)
                                .toggle()
                                .then(function () {
                                    $log.debug("toggle " + navID + " is done");
                                });
                        },300);
                        return debounceFn;
                    }

                    /// Init
                    (function () {
                        scope.MasterDataMgDataModule.NavigationEvents.add(foodClassification.OpenCharm);
                    })();

                    return foodClassification;
                })();

                /// Initialization
                (function () {
                    var callback = function () {
                        if (loadedResourceCount === 8) {
                            DataModule.Filter.Filter();
                        }
                    };

                    var loadedResourceCount = 0;

                    DataModule.Resources.LoadFoods(function () {
                        loadedResourceCount++;
                        callback();
                    });

                    DataModule.Resources.LoadFoodSubCategories(function (response) {
                        if (response !== undefined && Array.isArray(response) && response.length > 0) {
                            loadedResourceCount++;
                            callback();
                        }
                    });

                    DataModule.Resources.LoadFoodCategories(function (response) {
                        if (response !== undefined && Array.isArray(response) && response.length > 0) {
                            loadedResourceCount++;
                            callback();
                        }
                    });

                    DataModule.Resources.LoadFoodRecipes(function (response) {
                        if (response !== undefined && Array.isArray(response) && response.length > 0) {
                            loadedResourceCount++;
                            callback();
                        }
                    });

                    DataModule.Resources.LoadItems(function (response) {
                        if (response !== undefined && Array.isArray(response) && response.length > 0) {
                            loadedResourceCount++;
                            callback();
                        }
                    });

                    DataModule.Resources.LoadItemTypes(function (response) {
                        if (response !== undefined && Array.isArray(response) && response.length > 0) {
                            loadedResourceCount++;
                            callback();
                        }
                    });

                    DataModule.Resources.LoadPrinters(function (response) {
                        if (response !== undefined && Array.isArray(response) && response.length > 0) {
                            loadedResourceCount++;
                            callback();
                        }
                    });

                    DataModule.Resources.LoadMealTypes(function (response) {
                        if (response !== undefined && Array.isArray(response) && response.length > 0) {
                            loadedResourceCount++;
                            callback();
                        }
                    });
                })();

                return DataModule;
            })();

        }
    });
    cloudPOS.ng.application.controller('MasterDataFoodMgController', [
        '$scope',
        'TransactionHandlerService',
        'filterFilter',
        'ObjectFactoryService',
        '$timeout',
        '$mdSidenav',
        '$mdUtil',
        '$log',
        cloudPOS.controllers.MasterDataFoodMgController
    ]).run(function ($log) {
        $log.info("MasterDataFoodMgController initialized");
    });
}(cloudPOS.controllers || {}));
