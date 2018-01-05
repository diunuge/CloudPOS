(function (module) {
    cloudPOS.services = _.extend(module, {
        CommonMessages: function () {

            /// This contains all the possible user defined error messages
            /// mostly used for business logic errors
            this.ErrorMessages = {

                /// Used for empty responses
                emptyResponse: "Err0001: Response does not contain any data. :",

                /// Error messages for the bill calculations
                BillCalculation: {
                    NullOrderDetailsArray: "Err0002: BillCalculation have not received an OrderDetails array. :"
                }

            };

            /// This contains messages used for giving information
            /// mostly used for console logs
            this.InfoMessages = {

                /// Used to inform successful data retrieval
                dataRetrievedSuccessfully: "Info0001: Data successfully retrieved from the database. :"

            };

            /// This contains warning messages
            this.WarnMessages = {
                defaultGuestNotFount: "Warn0001: Default guest not found :"
            };
        }
    });

    cloudPOS.ng.services.service('CommonMessages', [
        cloudPOS.services.CommonMessages
    ]).run(function ($log) {
        $log.info("CommonMessages service initialized");
    });
}(cloudPOS.services || {}));

