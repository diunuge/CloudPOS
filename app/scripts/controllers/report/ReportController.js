(function (module) {
    cloudPOS.controllers = _.extend(module, {
        ReportController: function (scope, location, sessionManager, translate, $rootScope, localStorageService, keyboardManager, $idle, tmhDynamicLocale,
                                                  uiConfigService, $http) {
            var data = {
                "template": {"name": "wastageReport"},
                "data": {
                    "resName": "Hotel Blue Mountain",
                    "date": "2017-06-01",
                    "generatedBy": "Administrator 2"
                }
            };


            $http(
                {
                    method: "post",
                    url: "http://localhost:5488/api/report",
                    dataType: "json",
                    data: data,
                    responseType: 'arraybuffer',
                    headers: {
                        "content-type": "application/json"
                    }
                }
            ).then((responce)=> {
                    var a;
                    var b = new window.Blob([responce.data], {type: "application/pdf"});
                    var fr = new window.FileReader();

                    fr.onload = function (evnt) {
                        a = evnt.target.result;
                        var e = document.createElement("iframe");
                        e.setAttribute("src", "");
                        e.setAttribute("id", "iframepdf");
                        e.setAttribute("style", "width: 100%; height: 100%;");
                        if($("#pdfViewer").length > 0) {
                            $("#pdfViewer")[0].appendChild(e);
                            $("#iframepdf").attr("src", a);
                        }
                    };
                    fr.readAsDataURL(b);
                },
                (responce)=> {

                });
        }
    });
    cloudPOS.ng.application.controller('ReportController', [
        '$scope',
        '$location',
        'SessionManager',
        '$translate',
        '$rootScope',
        'localStorageService',
        'keyboardManager',
        '$idle',
        'tmhDynamicLocale',
        'UIConfigService',
        '$http',
        cloudPOS.controllers.ReportController
    ]).run(function ($log) {
        $log.info("ReportController initialized");
    });
}(cloudPOS.controllers || {}));