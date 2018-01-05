(function (module) {
    cloudPOS.services = _.extend(module, {
        LoadingScreenService: function () {
            this.GetLoader = function() {
                var rtrnFunc = function() {
                    var _frame = null;
                    var _getLoader = function (loaderType) {
                        var loaderTypes = {default: "images/loaders/defaultLoader.gif", circleLoader: "images/loaders/circleLoader.gif"};
                        var selectedLoader = loaderTypes.default;

                        for (loader in loaderTypes) {
                            if (loader == loaderType) {
                                selectedLoader = loaderTypes[loader];
                                break;
                            }
                        }
                        return selectedLoader;
                    };

                    var _startLoading = function (loaderType, options) {
                        _frame = $(document.createElement("div"));
                        var loader = $(document.createElement("img"));
                        _frame.addClass("loadingScreenMainFrame");
                        loader.addClass("loadingScreenLoader");
                        _frame.attr("style", "display: flex; align-items: center; background-color: rgba(240, 248, 255, 0.66); z-index:1; width: 100%; height: 100%; position: absolute; left: 0px; top: 0px;");
                        loader.attr("style", "width: 8em; margin: auto;");
                        loader.attr("src", _getLoader(loaderType));
                        _frame.append(loader);
                        _toggleBodyScrolability();
                        document.body.appendChild(_frame[0]);

                    };

                    var _stopLoading = function () {
                        if (_frame != null) {
                            window.setTimeout(()=>{document.body.removeChild(_frame[0]);}, 250);
                            _toggleBodyScrolability();
                        }
                    };

                    var _toggleBodyScrolability = function() {
                        var doc = $(document.body);
                        if(doc.css("overflow").toLowerCase() == "hidden") {
                            doc.css("overflow", "auto");
                        } else {
                            doc.css("overflow", "hidden");
                        }
                    };

                    this.StartLoadingScreen = function (loaderType, options) {
                        _startLoading(loaderType, options);
                    };

                    this.StopLoadingScreen = function () {
                        _stopLoading();
                    };
                };
                return new rtrnFunc();
            };
        }
    });
    cloudPOS.ng.services.service('LoadingScreenService', [
        cloudPOS.services.LoadingScreenService
    ]).run(function ($log) {
        $log.info("LoadingScreenService initialized");
    });
}(cloudPOS.services || {}));
