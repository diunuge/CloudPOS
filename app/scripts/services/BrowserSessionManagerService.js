(function (module) {
    cloudPOS.services = _.extend(module, {
        BrowserSessionManagerService: function () {

            /// Set initial variables that are used for storing data.
            /// vocabulary
            var localSessionHandler = window.sessionStorage;
            var isSessionEnabled = localSessionHandler !== undefined;
            var vocabulary = {sessionKeyName: "CloudPOS_session_key_credential",
                userCredentials: "CloudPOS_userCredentials"};

            /// Add a data item to the session storage.
            var setItem = function (key, valueObject) {

                if(isSessionEnabled) {
                    localSessionHandler.setItem(key, JSON.stringify(valueObject));
                } else {
                    console.warn("SessionStorage is not supporting");
                }
            };

            /// Remove a data item from the session storage.
            var removeItem = function (key) {

                if(isSessionEnabled) {
                    localSessionHandler.removeItem(key);
                } else {
                    console.warn("SessionStorage is not supporting");
                }
            };

            /// Retrieve a data item from the session storage.
            /// <return> an object </return>
            var getItem = function (key) {

                var cachedItem = localSessionHandler.getItem(key);
                if(isSessionEnabled) {

                } else {
                    console.warn("SessionStorage is not supporting");
                    return -1;
                }

                return cachedItem;
            };

            /// Clear sessionStorage.
            var clear = function () {

                if (isSessionEnabled) {
                    localSessionHandler.clear();
                } else {
                    console.warn("SessionStorage is not supporting");
                    return -1;
                }
            };

            /// Provides an interface to access BrowserSessionManagerService
            this.SessionStorageHandler = {
                SetItem: setItem,
                GetItem: getItem,
                Clear: clear,
                RemoveItem: removeItem
            };
        }
    });
    cloudPOS.ng.services.service('BrowserSessionManagerService', [
        cloudPOS.services.BrowserSessionManagerService
    ]).run(function ($log) {
        $log.info("BrowserSessionManagerService initialized");
    });
}(cloudPOS.services || {}));