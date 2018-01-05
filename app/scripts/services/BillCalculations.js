(function (module) {
    cloudPOS.services = _.extend(module, {
        BillCalculations: function (filterFilter, commonMessages) {

            /// Holds orderDetails for bill calculations
            var OrderDetails = [];

            /// Holds an orderHeader for bill calculations
            var OrderHeader = null;

            /// Discount rates which are given to the whole order
            var DiscountRates = [];

            /// Line discount rates which are given to the individual food items.
            var LineDiscountRates = [];

            /// Contains all the taxes.
            var Taxes = [];

            /// Holds predefined service charges on the database
            var ServiceChargeRates = [];

            /// These variables contain various tax and service charge rates.
            var ServiceChargeRate = 0.0;
            var TDL = 0.0;
            var NBT = 0.0;
            var VAT = 0.0;

            /// Set taxes and service charge rates.
            this.SetServiceCharge = function (ServiceCharge) {
                ServiceCharge.Rate = Number(ServiceCharge.Rate);
                ServiceCharge.ScId = Number(ServiceCharge.ScId);
                ServiceChargeRate = ServiceCharge;
            };

            /// Set taxes
            this.SetTaxes = function (taxes) {
                if (!Array.isArray(taxes)) {
                    return false;
                }

                Taxes = taxes;
            };

            /// Set orderDetails variable to the supplied array reference.
            this.SetOrder = function (orderHeader, orderDetails) {

                OrderHeader = (orderHeader !== undefined) ? orderHeader : null;
                OrderDetails = (Array.isArray(orderDetails)) ? orderDetails : [];

                if (!Array.isArray(orderDetails)) {
                    throw {Error: "ERR: Required parameter is an array"};
                }

                if (orderDetails === undefined) {
                    throw {Error: "ERR: Undefined parameter"};
                }
            };

            /// Set discount rates.
            this.SetDiscountRates = function (discountRates, lineDiscountRates) {

                DiscountRates = (Array.isArray(discountRates)) ? discountRates : [];
                LineDiscountRates = (Array.isArray(lineDiscountRates) ? lineDiscountRates : []);
            };

            /// This object contains a summary report
            /// about the order such as net total, tax total, grand total, discount total.
            this.SummaryDetails = {
                NetTotal: 0.0,
                ServiceCharge: 0.0,
                TaxTotal: 0.0,
                DiscountTotal: 0.0,
                GrandTotal: 0.0
            };

            /// Calculates taxes, service charges, and discounts for the OrderDetails array.
            this.Execute = (function (outerThis) {


                var init = function () {


                    if (!Array.isArray(OrderDetails) || OrderHeader === undefined) {
                        throw {Error: "ERR: Undefined Values"};
                    }

                    outerThis.SummaryDetails.NetTotal = 0;
                    outerThis.SummaryDetails.ServiceCharge = 0;
                    outerThis.SummaryDetails.TaxTotal = 0;
                    outerThis.SummaryDetails.DiscountTotal = 0;
                    outerThis.SummaryDetails.GrandTotal = 0;

                    for (let i = 0; i < OrderDetails.length; i++) {

                        /// if (OrderDetails[i].OrderDetailID == 0) {
                            Calculate(OrderDetails[i]);
                            outerThis.SummaryDetails.NetTotal += OrderDetails[i].NetPrice;
                            outerThis.SummaryDetails.ServiceCharge += OrderDetails[i].ServiceChargePrice;
                            outerThis.SummaryDetails.TaxTotal += OrderDetails[i].TaxPrice;
                            outerThis.SummaryDetails.DiscountTotal += OrderDetails[i].DiscountPrice;
                            outerThis.SummaryDetails.GrandTotal += OrderDetails[i].TotalPrice;
                        /// }
                    }

                    console.log("OrderDetails");
                    console.log(OrderDetails);
                };

                return init;
            })(this);

            /// Calculate order header discounts

            /// Calculate taxes of a order detail
            var Calculate = function (orderDetail) {

                let lineDiscountRate = LineDiscountRates.find(function (elem) {
                    return (elem.DiscountID == orderDetail.LineDiscountID);
                });

                let fullDiscountRate = LineDiscountRates.find(function (elem) {
                    return (elem.DiscountID == orderDetail.DiscountID);
                });

                lineDiscountRate = (lineDiscountRate === undefined) ? 0 : lineDiscountRate.DisRate;

                fullDiscountRate = (fullDiscountRate === undefined) ? 0 : fullDiscountRate.DisRate;

                let netPrice = Number(orderDetail.NetPrice);
                let netTotal = Number(OrderHeader.NetPrice);
                let grandTotal = netPrice;
                let discountedNetPrice = 0;
                let taxTotal = 0;
                let VAT = 0;

                /// Calculate full discount
                discountedNetPrice = netPrice - (((netTotal / 100) * fullDiscountRate) / OrderDetails.length);

                orderDetail.DiscountPrice += (netPrice - discountedNetPrice);

                console.log();

                /// Store line discount values in the orderDetail
                orderDetail.LineDiscountPrice = ((discountedNetPrice / 100) * lineDiscountRate);

                /// Calculate line discount
                /// Discounted total
                discountedNetPrice = discountedNetPrice - ((discountedNetPrice / 100) * lineDiscountRate);

                /// Assign discounted net to the grand total
                grandTotal = discountedNetPrice;

                /// Calculate service charge
                grandTotal += (grandTotal / 100) * ServiceChargeRate.Rate;
                orderDetail.ServiceChargePrice = (discountedNetPrice / 100) * ServiceChargeRate.Rate;
                orderDetail.ServiceChargeID = ServiceChargeRate.ScId;

                console.log(grandTotal);

                console.log(Taxes);

                Taxes.forEach(function (tax) {
                    if (!(tax.Name.toUpperCase() == "VAT")) {
                        taxTotal +=  (grandTotal / 100) * Number(tax.Rate);
                    }
                });

                VAT = Taxes.find(function (tax){
                    return (tax.Name == "VAT");
                });

                VAT = (VAT === undefined) ? 0 : VAT.Rate;

                taxTotal += (grandTotal / 100) * VAT;

                console.log( "tax total : " + taxTotal);

                grandTotal += taxTotal;

                if (orderDetail.IsNet == false) {
                    /// alert("Net Price Diabled");
                    orderDetail.TaxPrice = taxTotal;
                    orderDetail.TotalPrice = grandTotal;
                }
                else {
                    /// alert("Net Price Enabled");
                    orderDetail.LineDiscountPrice = 0;
                    orderDetail.LineDiscountID = 0;
                    orderDetail.TaxPrice = 0;
                    orderDetail.TotalPrice = netPrice;
                }

                console.log(orderDetail);
            };
        }
    });

    cloudPOS.ng.services.service('BillCalculations', [
        'filterFilter',
        'CommonMessages',
        cloudPOS.services.BillCalculations
    ]).run(function ($log) {
        $log.info("BillCalculations module initialized");
    });
}(cloudPOS.services || {}));