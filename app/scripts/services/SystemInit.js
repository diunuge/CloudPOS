(function (module) {
    cloudPOS.services = _.extend(module, {
        SystemInit: function (http) {
            var SystemInit = this;

            /// Handles main resources
            SystemInit.MainResources = (function () {
                var mainResources = {};
                var Callbacks = $.Callbacks();
                var InternalCallbacks = $.Callbacks();

                /// System config object
                mainResources.SystemConfig = null;

                /// System resources object
                mainResources.SystemResources = null;

                /// Add callbacks
                mainResources.AddCallback = function (callback) {

                    if (!Callbacks.disabled()) {
                        Callbacks.add(callback);
                    }
                };

                /// Init
                (function () {
                    var successfullLoadings = 0;

                    /// Loads main configuration files
                    http.get("config/SystemConfig.json").then(function (response) {
                        /// Validate config file
                        console.log("System Configuration Data Has Been Loaded!");
                        console.log(response);
                        mainResources.SystemConfig = response.data;
                        InternalCallbacks.fire();
                    }, function (error) {
                        console.log(error);
                        Callbacks.fire({Error: error});
                        Callbacks.disable();
                    });

                    try {

                        var firingCallback = function () {
                            if (successfullLoadings === 1) {
                                Callbacks.fire({Successful: ""});
                            }
                        };

                        InternalCallbacks.add(function () {
                            /// Loads resources file
                            http.get(mainResources.SystemConfig.SystemConfiguration.ConfigFiles.Resources.Url).then(
                                function (response) {
                                    successfullLoadings++;
                                    console.log(response);
                                    console.log("System Resources File Loaded Successfully");
                                    mainResources.SystemResources = response.data;
                                    firingCallback();
                                }, function (error) {
                                    console.log(error);
                                    Callbacks.fire({Error: error});
                                });
                        });
                    }
                    catch (ex)
                    {
                        Callbacks.fire({Error: ""});
                    }
                })();

                return mainResources;
            })();

            /// Access control handler
            SystemInit.AccessControl = (function () {
                var accessControl = {};
                accessControl.AccessControlData = {
                    SystemMenus: null,
                    Privileges: null
                };
                var Callbacks = $.Callbacks();
                var InternalCallbacks = null;

                accessControl.AddCallback = function (callback) {
                    if (!Callbacks.disabled()) {
                        Callbacks.add(callback);
                    }
                };

                /// Loads access control data when the main resources are ready
                SystemInit.MainResources.AddCallback(function () {
                    try {
                        var callback = function () {
                            if (successfulLoadingCount === 1) {
                                Callbacks.fire();
                                Callbacks.disable();
                            }
                        };
                        var successfulLoadingCount = 0;

                        http.get(SystemInit.MainResources.SystemConfig.SystemConfiguration.ConfigFiles.UserPrivileges.Url).then(
                            function (response) {
                                successfulLoadingCount++;
                                accessControl.AccessControlData.Privileges = response.data.UserPrivileges;
                                accessControl.AccessControlData.SystemMenus = response.data.Menus;
                                console.log("User privileges");
                                console.log(response.data);
                                callback();
                            },
                            function (error) {
                                Callbacks.fire({Error: error});
                                Callbacks.disable();
                            });
                    }
                    catch (ex) {
                        Callbacks.fire({Error: ""});
                        Callbacks.disable();
                        console.log(ex);
                    }
                });

                /// Returns the mapped privileges list
                accessControl.MapUserPrivileges = function (dataList) {
                    var privileges = accessControl.AccessControlData.Privileges;
                    for (let privi in privileges) {
                        for (let item in dataList) {

                            if (dataList[item].Name === undefined) {
                                continue;
                            }

                            let sourceText = dataList[item].Name.replace(/\s/ig, "").toUpperCase();
                            let destinationText = privileges[privi].Name.replace(/\s/ig, "").toUpperCase();
                            if (sourceText === destinationText) {
                                privileges[privi].PanelTag = dataList[item].PanelTag;
                                privileges[privi].PrivilegeId = dataList[item].PrivilegeId;
                                privileges[privi].ProductId = dataList[item].ProductId;
                            }
                        }
                    }

                    return privileges;
                };

                /// Return the mapped system menus list
                accessControl.MapSystemMenus = function (dataList) {
                    var systemMenus = accessControl.AccessControlData.SystemMenus;
                    for (let menu in systemMenus) {
                        for (let item in dataList) {
                            /// console.log(dataList);
                            /// console.log(dataList[item].Text);

                            if (dataList[item].Text === undefined) {
                                continue;
                            }

                            let sourceText = dataList[item].Text.replace(/\s/ig, "").toUpperCase();
                            let destinationText = systemMenus[menu].Text.replace(/\s/ig, "").toUpperCase();
                            if (sourceText === destinationText) {
                                systemMenus[menu].ProductId = dataList[item].ProductId;
                                systemMenus[menu].ParentId = dataList[item].ParentId;
                                systemMenus[menu].IsMenu = dataList[item].IsMenu;
                                systemMenus[menu].MenuLevel = dataList[item].MenuLevel;
                                systemMenus[menu].NavigateUrl = dataList[item].NavigateUrl;
                                systemMenus[menu].PageTask = dataList[item].PageTask;
                                systemMenus[menu].MenuId = dataList[item].MenuId;
                            }
                        }
                    }

                    return systemMenus;
                };

                /// Mapping user level rules
                accessControl.MapUserLevelRules = function (userLevelRules, userLevelID) {
                    var systemMenus = accessControl.AccessControlData.SystemMenus;

                    for (let menu in systemMenus) {
                        let rule = userLevelRules.find(function (elm) {
                            return (systemMenus[menu].MenuId !== undefined &&
                            elm.RuleId === systemMenus[menu].MenuId &&
                            elm.UserLevelId == userLevelID);
                        });

                        if (rule !== undefined && systemMenus[menu] !== undefined) {
                            systemMenus[menu].IsMenu = rule.IsMenu;
                        }
                    }

                    return systemMenus;
                };

                /// Mapping user level privileges
                accessControl.MapUserLevelPrivileges = function (userLevelPrivileges, userLevelID) {
                    var privileges = accessControl.AccessControlData.Privileges;

                    for (let privilege in privileges) {
                        let userLevelPrivilege = userLevelPrivileges.find(function (elem) {
                            return (privileges[privilege].PrivilegeId !== undefined &&
                            elem.PrivilegeId === privileges[privilege].PrivilegeId &&
                            elem.UserLevelId == userLevelID);
                        });

                        if (userLevelPrivilege !== undefined &&
                            privileges[privilege].PrivilegeId !== undefined) {
                            privileges[privilege].HasPrivilege = true;
                        }
                    }

                    return privileges;
                };

                return accessControl;
            })();

            SystemInit.AccessControl.AddCallback(function () {
               console.log("Access control has been configured");
            });
        }
    });
    cloudPOS.ng.services.service('SystemInit', [
        '$http',
        cloudPOS.services.SystemInit
    ]).run(function ($log) {
        $log.info("SystemInit initialized");
    });
}(cloudPOS.services || {}));