(function (module) {
    cloudPOS.controllers = _.extend(module, {
        TaxManagementController: function (scope, $rootScope, $http, TransactionHandlerService) {
            scope.TaxManagementDataModule = (function () {
                var DataModule = {};

                DataModule.Description = "";
                DataModule.TaxSum = 0;

                DataModule.Taxes = [];

                DataModule.DataLoader = {
                    LoadTaxes: function (isCurrentTax, callback) {
                        TransactionHandlerService.Execute.Tax.ReadAll2(function (response) {

                            console.error(response);

                            DataModule.Taxes = (Array.isArray(response)) ? response : [];

                            if (callback !== undefined && typeof(callback) === "function") {
                                callback();
                            }
                        }, isCurrentTax);
                    }
                };

                DataModule.TaxesDropDown = (function () {
                    var taxesDropDown = {};

                    taxesDropDown.SelectedItem = null;

                    taxesDropDown.SearchingText = "";

                    taxesDropDown.FilterFunc = function () {
                        return DataModule.Taxes;
                    };

                    taxesDropDown.OnSelectedItemChange = function () {
                        if (taxesDropDown.SelectedItem == null)
                        {
                            DataModule.Description = "";
                            DataModule.TaxDetails.AddedTaxes = [{Name: "", Rate: 0}];
                            DataModule.TaxSum = 0;
                            DataModule.FromDateDatePicker.SelectedDate = new Date();
                            DataModule.ToDateDatePicker.SelectedDate = new Date();
                        }
                        else
                        {
                            let fromDate = taxesDropDown.SelectedItem.TaxHeader.Fromdate;
                            let toDate = taxesDropDown.SelectedItem.TaxHeader.Todate;

                            fromDate = (fromDate != null && fromDate.toString !== undefined) ?
                                Number(fromDate.substr(6, 13)) : null;
                            toDate = (toDate != null && toDate.toString !== undefined) ?
                                Number(toDate.substr(6, 13)) : null;

                            fromDate = new Date(fromDate);
                            toDate = new Date(toDate);


                            DataModule.Description = taxesDropDown.SelectedItem.TaxHeader.Description;
                            DataModule.TaxSum = taxesDropDown.SelectedItem.TaxHeader.TaxSum;

                            DataModule.FromDateDatePicker.SelectedDate = fromDate;
                            DataModule.ToDateDatePicker.SelectedDate = toDate;

                            DataModule.TaxDetails.AddedTaxes = (function () {
                                let taxCodes = taxesDropDown.SelectedItem.TaxCodes;
                                let cloneTaxCodes = [];

                                taxCodes.forEach(function (elem) {
                                    cloneTaxCodes.push($.extend({}, elem));
                                });

                                return cloneTaxCodes;
                            })();
                        }
                    };

                    return taxesDropDown;
                }) ();

                DataModule.FromDateDatePicker = (function () {
                    var DPicker = {};

                    DPicker.MinDate = new Date();

                    DPicker.SelectedDate = new Date();

                    return DPicker;
                })();

                DataModule.ToDateDatePicker = (function () {
                    var DPicker = {};

                    DPicker.MinDate = new Date();

                    DPicker.SelectedDate = new Date();

                    return DPicker;
                })();

                DataModule.TaxDetails = (function () {
                    var TaxDetails = {};
                    var TaxDto = {Name: "", Rate: 0};

                    TaxDetails.AddedTaxes = [$.extend({}, TaxDto)];

                    TaxDetails.AddTax = function (index) {
                        var tax = $.extend({}, TaxDto);
                        if (TaxDetails.AddedTaxes[index].Name !== undefined &&
                            TaxDetails.AddedTaxes[index].Name.length > 0 &&
                            index == TaxDetails.AddedTaxes.length-1) {
                            TaxDetails.AddedTaxes.push(tax);
                        }
                        else {
                            comSingleButtonInfoAlert("Tax Management", "", "Got it!");
                        }
                    };

                    TaxDetails.RemoveTax = function (index) {
                        if (TaxDetails.AddedTaxes.length != 1) {
                            TaxDetails.AddedTaxes.splice(index, 1);
                        }
                    };

                    var watchTaxCodes = function (newVal) {
                        try {
                            if (Array.isArray(newVal)) {
                                DataModule.TaxSum = 0;
                                newVal.forEach(function (elem) {
                                    DataModule.TaxSum += elem.Rate;
                                });
                            }
                        }
                        catch (ex) {

                        }
                    };

                    scope.$watch(()=>TaxDetails.AddedTaxes, watchTaxCodes, true);
                    scope.$watch(()=>TaxDetails.AddedTaxes, watchTaxCodes);

                    return TaxDetails;
                }) ();

                DataModule.CreateTax = function () {

                    if (DataModule.TaxesDropDown.SelectedItem != null)
                    {
                        DataModule.UpdateTax();
                        return false;
                    }

                    if (DataModule.Description == "" ||
                        (DataModule.TaxDetails.AddedTaxes.length == 1 &&
                        DataModule.TaxDetails.AddedTaxes[0].Name == "")) {
                        comSingleButtonInfoAlert("Tax Management",
                            "Please provide all the required information",
                            "Got it!");
                        return false;
                    }

                    var taxDto = {
                        taxHeaderRequestDto: {
                            "Description": DataModule.Description,
                            "Fromdate": "/Date(" + DataModule.FromDateDatePicker.SelectedDate.getTime()  + "+0530)/",
                            "Todate": "/Date(" + DataModule.FromDateDatePicker.SelectedDate.getTime() + "+0530)/"
                        },
                        taxCodeRequestDtosList: DataModule.TaxDetails.AddedTaxes
                    };

                    console.error(taxDto);

                    TransactionHandlerService.Execute.Tax.Create(function (response) {
                        console.error(response);
                    }, taxDto);
                };

                DataModule.UpdateTax = function () {
                    var taxDto = {
                        taxHeaderRequestDto: {
                            "Description": DataModule.Description,
                            "Fromdate": "/Date(" + DataModule.FromDateDatePicker.SelectedDate.getTime()  + "+0530)/",
                            "Todate": "/Date(" + DataModule.ToDateDatePicker.SelectedDate.getTime() + "+0530)/"
                        },
                        taxCodeRequestDtosList: DataModule.TaxDetails.AddedTaxes
                    };

                    console.error(DataModule.TaxesDropDown.SelectedItem.TaxHeader.TaxCode);
                    console.error(taxDto);

                    TransactionHandlerService.Execute.Tax.Update(function (response) {
                        console.error(response);
                        comSingleButttonSuccessAlert("Tax Management",
                            "Tax updated successfully",
                            "Got it!");
                    }, DataModule.TaxesDropDown.SelectedItem.TaxHeader.TaxCode ,taxDto);
                };

                /// Initial tasks
                (function () {
                    DataModule.DataLoader.LoadTaxes(false);
                }) ();

                return DataModule;
            })();
        }
    });
    cloudPOS.ng.application.controller('TaxManagementController', [
        '$scope',
        '$rootScope',
        '$http',
        'TransactionHandlerService',
        cloudPOS.controllers.TaxManagementController
    ]).run(function ($log) {
        $log.info("TaxManagementController initialized");
    });
}(cloudPOS.controllers || {}));
