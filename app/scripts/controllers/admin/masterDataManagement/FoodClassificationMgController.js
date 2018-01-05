(function (module) {
    cloudPOS.controllers = _.extend(module, {
        FoodClassificationMgController: function (scope, TransactionHandler, filterFilter,
                                              ObjectFactoryService, $timeout, $mdSidenav, $log) {
            scope.FoodClassificationMgDataModule = (function () {
                var DataModule = {};

                DataModule.FoodCategory = (function () {
                    var foodCategory = {};

                    foodCategory.FoodCategoryDto = ObjectFactoryService.Objects.MasterData.GetFoodCategoryDto();

                    foodCategory.FoodCategoryDropDown = {
                        SelectedItem: null,
                        SearchingText: "",
                        OnSelectedItemChange: function () {
                            if (foodCategory.FoodCategoryDropDown.SelectedItem===undefined) {
                                foodCategory.FoodCategoryDto = ObjectFactoryService.Objects.MasterData.GetFoodCategoryDto();
                            }
                            else {
                                foodCategory.FoodCategoryDto = $.extend({}, foodCategory.FoodCategoryDropDown.SelectedItem);
                            }
                        },
                        SearchingQuery: function () {
                            let searchingText = foodCategory.FoodCategoryDropDown.SearchingText.toUpperCase();
                            let foodCategories = scope.MasterDataFoodMgDataModule.Resources.FoodCategories;

                            let filteredItems = filterFilter(foodCategories, function (elem) {
                                console.log(elem.Description.search(searchingText));
                                console.log(searchingText);
                                return (elem.Description.toUpperCase().search(searchingText) != -1);
                            });

                            return (filteredItems === undefined) ? [] : filteredItems;
                        }
                    };

                    var validation = function () {
                      return (foodCategory.FoodCategoryDto.Description.length > 0 &&
                      foodCategory.FoodCategoryDto.IndexID !== undefined &&
                      foodCategory.FoodCategoryDto.IndexID > -1);
                    };

                    foodCategory.Action = function () {
                        console.error(foodCategory.FoodCategoryDto);
                        if (foodCategory.FoodCategoryDto.FoodCatId > -1 && validation()) {
                            foodCategory.UpdateFoodCategory();
                        }
                        else if (foodCategory.FoodCategoryDto.FoodCatId == -1 && validation()) {
                            foodCategory.CreateCategory();
                        }else {
                            comSingleButtonErrorAlert("Food Category Creation",
                                "Please provide all required values",
                                "Got it!");
                        }
                    };

                    foodCategory.CreateCategory = function () {
                        TransactionHandler.Execute.FoodCategory.Create(foodCategory.FoodCategoryDto, function (response) {
                            if (response.IsSuccessFull) {
                                comSingleButttonSuccessAlert("Food Category Creation",
                                    "Food Category created successfully",
                                    "Got it!");
                                scope.MasterDataFoodMgDataModule.Resources.LoadFoodCategories(()=>{});
                            }
                        });
                    };

                    foodCategory.UpdateFoodCategory = function () {
                        TransactionHandler.Execute.FoodCategory.UpdateById(foodCategory.FoodCategoryDto.FoodCatId,
                            foodCategory.FoodCategoryDto, function (response) {
                                if (response.IsSuccessFull) {
                                    scope.MasterDataFoodMgDataModule.Resources.LoadFoodCategories(()=>{});
                                    comSingleButttonSuccessAlert("Food Category Update", "Food Category updated successfully", "Got it!");
                                }
                                else if (!response.IsSuccessFull) {

                                }
                                else if ("Error" in response) {
                                    comSingleButtonErrorAlert("Service Error",
                                        "There is some problem in the server. Task cannot be performed", "Got it!");
                                }
                            });
                    };

                    foodCategory.Delete = function () {
                        comAlertInfo("Food Category Deletion", "Do you want to delete food category " +
                        foodCategory.FoodCategoryDto.Description + "?", "Yes", "No", function (buttonName) {
                            if (buttonName.toUpperCase() == "YES") {
                                deleteCategory();
                            }
                            else {
                                return false;
                            }
                        });

                        function deleteCategory () {
                            TransactionHandler.Execute.FoodCategory.DeleteById(foodCategory.FoodCategoryDto.FoodCatId,
                                function (response) {
                                    if (response.IsSuccessFull) {
                                        scope.MasterDataFoodMgDataModule.Resources.LoadFoodCategories(()=> {
                                        });
                                        comSingleButttonSuccessAlert("Food Category Deletion", "Food Category deleted successfully", "Got it!");
                                    }
                                    else if (!response.IsSuccessFull) {

                                    }
                                    else if ("Error" in response) {
                                        comSingleButtonErrorAlert("Service Error",
                                            "There is some problem in the server. Task cannot be performed", "Got it!");
                                    }
                                });
                        }
                    };

                    return foodCategory;
                })();

                DataModule.FoodSubCategory = (function () {
                    var foodSubCategory = {};

                    foodSubCategory.FoodSubCategoryDto = ObjectFactoryService.Objects.MasterData.GetFoodSubCategoryDto();

                    foodSubCategory.FoodSubCategoryDropDown = {
                        SelectedItem: null,
                        SearchingText: "",
                        OnSelectedItemChange: function () {
                            if (foodSubCategory.FoodSubCategoryDropDown.SelectedItem === undefined ||
                                foodSubCategory.FoodSubCategoryDropDown.SelectedItem == null) {
                                foodSubCategory.FoodSubCategoryDto = ObjectFactoryService.Objects.MasterData.GetFoodSubCategoryDto();
                                foodSubCategory.MealTypeDropDown.SelectedItem = null;
                                foodSubCategory.FoodCategoryDropDown.SelectedItem = null;
                            }
                            else {
                                foodSubCategory.FoodSubCategoryDto = $.extend({}, foodSubCategory.FoodSubCategoryDropDown.SelectedItem);
                                foodSubCategory.MealTypeDropDown.SelectedItem = (function () {

                                    let item = scope.MasterDataFoodMgDataModule.Resources.MealTypes.find(function (elem) {
                                        return (elem.MealTypeID === foodSubCategory.FoodSubCategoryDto.MealTypeId);
                                    });

                                    /// console.error(foodSubCategory.FoodSubCategoryDto);
                                    /// console.error(item);

                                    return (item === undefined) ? null : item;
                                })();

                                foodSubCategory.FoodCategoryDropDown.SelectedItem = (function () {
                                    let item = scope.MasterDataFoodMgDataModule.Resources.FoodCategories.find(function (elem) {
                                        return (elem.FoodCatId === foodSubCategory.FoodSubCategoryDto.FoodCatId);
                                    });

                                    /// console.error(foodSubCategory.FoodSubCategoryDto);
                                    /// console.error(item);

                                    return (item === undefined) ? null : item;
                                })();
                            }
                        },
                        SearchingQuery: function () {
                            let searchingText = foodSubCategory.FoodSubCategoryDropDown.SearchingText.toUpperCase();
                            let foodSubCategories = scope.MasterDataFoodMgDataModule.Resources.FoodSubCategories;

                            console.error(foodSubCategories);

                            let filteredItems = filterFilter(foodSubCategories, function (elem) {
                                /// console.log(elem.Name.search(searchingText));
                                /// console.log(searchingText);
                                return (elem.Name.toUpperCase().search(searchingText) != -1);
                            });

                            return (filteredItems === undefined) ? [] : filteredItems;
                        }
                    };

                    foodSubCategory.MealTypeDropDown = {
                        SelectedItem: null,
                        SearchingText: "",
                        OnSelectedItemChange: function () {
                            if (foodSubCategory.MealTypeDropDown.SelectedItem === undefined ||
                                foodSubCategory.MealTypeDropDown.SelectedItem == null) {
                                foodSubCategory.FoodSubCategoryDto.MealTypeId = 0;
                            }
                            else {
                                foodSubCategory.FoodSubCategoryDto.MealTypeId = foodSubCategory.MealTypeDropDown.SelectedItem.MealTypeID;
                            }
                        },
                        SearchingQuery: function () {
                            let searchingText = foodSubCategory.MealTypeDropDown.SearchingText.toUpperCase();
                            let foodSubCategories = scope.MasterDataFoodMgDataModule.Resources.MealTypes;

                            console.error(foodSubCategories);

                            let filteredItems = filterFilter(foodSubCategories, function (elem) {
                                console.log(elem.Name.search(searchingText));
                                console.log(searchingText);
                                return (elem.Name.toUpperCase().search(searchingText) != -1);
                            });

                            return (filteredItems === undefined) ? [] : filteredItems;
                        }
                    };

                    foodSubCategory.FoodCategoryDropDown = {
                        SelectedItem: null,
                        SearchingText: "",
                        OnSelectedItemChange: function () {
                            if (foodSubCategory.FoodCategoryDropDown.SelectedItem == null) {
                                foodSubCategory.FoodSubCategoryDto.FoodCatId = 0;
                            }
                            else {
                                foodSubCategory.FoodSubCategoryDto.FoodCatId = foodSubCategory.FoodCategoryDropDown.SelectedItem.FoodCatId;
                            }
                        },
                        SearchingQuery: function () {
                            let searchingText = foodSubCategory.FoodCategoryDropDown.SearchingText.toUpperCase();
                            let foodCategories = scope.MasterDataFoodMgDataModule.Resources.FoodCategories;

                            console.error(foodCategories);

                            let filteredItems = filterFilter(foodCategories, function (elem) {
                                console.log(elem.Description.search(searchingText));
                                console.log(searchingText);
                                return (elem.Description.toUpperCase().search(searchingText) != -1);
                            });

                            return (filteredItems === undefined) ? [] : filteredItems;
                        }
                    };

                    var validation = function () {
                        return (foodSubCategory.FoodSubCategoryDto.MealTypeId > -1 &&
                        foodSubCategory.FoodSubCategoryDto.FoodCatId > -1 &&
                        foodSubCategory.FoodSubCategoryDto.IndexId > -1 &&
                        foodSubCategory.FoodSubCategoryDto.Name.length > 0);
                    };

                    foodSubCategory.Action = function () {
                        console.error(foodSubCategory.FoodSubCategoryDto);
                        if (foodSubCategory.FoodSubCategoryDto.FoodTypeId > -1 && validation()) {
                            foodSubCategory.UpdateSubCategory();
                        }
                        else if (foodSubCategory.FoodSubCategoryDto.FoodTypeId == -1 && validation()) {
                            foodSubCategory.FoodSubCategoryDto.FoodTypeId = 0;
                            foodSubCategory.CreateSubCategory();
                        }
                        else {
                            comSingleButtonErrorAlert("Food Sub Category Creation",
                                "Please provide all required values",
                                "Got it!");
                        }
                    };

                    foodSubCategory.CreateSubCategory = function () {
                        TransactionHandler.Execute.FoodSubCategory.Create(foodSubCategory.FoodSubCategoryDto, function (response) {
                            if (response.IsSuccessFull) {
                                comSingleButttonSuccessAlert("Food Sub Category Creation",
                                    "Food Sub Category created successfully",
                                    "Got it!");
                                scope.MasterDataFoodMgDataModule.Resources.LoadFoodSubCategories(()=>{});
                            }
                            else if (!response.IsSuccessFull) {
                                comSingleButtonErrorAlert("Food Sub Category Creation",
                                     "Service Error",
                                    "Got it!");
                            }
                            else if ("Error" in response) {
                                comSingleButtonErrorAlert("Food Sub Category Creation",
                                    response.Message,
                                    "Got it!");
                            }
                        });
                    };

                    foodSubCategory.UpdateSubCategory = function () {
                        TransactionHandler.Execute.FoodSubCategory.UpdateById(foodSubCategory.FoodSubCategoryDto.FoodTypeId,
                            foodSubCategory.FoodSubCategoryDto, function (response) {
                                if (response.IsSuccessFull) {
                                    scope.MasterDataFoodMgDataModule.Resources.LoadFoodSubCategories(()=>{});
                                    comSingleButttonSuccessAlert("Food Sub Category Update", "Food Sub Category updated successfully", "Got it!");
                                }
                                else if (!response.IsSuccessFull) {

                                }
                                else if ("Error" in response) {
                                    comSingleButtonErrorAlert("Service Error",
                                        "There is some problem in the server. Task cannot be performed", "Got it!");
                                }
                            });
                    };

                    foodSubCategory.Delete = function () {
                        comAlertInfo("Food Type Deletion", "Do you want to delete food type " +
                        foodSubCategory.FoodSubCategoryDto.Name + "?", "Yes", "No", function (buttonName) {
                            if (buttonName.toUpperCase() == "YES") {
                                deleteSubCategory();
                            }
                            else {
                                return false;
                            }
                        });

                        function deleteSubCategory () {
                            TransactionHandler.Execute.FoodSubCategory.DeleteById(foodSubCategory.FoodSubCategoryDto.FoodTypeId,
                                function (response) {
                                    if (response.IsSuccessFull) {
                                        scope.MasterDataFoodMgDataModule.Resources.LoadFoodCategories(()=> {
                                        });
                                        comSingleButttonSuccessAlert("Food Type Deletion", "Food Type deleted successfully", "Got it!");
                                    }
                                    else if (!response.IsSuccessFull) {

                                    }
                                    else if ("Error" in response) {
                                        comSingleButtonErrorAlert("Service Error",
                                            "There is some problem in the server. Task cannot be performed", "Got it!");
                                    }
                                });
                        }
                    };

                    return foodSubCategory;
                })();

                return DataModule;
            })();

            scope.close = function () {
                $mdSidenav('left').close()
                    .then(function () {
                        alert("");
                        $log.debug("close LEFT is done");
                    });
            }
        }
    });
    cloudPOS.ng.application.controller('FoodClassificationMgController', [
        '$scope',
        'TransactionHandlerService',
        'filterFilter',
        'ObjectFactoryService',
        '$timeout',
        '$mdSidenav',
        '$log',
        cloudPOS.controllers.FoodClassificationMgController
    ]).run(function ($log) {
        $log.info("FoodClassificationMgController initialized");
    });
}(cloudPOS.controllers || {}));
