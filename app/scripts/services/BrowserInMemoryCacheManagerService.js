(function (module) {
    cloudPOS.services = _.extend(module, {
        BrowserInMemoryCacheManagerService: function () {

            /// Cache containing object
            var cacheContainer = {};

            /// Add an object to the cached memory
            var setCache = function (key, object) {

                cacheContainer[key] = object;
            };

            /// Retrieve a cached object
            var getCache = function (key) {

                return cacheContainer[key];
            };

            /// Get length of the cached objects
            var length = function () {

                var len = cacheContainer.length;
            };

            /// Clear InMemory cache object
            var clear = function () {

                cacheContainer = [];
            };

            /// Provides interface to access InMemoryCacheManager
            this.InMemoryCacheHandler = {
                SetItem: setCache,
                GetItem: getCache,
                GetLength: length,
                Clear: clear
            };
        }
    });
    cloudPOS.ng.services.service('BrowserInMemoryCacheManagerService', [
        cloudPOS.services.BrowserInMemoryCacheManagerService
    ]).run(function ($log) {
        $log.info("BrowserInMemoryCacheManagerService initialized");
    });
}(cloudPOS.services || {}));