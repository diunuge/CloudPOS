(function (module) {
    cloudPOS.services = _.extend(module, {
        SystemSettings: function (TransactionHandlerService, $http) {
            this.POSsettings = (function () {
                var ServiceModule = {};

                var Settings = undefined;

                var OuterCallback = ()=>{};

                ServiceModule.SettingsDto = {};

                /// Load settings from the server
                var LoadSettings = function () {
                    TransactionHandlerService.Execute.SystemSettings.ReadAll(function (response) {

                        if ("Error" in response) {
                            /// Do something
                        }
                        else {
                            Settings = response;
                            Callback();
                        }
                    });
                };

                /// Load system settings dto
                var LoadSettingsDto = function () {
                    $http.get("config/SystemSettings.json").then(function (response) {
                            ServiceModule.SettingsDto = response.data;
                            /// console.error(response.data);
                            Callback();
                        },
                        function (response) {

                        });
                };

                var Callback = function () {
                    if (Settings !== undefined && Array.isArray(Settings)) {
                        MapSettings();
                        OuterCallback();
                    }
                };

                /// Map settings retrieved from the server to the local object
                /// and return the mapped object
                var MapSettings = function () {
                    if (Settings !== undefined && Array.isArray(Settings) &&
                        Settings.length > 0 && ServiceModule.SettingsDto.SystemSettings !== undefined) {
                        for (let key in ServiceModule.SettingsDto.SystemSettings) {
                            for (let index in Settings) {
                                /// console.log(key);
                                if (Settings[index].Description !== undefined && Settings[index].Description != null) {
                                    let description = Settings[index].Description.replace(/[\s]/ig, '');
                                    let localDescription = ServiceModule.SettingsDto.SystemSettings[key].Description.replace(/[\s]/ig, '');

                                    if (description.toUpperCase() === localDescription.toUpperCase()) {

                                        ServiceModule.SettingsDto.SystemSettings[key].Value = (Settings[index].Value);
                                        ServiceModule.SettingsDto.SystemSettings[key].Factor = Settings[index].Factor;

                                        console.log(ServiceModule.SettingsDto.SystemSettings[key]);

                                        /*console.error("________");
                                        console.log("Matched");
                                        console.log(description);
                                        console.log(localDescription);
                                        console.error("________");*/
                                        /// alert("Matched");
                                    }
                                }
                            }
                        }
                    }
                };

                /// Initializes the service
                ServiceModule.Init = function (callback) {
                    OuterCallback = callback;
                    LoadSettings();
                    LoadSettingsDto();
                };

                return ServiceModule;
            })();
        }
    });
    cloudPOS.ng.services.service('SystemSettings', [
        'TransactionHandlerService',
        '$http',
        cloudPOS.services.SystemSettings
    ]).run(function ($log) {
        $log.info("SystemSettings initialized");
    });
}(cloudPOS.services || {}));
