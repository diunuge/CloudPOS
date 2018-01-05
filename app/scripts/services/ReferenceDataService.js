(function (module) {
    cloudPOS.services = _.extend(module, {
        ReferenceDataService: function (TransactionHandlerService, $http) {
            var referenceData = this;

            var callback = (function () {
                var count = 0;
                return function () {
                    count++;

                    if (referenceData.MealTypes !== undefined) {
                        outerCallbackHolder(true);
                        /// console.error(referenceData.MealTypes);
                    }
                    else if (count == 2) {
                        outerCallbackHolder(false);
                    }
                };
            })();
            var outerCallbackHolder = ()=>{};

            referenceData.MealTypes = null;

            referenceData.Init = function (outerCallback) {
                outerCallbackHolder = outerCallback;
                var MealTypes = (function () {
                    $http.get("config/referenceData.json").then(function (response) {
                        MealTypes = response.data.MealTypes;
                        /// console.error(response);
                        if (MealTypesSource !== undefined) {
                            MapData(MealTypesSource, MealTypes);
                            referenceData.MealTypes = MealTypes;
                            callback();
                        }
                    }, function (errorResponse) {
                        MealTypes = undefined;
                        callback();
                    });
                })();

                var MealTypesSource = undefined;
                var MapData = function (source, destination) {
                    /// console.error(source);

                    for (let i1 = 0; i1 < source.length; i1++) {

                        let sVal = source[i1].Name.replace(/[\s]/gi, "").toUpperCase();
                        for (let dKey in destination) {
                            if (destination[dKey] !== undefined && destination[dKey].MealTypeName !== undefined) {
                                let dVal = destination[dKey].MealTypeName.replace(/[\s]/gi, "").toUpperCase();
                                if (sVal === dVal) {
                                    destination[dKey].MealTypeID = source[i1].MealTypeID;
                                }
                            }
                        }
                    }

                    /// console.error(destination);
                };

                TransactionHandlerService.Execute.MealTypes.ReadAll(function (response) {
                    if ("Error" in response) {
                        MealTypesSource = undefined;
                        callback();
                    }
                    else {
                        MealTypesSource = response;
                        if (MealTypes !== undefined) {
                            MapData(response, MealTypes);
                            referenceData.MealTypes = MealTypes;
                            callback();
                        }
                    }
                });
            };
        }
    });
    cloudPOS.ng.services.service('ReferenceDataService', [
        'TransactionHandlerService',
        '$http',
        cloudPOS.services.ReferenceDataService
    ]).run(function ($log) {
        $log.info("ReferenceDataService initialized");
    });
}(cloudPOS.services || {}));
