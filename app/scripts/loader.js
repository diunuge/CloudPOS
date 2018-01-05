(function () {
    require.config({
        paths: {
            'jquery': '../app/bower_components/jquery/dist/jquery.min',
            /*'angular': '../bower_components/angular/angular',*/
            'angular': 'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.11/angular.min',
            'angular-animation': 'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.11/angular-animate.min',
            'angular-aria': 'https://ajax.googleapis.com/ajax/libs/angularjs/1.5.11/angular-aria.min',
            'angular-material': 'https://ajax.googleapis.com/ajax/libs/angular_material/1.1.4/angular-material.min',
            'angular-resource': '../bower_components/angular-resource/angular-resource',
            'angular-route': '../bower_components/angular-route/angular-route',
            'angular-translate': '../bower_components/angular-translate/angular-translate',
            'angular-translate-loader-static-files': '../bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files',
            'angular-mocks': '../bower_components/angular-mocks/angular-mocks',
            'angular-slick': '../bower_components/angular-slick/dist/slick.min',
            'slick': '../bower_components/slick-carousel/slick/slick.min',
            'metro-ui': '../libraries/Metro-UI-CSS-master/build/js/metro.min',
            'select-2': '../app/bower_components/select2/dist/js/select2.min',
            'angularui': '../bower_components/angular-bootstrap/ui-bootstrap',
            'angularuitpls': '../bower_components/angular-bootstrap/ui-bootstrap-tpls',
            'underscore': '../bower_components/underscore/underscore',
            'webstorage': '../bower_components/angular-webstorage/angular-webstorage',
            'require-css': '../bower_components/require-css/css',
            'd3': '../bower_components/d3/d3',
            'nvd3': '../bower_components/nvd3/nv.d3',
            'nvd3ChartDirectives': '../scripts/modules/angularjs-nvd3-directives',
            'styles': '../styles',
            'notificationWidget': '../scripts/modules/notificationWidget',
            'configurations': '../scripts/modules/configurations',
            'angularFileUpload': '../bower_components/angularjs-file-upload/angular-file-upload',
            'angularFileUploadShim': '../bower_components/angularjs-file-upload/angular-file-upload-shim',
            'ngSanitize': '../bower_components/angular-sanitize/angular-sanitize',
            'ckEditor': '../bower_components/ckeditor/ckeditor',
            'ngIdle': '../bower_components/ng-idle/angular-idle.min',
            'LocalStorageModule': '../scripts/modules/localstorage',
            'ngCsv': "../scripts/modules/csv",
            'chosen.jquery.min': "../scripts/modules/chosen.jquery.min",
            'frAngular': '../scripts/modules/KeyboardManager',
            'modified.datepicker': '../scripts/modules/datepicker',
            'Q': '../bower_components/q/q',
            'tmh.dynamicLocale': '../bower_components/angular-dynamic-locale/tmhDynamicLocale.min',
            'webcam-directive':'../bower_components/webcam-directive/dist/1.1.0/webcam.min',
            'angular-wizard': '../scripts/modules/angular-wizard',
            'angular-utils-pagination':'../bower_components/angular-utils-pagination/dirPagination',
            'angularjs-dropdown-multiselect': '../bower_components/angularjs-dropdown-multiselect/src/angularjs-dropdown-multiselect'
        },
        shim: {
            'angular': { deps: ['jquery','chosen.jquery.min'],exports: 'angular' },
            'angular-resource': { deps: ['angular'] },
            'angular-route': { deps: ['angular'] },
            'angular-translate': { deps: ['angular'] },
            'angular-slick': { deps: ['angular']},
            'angular-animation': {deps: ['angular']},
            'angular-aria': {deps: ['angular']},
            'angular-material': {deps: ['angular-animation', 'angular-aria']},
            'slick': { deps: ['jquery']},
            'select-2': { deps: ['jquery', 'metro-ui']},
            'angular-translate-loader-static-files': {deps: ['angular' , 'angular-translate'] },
            'angularui': { deps: ['angular'] },
            'angularuitpls': { deps: ['angular' , 'angularui' ] },
            'angular-mocks': { deps: ['angular'] },
            'ngSanitize': {deps: ['angular'], exports: 'ngSanitize'},
            'webstorage': { deps: ['angular'] },
            'd3': {exports: 'd3'},
            'nvd3': { deps: ['d3']},
            'nvd3ChartDirectives': {deps: ['angular', 'nvd3']},
            'configurations': {deps: ['angular']},
            'notificationWidget': {deps: ['angular', 'jquery'], exports: 'notificationWidget'},
            'angularFileUpload': {deps: ['angular', 'jquery', 'angularFileUploadShim'], exports: 'angularFileUpload'},
            'ckEditor': {deps: ['jquery']},
            'ngIdle': {deps: ['angular']},
            'LocalStorageModule': {deps: ['angular']},
            'ngCsv': {deps: ['angular']},
            'chosen.jquery.min': {deps: ['jquery']},
            'frAngular': {deps: ['angular']},
            'modified.datepicker': {deps: ['angular']},
            'Q': {deps: ['angular']},
            'tmh.dynamicLocale': {deps: ['angular']},
            'webcam-directive': {deps: ['angular']},
            'angular-wizard': {deps: ['angular', 'underscore']},
            'angular-utils-pagination': {deps: ['angular']},
            'angularjs-dropdown-multiselect': {deps: ['angular']},
            'cloudPOS': {
                deps: [
                    'angular',
                    'angular-material',
                    'jquery',
                    'metro-ui',
                    'select-2',
                    'angular-resource',
                    'angular-route',
                    'angular-translate',
                    'angular-slick',
                    'slick',
                    'angular-translate-loader-static-files',
                    'angularui',
                    'angularuitpls',
                    'webstorage',
                    'nvd3ChartDirectives',
                    'notificationWidget',
                    'angularFileUpload',
                    'modified.datepicker',
                    'ngSanitize',
                    'ckEditor',
                    'ngIdle',
                    'configurations',
                    'LocalStorageModule',
                    'angularFileUploadShim',
                    'ngCsv',
                    'chosen.jquery.min',
                    'frAngular',
                    'Q',
                    'tmh.dynamicLocale',
                    'webcam-directive',
                    'angular-wizard',
                    'angular-utils-pagination',
                    'angularjs-dropdown-multiselect'
                ],
                exports: 'cloudPOS'
            }
        },
        packages: [
            {
                name: 'css',
                location: '../bower_components/require-css',
                main: 'css'
            }
        ]
    });

    require(['CloudPOSComponents', 'CloudPOSStyles'], function (componentsInit) {
        componentsInit().then(function(){

            angular.bootstrap(document, ['CloudPOS_Application']);
        });
    });
}());