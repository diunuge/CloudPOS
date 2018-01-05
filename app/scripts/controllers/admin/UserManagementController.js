(function (module) {
    cloudPOS.controllers = _.extend(module, {
        UserManagementController: function (scope, $rootScope, $http, TransactionHandlerService,
                                            filterFilter, $timeout, $mdSidenav,
                                            $mdUtil, $log, ObjectFactoryService) {
            scope.UserManagementDataModule = (function () {
                var DataModule = {};

                DataModule.SystemUsers = [];

                DataModule.UserLevels = [];

                DataModule.SystemMenus = [];

                DataModule.SystemPrivileges = [];

                DataModule.SelectedUser = {};

                DataModule.UserLevelsDropDown = (function () {
                    var DropDown = {};

                    DropDown.SelectUserLevelByID = function (userLevelID) {
                        var userLevel = DataModule.UserLevels.find(function (elem) {
                            return elem.UserLevelId === userLevelID;
                        });

                        DropDown.SelectedUserLevel = (userLevel === undefined) ? null : userLevel;
                    };

                    DropDown.SelectedUserLevel = null;

                    DropDown.SearchText = "";

                    DropDown.Search = function (searchText) {
                        var filteredList = filterFilter(DataModule.UserLevels, function (elem) {
                            var userLevelName = (elem.UserLevelName !== undefined) ? elem.UserLevelName.toUpperCase() : "";
                            searchText = (searchText !== undefined) ? searchText.toUpperCase() : "";
                            return (userLevelName.indexOf(searchText) != -1);
                        });

                        return (filteredList !== undefined) ? filteredList : [];
                    };

                    return DropDown;
                })();

                DataModule.SelectUser = function (e, user) {
                    DataModule.SelectedUser = $.extend({}, user);
                    DataModule.UserLevelsDropDown.SelectUserLevelByID(user.UserLevel);
                };

                DataModule.LoadUserLevels = function () {
                    TransactionHandlerService.Execute.UserLevel.ReadAll(function (response) {
                        if ("Error" in response) {
                        }
                        else {
                            DataModule.UserLevels = response.UserLevels;
                        }
                    });
                };

                DataModule.LoadSystemUsers = function () {
                    TransactionHandlerService.Execute.Users.ReadAll(function (response) {
                        if ("Error" in response) {
                        }
                        else {
                            DataModule.SystemUsers = response;
                        }
                    });
                };

                DataModule.LoadSystemMenus = function () {
                    TransactionHandlerService.Execute.SystemMenus.ReadAll(function (response) {
                        if ("Error" in response) {
                        }
                        else {
                            DataModule.SystemMenus = response.MenuList;
                        }
                    });
                };

                DataModule.LoadSystemPrivileges = function () {
                    TransactionHandlerService.Execute.UserPrivileges.ReadAll(function (response) {
                        if ("Error" in response) {
                        }
                        else {
                            DataModule.SystemPrivileges = response;
                        }
                    });
                };

                DataModule.UserLevelMgt = (function () {
                    var userLevel = {};

                    userLevel.UserLevelName = "";

                    userLevel.UserLevelsDropDown = (function () {
                        var userLevelDropDown = {};

                        userLevelDropDown.SelectedItem = {UserLevelName: "New User Level"};

                        userLevelDropDown.SearchText = "a";

                        userLevelDropDown.Items = [];

                        userLevelDropDown.SearchingQuery = function (queryText) {
                            return DataModule.UserLevels;
                        };

                        return userLevelDropDown;
                    })();

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

                    userLevel.OpenPanel = buildToggler("UserLevelMgtPanel");

                    userLevel.UserLevelRulesChip = (function () {
                        var userLevelRulesChip = {};

                        userLevelRulesChip.MatchedItems = [];

                        userLevelRulesChip.querySearch = function (query) {
                            var filteredItems = filterFilter(DataModule.SystemMenus, function (elem) {
                                return elem.Description.toUpperCase().indexOf((query.toUpperCase())) != -1;
                            });
                            return filteredItems;
                        };

                        return userLevelRulesChip;
                    })();

                    userLevel.UserLevelPrivilegesChip = (function () {
                        var userLevelPrivilege = {};

                        userLevelPrivilege.MatchedItems = [];

                        userLevelPrivilege.querySearch = function (query) {
                            var filteredItems = filterFilter(DataModule.SystemPrivileges, function (elem) {
                                return elem.Name.toUpperCase().indexOf((query.toUpperCase())) != -1;
                            });
                            return filteredItems;
                        };

                        return userLevelPrivilege;
                    })();

                    userLevel.CreateUserLevel = function () {
                        var userLevel = ObjectFactoryService.Objects.Admin.GetUserLevel();
                        var userlevelPrivilege = null;
                        var userLevelRule = null;
                        var selectedPrivileges = DataModule.UserLevelMgt.UserLevelPrivilegesChip.MatchedItems;
                        var selectedUserLevelRules = DataModule.UserLevelMgt.UserLevelRulesChip.MatchedItems;
                        var userLevelDto = {
                            userLevelRequestDto: {},
                            userLevelPrivilegesList: [],
                            userLevelRulesList: []
                        };

                        console.error(selectedPrivileges);
                        console.error(selectedUserLevelRules);

                        for (let privilege = 0; privilege < selectedPrivileges.length; privilege++)
                        {
                            let userLevelPrivi = ObjectFactoryService.Objects.Admin.GetUserLevelPrivilege();
                            userLevelPrivi.PrivilegeId = selectedPrivileges[privilege].PrivilegeId;
                            userLevelDto.userLevelPrivilegesList.push(userLevelPrivi);
                        }

                        for (let rule = 0; rule < selectedUserLevelRules.length; rule++)
                        {
                            let userLevelRule = ObjectFactoryService.Objects.Admin.GetUserLevelRule();
                            userLevelRule.RuleId = selectedUserLevelRules[rule].MenuId;
                            userLevelRule.IsMenu = selectedUserLevelRules[rule].IsMenu;
                            userLevelDto.userLevelRulesList.push(userLevelRule);
                        }

                        console.log("dfdfdf");

                        TransactionHandlerService.Execute.UserLevel.Create(function (response) {
                            console.error(userLevelDto);
                            console.error(response);
                            if ("Error" in response) {
                            }
                            else {
                                console.error(response);
                            }
                        }, userLevelDto);
                    };

                    return userLevel;
                })();

                /// Init
                (function () {
                    DataModule.LoadSystemUsers();
                    DataModule.LoadUserLevels();
                    DataModule.LoadSystemMenus();
                    DataModule.LoadSystemPrivileges()
                })();

                return DataModule;
            })();
        }
    });
    cloudPOS.ng.application.controller('UserManagementController', [
        '$scope',
        '$rootScope',
        '$http',
        'TransactionHandlerService',
        'filterFilter',
        '$timeout',
        '$mdSidenav',
        '$mdUtil',
        '$log',
        'ObjectFactoryService',
        cloudPOS.controllers.UserManagementController
    ]).run(function ($log) {
        $log.info("UserManagementController initialized");
    });
}(cloudPOS.controllers || {}));
