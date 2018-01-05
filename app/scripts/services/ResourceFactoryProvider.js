(function (module) {
    cloudPOS.services = _.extend(module, {
        ResourceFactoryProvider: function () {
            var baseUrl = "" , apiVer = "/test/api/v1", tenantIdentifier = "";
            this.setBaseUrl = function (url) {
                baseUrl = url;
                console.log(baseUrl);
            };

            this.setTenantIdenetifier = function (tenant) {
                tenantIdentifier = tenant;
            };
            this.$get = ['$resource', '$rootScope', function (resource, $rootScope) {
                var defineResource = function (url, paramDefaults, actions) {
                    var tempUrl = baseUrl;
                    $rootScope.hostUrl = tempUrl;
                    $rootScope.tenantIdentifier = tenantIdentifier;
                    return resource(baseUrl + url, paramDefaults, actions);
                };
                return {
                    userResource: defineResource(apiVer + "/users/:userId", {userId: '@userId'}, {
                        getAllUsers: {method: 'GET', params: {fields: "id,firstname,lastname,username,officeName"}, isArray: true},
                        getUser: {method: 'GET', params: {}}
                    }),
                    roleResource: defineResource(apiVer + "/roles/:roleId", {roleId: '@roleId', command: '@command'}, {
                        getAllRoles: {method: 'GET', params: {}, isArray: true},
                        deleteRoles: {method: 'DELETE'},
                        disableRoles: {method: 'POST'},
                        enableRoles: {method: 'POST'}
                    }),
                    rolePermissionResource: defineResource(apiVer + "/roles/:roleId/permissions", {roleId: '@roleId'}, {
                        get: {method: 'GET', params: {}},
                        update: {method: 'PUT'}
                    }),
                    permissionResource: defineResource(apiVer + "/permissions", {}, {
                        get: {method: 'GET', params: {}, isArray: true},
                        update: {method: 'PUT'}
                    }),
                    testResource: defineResource(apiVer + "/json.php", {}, {
                        get: {method: 'GET', params: {}, isArray: false},
                        update: {method: 'PUT'}
                    })
                };
            }];
        }
    });
    cloudPOS.ng.services.config(function ($provide) {
        $provide.provider('ResourceFactory', cloudPOS.services.ResourceFactoryProvider);
    }).run(function ($log) {
        $log.info("ResourceFactory initialized");
    });
}(cloudPOS.services || {}));
