(function (module) {
    cloudPOS.services = _.extend(module, {
        BillCalculations02: function (filterFilter, commonMessages) {
            var billCalculations = this;

            billCalculations.Summary = {
                LineDiscountAmount: 0,
                BillDiscountAmount: 0,
                NetAmount: 0,
                ServiceChargeAmount: 0,
                NetPrice: 0,
                VatClaimID: 0,
                VatClaimAmount: 0,
                TaxAmount: 0,
                GrandTotal: 0
            };

            var OrderDetailList = [];
            var OrderHeader = {};
            var DiscountList = [];
            var ServiceCharge = {};
            var Taxes = [];

            /// VAT
            var SelectedTax = null;
            billCalculations.IsVatOn = true;

            billCalculations.SetOrder = function (orderHeader, orderDetails) {
                OrderHeader = orderHeader;
                OrderDetailList = orderDetails;
            };

            billCalculations.SetDiscounts = function (discounts) {
                DiscountList = discounts;
            };

            billCalculations.SetTaxes = function (taxes) {
                if (taxes !== undefined && Array.isArray(taxes)) {
                    Taxes = taxes;
                    let vat = taxes.find(function (elem) {
                        return (elem.Name.toUpperCase() == "VAT");
                    });

                    SelectedTax = (vat === undefined) ? null : vat;
                }
                else {
                    console.error("Taxes is undefined");
                }
            };

            billCalculations.SetSelectedTax = function (tax) {
                if (tax !== undefined) {
                    SelectedTax = tax;
                }
                else {
                    console.error("Selected tax is undefined");
                }
            };

            billCalculations.SetServiceCharge = function (serviceCharge) {
                if (serviceCharge !== undefined) {
                    ServiceCharge = serviceCharge;
                }
                else {
                    console.error("ServiceCharge is undefined");
                }
            };

            billCalculations.Execute = function () {
                /*orderDetail.LineDiscountID = 26;
                orderDetail.DiscountID = 4;
                orderDetail.IsLineServiceChargeOn = true;
                orderDetail.IsLineOtherTaxOn = true;
                orderDetail.IsLineVatOn = true;
                orderDetail.IsNet = false;*/

                var hasNewOrderDetails = false;
                var DiscountPrice = 0;
                var LineDiscountPrice = 0;
                var TaxTotal = 0;
                var ServiceChargePrice = 0;
                var TotalPrice = 0;
                var NetPrice = 0;

                OrderDetailList.forEach(function (elem) {
                    Calculate(elem);
                    hasNewOrderDetails = true;
                    NetPrice += elem.NetPrice;
                    DiscountPrice += elem.DiscountPrice;
                    LineDiscountPrice += elem.LineDiscountPrice;
                    TaxTotal += elem.TaxPrice;
                    ServiceChargePrice += elem.ServiceChargePrice;
                    TotalPrice += elem.TotalPrice;
                });

                    OrderHeader.NetPrice = NetPrice;
                    OrderHeader.ServiceChargePrice = ServiceChargePrice;
                    OrderHeader.DiscountPrice = DiscountPrice;
                    OrderHeader.LineDiscountPrice = LineDiscountPrice;
                    OrderHeader.TotalPrice = TotalPrice;
                    OrderHeader.TaxPrice = TaxTotal;

                    console.log("//__________________________________________\\");
                    console.log(OrderDetailList);
                    console.log("Net Total : " + NetPrice);
                    console.log("Service Charge : " + ServiceChargePrice);
                    console.log("Discount Total : " + (DiscountPrice));
                    console.log("Line Discount Total : " + LineDiscountPrice);
                    console.log("Tax Total : " + TaxTotal);
                    console.log("Grand Total : " + TotalPrice);
            };

            var Calculate = function (orderDetail) {
                let netTotal = Number(orderDetail.NetPrice);
                let netAmount = 0;
                let grandTotal = 0;
                let lineDiscountAmount = 0;
                let billDiscountAmount = 0;
                let serviceChargeAmount = 0;
                let serviceChargePercentage = Number(ServiceCharge.Rate);
                let totalOtherTax = 0;
                let taxAmount = 0;
                let vatClaimID = 0;
                let vatClaimAmount = 0;

                let NetPrice = 0;

                /// Boolean variables
                let isNetOn = orderDetail.IsNet;
                let isServiceChargeOn = OrderHeader.IsHeaderServiceChargeOn;
                let isLineOtherTaxOn = orderDetail.IsLineOtherTaxOn;
                let isLineVatOn = orderDetail.IsLineVatOn;
                let lineItemServiceChargeOn = orderDetail.IsLineServiceChargeOn;

                /// console.error(OrderHeader);

                let lineDiscountPercentage = DiscountList.find(function (elem) {
                    return (orderDetail.LineDiscountID == elem.DiscountID);
                });
                lineDiscountPercentage = (lineDiscountPercentage === undefined) ? 0 : lineDiscountPercentage.DisRate;
                let billDiscountPercentage = DiscountList.find(function (elem) {
                    return (orderDetail.DiscountID == elem.DiscountID);
                });
                billDiscountPercentage = (billDiscountPercentage === undefined) ? 0 : billDiscountPercentage.DisRate;

                if (isNetOn == false) {
                    lineDiscountAmount = netTotal * lineDiscountPercentage / 100;
                }

                billDiscountAmount = ((netTotal - lineDiscountAmount) * billDiscountPercentage / 100);
                netAmount = netTotal - billDiscountAmount - lineDiscountAmount;
                let currentAmount = netAmount;

                if (isNetOn == false) {
                    if (isServiceChargeOn) {

                        if (lineItemServiceChargeOn) {

                            serviceChargeAmount = netAmount * serviceChargePercentage / 100;
                        }
                        else {
                            serviceChargeAmount = 0;
                        }
                    }
                    else {
                        serviceChargeAmount = 0;
                    }

                    if (isLineOtherTaxOn) {
                        /// For all taxes except VAT
                        Taxes.forEach(function (taxItem) {
                            if (taxItem.Name.toUpperCase() != "VAT") {
                                totalOtherTax = (currentAmount + serviceChargeAmount) * taxItem.Rate / 100;
                            }
                        });
                    }
                    else {
                        totalOtherTax = 0;
                    }

                    currentAmount = currentAmount + totalOtherTax + serviceChargeAmount;

                    let vatTax = 0;
                    let peoVat = 0;

                    if (SelectedTax != null) {
                        vatTax = (currentAmount * SelectedTax.Rate / 100);
                        peoVat = ((currentAmount - totalOtherTax) * SelectedTax.Rate / 100);
                    }

                    if (billCalculations.IsVatOn) {
                        if (isLineVatOn && isLineOtherTaxOn) {
                            vatClaimID = 0;
                            taxAmount = totalOtherTax + vatTax;
                        }
                        else if (isLineVatOn == true) {
                            vatClaimID = 0;
                            taxAmount = peoVat;
                        }
                        else if (isLineOtherTaxOn == false && isLineVatOn == false) {
                            vatClaimID = 0;
                            taxAmount = 0;
                        }
                        else {
                            vatClaimID = 0;
                            vatClaimAmount = 0;
                            taxAmount = totalOtherTax;
                        }

                    }
                    else if (billDiscountPercentage == 100) {
                        vatClaimID = 0;
                        vatClaimAmount = 0;
                        taxAmount = totalOtherTax;
                    }
                    else {
                        vatClaimID = SelectedTax.TaxID;
                        vatClaimAmount = vatTax;
                        taxAmount = totalOtherTax;
                    }

                    // Grand Total calculations.
                    grandTotal = netAmount + serviceChargeAmount + taxAmount;
                }
                else {
                    NetPrice = netTotal;
                    serviceChargeAmount = 0;
                    taxAmount = 0;
                    grandTotal = netAmount;

                    if (billCalculations.IsVatOn) {
                        vatClaimID = SelectedTax.TaxID;
                    }
                    else {
                        vatClaimID = 0;
                    }
                }

                if (netTotal == 0) {
                    lineDiscountAmount = 0;
                    serviceChargeAmount = 0;
                    taxAmount = 0;
                    grandTotal = 0;
                }

             /*   console.log("____________________________________");
                console.log("Net Total : " + netTotal);
                console.log("Service Charge : " + serviceChargeAmount);
                console.log("Discount Total : " + (billDiscountAmount + lineDiscountAmount));
                console.log("Tax Total : " + (taxAmount));
                console.log("Grand Total : " + grandTotal);*/

                orderDetail.NetPrice = netTotal;
                orderDetail.ServiceChargePrice = serviceChargeAmount;
                orderDetail.DiscountPrice = billDiscountAmount;
                orderDetail.LineDiscountPrice = lineDiscountAmount;
                orderDetail.TaxPrice = taxAmount;
                orderDetail.TotalPrice = grandTotal;
            };
        }
    });

    cloudPOS.ng.services.service('BillCalculations02', [
        'filterFilter',
        'CommonMessages',
        cloudPOS.services.BillCalculations02
    ]).run(function ($log) {
        $log.info("BillCalculations02 module initialized");
    });
}(cloudPOS.services || {}));