(function (module) {
    cloudPOS.directives = _.extend(module, {
        InputValidation: function (ValidationService) {
            return {
                restrict: 'A',
                scope: {
                    validationType: "=",
                    ngModel: "="
                },
                link: function (scope, elem, attrs) {
                    var Validations = ("validationType" in attrs) ? attrs["validationType"] : null;
                    var ValidationTypesList = {
                        PhoneNumberValidation: "phoneNumberValidation",
                        EmailValidation: "emailValidation"
                    };

                    var SpecifiedValidationsList = Validations.split(" ");

                    var validate = function () {
                        for (let indx in SpecifiedValidationsList) {
                            switch (SpecifiedValidationsList[indx]) {
                                case ValidationTypesList.PhoneNumberValidation:
                                    if (!ValidationService.PhoneNumberValidation(scope.ngModel)) {
                                        $(elem).removeClass("success");
                                        $(elem).addClass("error");
                                    }
                                    else {
                                        $(elem).removeClass("error");
                                        $(elem).addClass("success");
                                    }

                                    scope.$watch(()=>scope.ngModel, function (newVal, oldVal) {
                                        if (isNaN(Number(newVal)))
                                        {
                                            newVal = (isNaN(Number(oldVal))) ? 0 : oldVal;
                                        }
                                        else if (newVal != null && newVal.toString !== undefined &&
                                            newVal.toString().length > 12) {

                                            scope.ngModel = (oldVal != null && oldVal.toString !== undefined &&
                                            oldVal.toString().length < 13) ? oldVal : 0;
                                        }


                                    });

                                    break;
                                case ValidationTypesList.EmailValidation:
                                    if (!ValidationService.EmailValidation(scope.ngModel) && scope.ngModel !== "") {
                                        $(elem).removeClass("success");
                                        $(elem).addClass("error");
                                    }
                                    else if (scope.ngModel !== "") {
                                        $(elem).removeClass("error");
                                        $(elem).addClass("success");
                                    }
                                    else {
                                        $(elem).removeClass("error");
                                        $(elem).removeClass("success");
                                    }
                                    break;
                                default:
                            }
                        }
                    };

                    scope.$watch("ngModel", function (newVal) {
                        validate();
                    });
                }
            };
        }
    });
}(cloudPOS.directives || {}));

cloudPOS.ng.application.directive("inputValidation", [
    'ValidationService',
    cloudPOS.directives.InputValidation
]).run(function ($log) {
    $log.info("InputValidation initialized");
});