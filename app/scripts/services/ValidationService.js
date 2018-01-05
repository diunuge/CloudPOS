(function (module) {
    cloudPOS.services = _.extend(module, {
        ValidationService: function ($http, LoadingScreenService) {

            /// Validates credit card entries
            this.CreditCardDateValidation = function (issueDate, expireDate) {
                if ((issueDate instanceof Date && expireDate instanceof Date) &&
                    (issueDate != "Invalid Date" && expireDate != "Invalid Date")) {
                    let issueTimeStamp = issueDate.getTime();
                    let expireTimeStamp = expireDate.getTime();

                    if(expireTimeStamp > issueTimeStamp && expireTimeStamp > Date.now()) {
                        return true;
                    }
                }
                else {
                    return false;
                }
            };

            /// Validate username and password and put restrictions on them
            /// such as minimum length
            this.CredentialValidation = function (username, password) {

            };

            /// Validate phone numbers
            this.PhoneNumberValidation = function (number) {
                var NoStr = (number === undefined || number == null) ? 0 : number.toString();
                var response = false;

                switch (NoStr.length) {
                    case 9:
                        if (!isNaN(Number(NoStr))) {
                            response = true;
                        }
                        break;
                    case 10:
                        if (!isNaN(Number(NoStr)) && NoStr[0]=="0") {
                            response = true;
                        }
                        break;
                    case 12:
                        if (NoStr.search(/[+][0-9]{11}/) != -1) {
                            response = true;
                        }
                        break;
                    default:
                }

                return response;
            };

            /// Email validation
            this.EmailValidation = function (email) {
                let regEx = /[\w]*@[\w]*.[\w]*/g;
                return (email.match(regEx) != null);
            };
        }
    });
    cloudPOS.ng.services.service('ValidationService', [
        '$http',
        'LoadingScreenService',
        cloudPOS.services.ValidationService
    ]).run(function ($log) {
        $log.info("ValidationService initialized");
    });
}(cloudPOS.services || {}));
