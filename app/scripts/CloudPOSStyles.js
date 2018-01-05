define(['underscore'], function () {
    var styles = {
        css: [
           /// 'bootstrap.mint',
			///'bootstrap-extt',
           /// 'bootswatch',
           /// 'font-awesome.min',
            //'app',
           // 'nv.d3',
            ///'style',
            ///'theme',
            //'angular-wizard.css',
            ///'chosen.min',
            'structure/CloudPosUiStructureHomePage',
            'structure/CloudPosUiStructure',
            'structure/CloudPosUiStructureReservationPage',
            'structure/CloudPosUiStructurePaymentPanel',
            'structure/CloudPosUiStructureKeyPad',
            'theme/CloudPosUiStructureTheme',
            'theme/CloudPosUiStructureHomePageTheme',
            'theme/CloudPosUiStructurePaymentPanelTheme',
            '../libraries/Metro-UI-CSS-master/build/css/metro.min',
            '../libraries/Metro-UI-CSS-master/build/css/metro-icons',
            '../app/bower_components/select2/dist/css/select2.min',
            'angular-material.min'
        ]
    };

    require(_.reduce(_.keys(styles), function (list, pluginName) {
        return list.concat(_.map(styles[pluginName], function (stylename) {
            return pluginName + '!styles/' + stylename;
        }));
    }, []));
});
