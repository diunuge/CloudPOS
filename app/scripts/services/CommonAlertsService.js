(function (module) {
    cloudPOS.services = _.extend(module, {
        CommonAlertsService: function () {

            /// Set alerts types to the global window object
            this.ConfigureCommonAlerts = function () {
                window.comAlertError = ErrorAlert;
                window.comAlertWarning = WarningAlert;
                window.comAlertSuccess = SuccessAlert;
                window.comAlertInfo = InfoAlert;
                window.comSingleButttonSuccessAlert = SingleButtonSuccess;
                window.comSingleButtonErrorAlert = SingleButtonError;
                window.comSingleButtonInfoAlert = SingleButtonInfo;
            };

            var Dialog = function (title, message, buttonOne, buttonTwo, callback, alertType, isWaitTimeOn) {
                let options = {};
                options.type = alertType;
                options.width = "50%";
                if (isWaitTimeOn) {
                    options.hide = 20000;
                }

                $.Dialog({
                    title: title,
                    content: message,
                    actions: [
                        {
                            title: buttonOne,
                            onclick: function(el){
                                $(el).data('dialog').close();
                                callback(buttonOne);
                            }
                        },
                        {
                            title: buttonTwo,
                            onclick: function(el){
                                $(el).data('dialog').close();
                                callback(buttonTwo);
                            }
                        }
                    ],
                    options: options
                });
            };

            var SingleButtonDialog = function (title, message, buttonOne, alertType) {
                $.Dialog({
                    title: title,
                    content: message,
                    actions: [
                        {
                            title: buttonOne,
                            onclick: function(el){
                                $(el).data('dialog').close();
                            }
                        }
                    ],
                    options: {
                        type: alertType,
                        hide: 20000,
                        width: "50%"
                    }
                });
            };

            /// Show an error message
            var ErrorAlert = function (title, message, buttonOne, buttonTwo, callback) {
                Dialog(title, message, buttonOne, buttonTwo, callback, "alert");
            };

            /// Show an warning message
            var WarningAlert = function (title, message, buttonOne, buttonTwo, callback) {
                Dialog(title, message, buttonOne, buttonTwo, callback, "warning");
            };

            /// Show an info message
            var InfoAlert = function (title, message, buttonOne, buttonTwo, callback) {
                Dialog(title, message, buttonOne, buttonTwo, callback, "info");
            };

            /// Show an success message
            var SuccessAlert = function (title, message, buttonOne, buttonTwo, callback) {
                Dialog(title, message, buttonOne, buttonTwo, callback, "success");
            };

            var SingleButtonSuccess = function (title, message, buttonOne) {
                SingleButtonDialog(title, message, buttonOne, "success");
            };

            var SingleButtonError = function (title, message, buttonOne) {
                SingleButtonDialog(title, message, buttonOne, "alert");
            };

            var SingleButtonInfo = function (title, message, buttonOne) {
                SingleButtonDialog(title, message, buttonOne, "info");
            };
        }
    });

    cloudPOS.ng.services.service('CommonAlertsService', [
        cloudPOS.services.CommonAlertsService
    ]).run(function ($log) {
        $log.info("CommonAlertsService service initialized");
    });
}(cloudPOS.services || {}));

