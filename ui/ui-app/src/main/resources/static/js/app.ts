import * as angular from "angular";
import * as lazyLoad from "./kylo-utils/LazyLoadUtil";
import * as _ from "underscore";
const SVGMorpheus = require("../bower_components/svg-morpheus/compile/minified/svg-morpheus");
//declare const SVGMorpheus: any;
declare const d3:any;
import * as moment from "moment";
import "angularMaterial";
import "angularAnimate";
import "angularAria";
import "angularMessages";
import "@uirouter/angularjs";
import "angular-material-expansion-panel";
import "angular-material-icons";
import "angular-material-data-table";
import "angular-sanitize";
import "angular-ui-grid";
import "dirPagination";
import "ng-fx";
import "ng-text-truncate";
import "pascalprecht.translate";
import "angular-translate-loader-static-files";
import "angular-translate-storage-local";
import "angular-translate-handler-log";
import "angular-translate-storage-cookie";
import "angular-cookies";
import "tmh.dynamicLocale";
import "ocLazyLoad";
import "kylo-common";
import "kylo-services";
import "kylo-side-nav";
'use strict';

class App {
module: ng.IModule;
constructor() {
    (<any>window).SVGMorpheus = SVGMorpheus;
    //d3 is needed here as nv.d3 isnt correctly getting it via its internal require call
    (<any>window).d3 = d3;
    if(!(<any>window).moment){
        (<any>window).moment = moment;
    }
    var env = {};
    // Import variables if present (from env.js)
    if(window && (<any>window).__env){
        Object.assign(env, (<any>window).__env);
    }

    this.module = angular.module("kylo", ['ui.router', 'ui.router.upgrade', 'oc.lazyLoad', 'ngMaterial','material.components.expansionPanels','md.data.table','ngMdIcons',
                                          'angularUtils.directives.dirPagination','kylo.common','kylo.services','kylo.side-nav','ngFx','ngAnimate','ngSanitize','ngTextTruncate', 'ui.grid',
                                          'ui.grid.resizeColumns',
                                          'ui.grid.autoResize',
                                          'ui.grid.moveColumns',
                                          'ui.grid.pagination', 'ui.grid.selection', 'ngMessages',
                                          'pascalprecht.translate', 'tmh.dynamicLocale', 'ngCookies']);
    this.module.constant('LOCALES', {
           'locales': {
               'en_US': 'English'
            },
            'preferredLocale': 'en_US'
        });
        this.module.constant('__env', env)
        this.module.config(['$mdAriaProvider','$mdThemingProvider','$mdIconProvider','$urlServiceProvider',
                            'ngMdIconServiceProvider','$qProvider', '$translateProvider', 
                            'tmhDynamicLocaleProvider','__env',this.configFn.bind(this)]);
         this.module.run(['$ocLazyLoad', '$translate', this.runFn.bind(this)]); 
    }

    configFn($mdAriaProvider: any,$mdThemingProvider: any, $mdIconProvider: any, $urlService: any,
             ngMdIconServiceProvider: any,$qProvider: any, $translateProvider: any, tmhDynamicLocaleProvider: any, __env:any){
       //disable the aria-label warnings in the console
        $mdAriaProvider.disableWarnings();

        $qProvider.errorOnUnhandledRejections(false);
        $translateProvider.useStaticFilesLoader({
            prefix: 'locales/',  // path to translations files
            suffix: '.json'      // suffix, currently- extension of the translations
        });

        $translateProvider
            .registerAvailableLanguageKeys(["en"], {
                "en_*": "en",
                "*": "en"
            })
            .determinePreferredLanguage()
            .fallbackLanguage('en')
            .useLocalStorage();  // saves selected language to localStorage

        tmhDynamicLocaleProvider.localeLocationPattern('../bower_components/angular-i18n/angular-locale_{{locale}}.js');


        //custom td themes

        var tdOrange = $mdThemingProvider.extendPalette('orange', {
            "50": "#FCE3DB",
            "100": "#FCE3DB",
            "200": "#FAC7B7",
            "300": "#FAC7B7",
            "400": "#F7AA93",
            "500": "#F7AA93",
            "600": "#F58E6F",
            "700": "#F58E6F",
            "800": "#F3753F",
            "900": "#F3753F",
            "contrastDefaultColor": "light",
            "contrastDarkColors": [
                "50",
                "100",
                "200",
                "A100"
            ],
            "contrastLightColors": [
                "300",
                "400",
                "500",
                "600",
                "700",
                "800",
                "900",
                "A200",
                "A400",
                "A700"
            ]
        });



        $mdThemingProvider.definePalette("td-orange", tdOrange);

        var tdSlate = $mdThemingProvider.extendPalette('grey', {
            "50": "#D8DBDC",
            "100": "#D8DBDC",
            "200": "#B0B6B9",
            "300": "#B0B6B9",
            "400": "#899296",
            "500": "#899296",
            "600": "#616D73",
            "700": "#616D73",
            "800": "#394851",
            "900": "#394851",
            "contrastDefaultColor": "dark",
            "contrastDarkColors": [
                "50",
                "100",
                "200",
                "300",
                "400",
                "500",
                "800",
                "900",
                "A100",
                "A200",
                "A400",
                "A700"
            ],
            "contrastLightColors": [
                "600",
                "700"

            ]
        });

        $mdThemingProvider.definePalette("td-slate", tdSlate);

        var tdTeal = $mdThemingProvider.extendPalette('teal',{
            "50": "#CFF0EF",
            "100": "#CFF0EF",
            "200": "#9FE1E0",
            "300": "#9FE1E0",
            "400": "#6FD2D0",
            "500": "#6FD2D0",
            "600": "#3FC3C1",
            "700": "#3FC3C1",
            "800": "#00B2B1",
            "900": "#00B2B1",
            "contrastDefaultColor": "dark",
            "contrastDarkColors": [
                "50",
                "100",
                "200",
                "300",
                "400",
                "500",
                "600",
                "700",
                "A100",
                "A200",
                "A400",
                "A700"
            ],
            "contrastLightColors": [
                "800",
                "900"
            ]
        });
        $mdThemingProvider.definePalette("td-teal", tdTeal);

        var tdYellow = $mdThemingProvider.extendPalette('yellow',{
            "50": "#FFF4DF",
            "100": "#FFF4DF",
            "200": "#FEE9C0",
            "300": "#FEE9C0",
            "400": "#FEDEA0",
            "500": "#FEDEA0",
            "600": "#FDD381",
            "700": "#FDD381",
            "800": "#FEC64D",
            "900": "#FEC64D",
            "contrastDefaultColor": "light",
            "contrastDarkColors": [
                "50",
                "100",
                "200",
                "A100"
            ],
            "contrastLightColors": [
                "300",
                "400",
                "500",
                "600",
                "700",
                "800",
                "900",
                "A200",
                "A400",
                "A700"
            ]
        });

        $mdThemingProvider.definePalette("td-yellow", tdYellow)




        var tdBlue = $mdThemingProvider.extendPalette("blue", {
            "50": "#D1EAF4",
            "100": "#D1EAF4",
            "200": "#A4D6E8",
            "300": "#A4D6E8",
            "400": "#76C1DD",
            "500": "#76C1DD",
            "600": "#49ADD1",
            "700": "#49ADD1",
            "800": "#0098C9",
            "900": "#0098C9",
            "contrastDefaultColor": "light",
            "contrastDarkColors": [
                "50",
                "100",
                "200",
                "A100"
            ],
            "contrastLightColors": [
                "300",
                "400",
                "500",
                "600",
                "700",
                "800",
                "900",
                "A200",
                "A400",
                "A700"]
        });

        $mdThemingProvider.definePalette("td-blue", tdBlue);





        //read in any theme info from the __env
        if(__env.themes) {
            var themes = __env.themes;
            var definitions = themes.definePalette;
            if(definitions && definitions.length >0){
                // define the new palettes
                var newPalettes = {};
                _.each(definitions,function(palette:any) {
                    if(palette.name && palette.name != '' && !_.isEmpty(palette.details)) {
                        if (palette.extend && palette.extend != "") {
                            var p1 = $mdThemingProvider.extendPalette(palette.extend, palette.details);
                            $mdThemingProvider.definePalette(palette.name, p1);
                            newPalettes[palette.name] = p1;
                        }
                        else {
                            $mdThemingProvider.definePalette(palette.name, palette.details);
                        }
                    }
                    else {
                        console.log("Unable to regsiter definition.  It needs to contain a valid 'name' and 'details'")
                    }
                });
            }
           //register the palette types
            if(themes.primaryPalette && !_.isEmpty(themes.primaryPalette)){
                var dark = themes.primaryPalette.dark || false;
                var hues = themes.primaryPalette.details || null;
                $mdThemingProvider.theme('kylo').primaryPalette(themes.primaryPalette.name,hues).dark(dark);
                console.log('Applied primaryPalette',themes.primaryPalette.name)
            }
            if(themes.accentPalette && !_.isEmpty(themes.accentPalette)){
                var dark = themes.accentPalette.dark || false;
                var hues = themes.accentPalette.details || null;
                $mdThemingProvider.theme('kylo').accentPalette(themes.accentPalette.name,hues).dark(dark)
                console.log('Applied accentPalette',themes.accentPalette.name)
            }
            if(themes.warnPalette && !_.isEmpty(themes.warnPalette)){
                var dark = themes.warnPalette.dark || false;
                var hues = themes.warnPalette.details || null;
                $mdThemingProvider.theme('kylo').warnPalette(themes.warnPalette.name,hues).dark(dark)
                console.log('Applied warnPalette',themes.warnPalette.name)
            }
            if(themes.backgroundPalette && !_.isEmpty(themes.backgroundPalette)){
                var dark = themes.backgroundPalette.dark || false;
                var hues = themes.backgroundPalette.details || null;
                $mdThemingProvider.theme('kylo').backgroundPalette(themes.backgroundPalette.name,hues).dark(dark)
                console.log('Applied backgroundPalette',themes.backgroundPalette.name)
            }
        }
        else {
            $mdThemingProvider.theme('kylo')
                .primaryPalette('td-slate', {'default':'700','hue-1':'100', 'hue-2':'900'})
                .accentPalette('td-orange',{'default':'800','hue-1':'200', 'hue-2':'900'})
                .warnPalette('deep-orange',{'default':'800','hue-1':'200', 'hue-2':'900'})
        }

        $mdThemingProvider.setDefaultTheme('kylo');

     /*   $primary-app: mat-palette($td-slate, 700, 100, 900);
        $accent-app:  mat-palette($td-teal, 800, 200, 900);
        $warn-app:    mat-palette($mat-deep-orange, 800, 200, 900);
        $app-theme: mat-light-theme($primary-app, $accent-app, $warn-app);
*/


        // Tell UI-Router to wait to synchronize the URL (until all bootstrapping is complete)e
        $urlService.deferIntercept();

        // Register custom font
        // "Font Awesome" icons by Fonticons, Inc (https://fontawesome.com/) are licensed under CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)
        // "Font Mfizz" icons by Fizzed, Inc (http://fizzed.com/) are licensed under MIT (https://github.com/fizzed/font-mfizz/blob/master/src/LICENSE.txt)
        ngMdIconServiceProvider
            .addShape('file-import', '<path d="M6,2C4.89,2 4,2.9 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M13,3.5L18.5,9H13M10.05,11.22L12.88,14.05L15,11.93V19H7.93L10.05,16.88L7.22,14.05" />')
            .addViewBox('file-import', '0 0 24 24')
        // https://fontawesome.com/icons/database?style=solid
            .addShape('fa-database', '<path d="M448 73.143v45.714C448 159.143 347.667 192 224 192S0 159.143 0 118.857V73.143C0 32.857 100.333 0 224 0s224 32.857 224 73.143zM448 176v102.857C448 319.143 347.667 352 224 352S0 319.143 0 278.857V176c48.125 33.143 136.208 48.572 224 48.572S399.874 209.143 448 176zm0 160v102.857C448 479.143 347.667 512 224 512S0 479.143 0 438.857V336c48.125 33.143 136.208 48.572 224 48.572S399.874 369.143 448 336z"/>')
            .addViewBox('fa-database', '0 0 448 512')
            // https://fontawesome.com/icons/file?style=regular
            .addShape('fa-file-r', '<path d="M369.9 97.9L286 14C277 5 264.8-.1 252.1-.1H48C21.5 0 0 21.5 0 48v416c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48V131.9c0-12.7-5.1-25-14.1-34zM332.1 128H256V51.9l76.1 76.1zM48 464V48h160v104c0 13.3 10.7 24 24 24h104v288H48z"/>')
            .addViewBox('fa-file-r', '0 0 384 512')
            // https://fontawesome.com/icons/file?style=solid
            .addShape('fa-file', '<path d="M224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zm160-14.1v6.1H256V0h6.1c6.4 0 12.5 2.5 17 7l97.9 98c4.5 4.5 7 10.6 7 16.9z"/>')
            .addViewBox('fa-file', '0 0 384 512')
            // https://fontawesome.com/icons/folder?style=solid
            .addShape('fa-folder', '<path d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z"/>')
            .addViewBox('fa-folder', '0 0 512 512')

            // https://fontawesome.com/icons/hashtag?style=solid
            .addShape('fa-hashtag', '<path d="M440.667 182.109l7.143-40c1.313-7.355-4.342-14.109-11.813-14.109h-74.81l14.623-81.891C377.123 38.754 371.468 32 363.997 32h-40.632a12 12 0 0 0-11.813 9.891L296.175 128H197.54l14.623-81.891C213.477 38.754 207.822 32 200.35 32h-40.632a12 12 0 0 0-11.813 9.891L132.528 128H53.432a12 12 0 0 0-11.813 9.891l-7.143 40C33.163 185.246 38.818 192 46.289 192h74.81L98.242 320H19.146a12 12 0 0 0-11.813 9.891l-7.143 40C-1.123 377.246 4.532 384 12.003 384h74.81L72.19 465.891C70.877 473.246 76.532 480 84.003 480h40.632a12 12 0 0 0 11.813-9.891L151.826 384h98.634l-14.623 81.891C234.523 473.246 240.178 480 247.65 480h40.632a12 12 0 0 0 11.813-9.891L315.472 384h79.096a12 12 0 0 0 11.813-9.891l7.143-40c1.313-7.355-4.342-14.109-11.813-14.109h-74.81l22.857-128h79.096a12 12 0 0 0 11.813-9.891zM261.889 320h-98.634l22.857-128h98.634l-22.857 128z"/>')
            .addViewBox('fa-hashtag', '0 0 448 512')
            // https://icons8.com/icon/17905/google
            .addShape("google", '<path d="M 12.546875 10.238281 L 12.546875 14.058594 L 17.988281 14.058594 C 17.277344 16.375 15.34375 18.03125 12.546875 18.03125 C 9.214844 18.03125 6.511719 15.332031 6.511719 12 C 6.511719 8.667969 9.214844 5.96875 12.546875 5.96875 C 14.042969 5.96875 15.410156 6.515625 16.464844 7.421875 L 19.28125 4.605469 C 17.503906 2.988281 15.140625 2 12.546875 2 C 7.019531 2 2.542969 6.476563 2.542969 12 C 2.542969 17.523438 7.019531 22 12.546875 22 C 20.941406 22 22.792969 14.148438 21.972656 10.253906 Z "/>')
            .addViewBox("google", "0 0 24 24")
            // http://fizzed.com/oss/font-mfizz/icon-hadoop
            .addShape("hadoop", '<path d="M50.656,4.5625a0.64216,0.64216,0,0,0,-0.156,0.0313c-1.1586,0.28399-2.1144,0.54392-2.9688,0.875a0.64216,0.64216,0,0,0,-0.781,-0.5313c-1.2212,0.29418-2.0711,0.558-2.7188,1.1562-0.64767,0.59825-0.97632,1.4244-1.3438,2.625a0.64216,0.64216,0,0,0,0.6875,0.8125c-0.378,0.8438-0.717,1.7668-1.062,2.9688a0.64216,0.64216,0,0,0,1.188,0.469c1.973-3.967,3.3-5.2051,7.438-7.1565a0.64216,0.64216,0,0,0,-0.28125,-1.25zm13.532,0.8125c-3.5544-0.22379-7.2626,0.77072-11.594,2.5938-4.1104,1.7302-6.1884,4.1948-8.625,7.4375-1.4537,0.11512-2.7411,0.51963-4.3125,1.9062-1.141,1.0071-2.1896,2.0271-3.2188,3.0938-7.9155,1.2764-13.065,2.886-18.375,7.5938-2.1545,1.9102-3.7044,4.0454-4.9375,6.4062-1.1304,1.2491-2.2068,2.4396-3.5,2.9375-0.18817,0.07235-0.30277,0.08982-0.40625,0.125-0.00424-0.0105-0.026688-0.01972-0.03125-0.03125,0.50762-0.54488,0.85138-1.168,1-1.8438,0.1013-0.46056,0.08953-0.91766,0.125-1.375,0.15871,0.24126,0.33747,0.52033,0.59375,0.84375a0.64216,0.64216,0,0,0,1.125,-0.28125c0.16685-0.74624,0.32865-1.684,0.21875-2.625-0.0876-0.75013-0.48869-1.4565-1.0938-2,0.20288-0.53214,0.41275-1.0531,0.625-1.6562a0.64216,0.64216,0,0,0,-0.719,-0.845c-0.72366,0.12575-1.6011,0.53987-2.5938,1.1562-0.99265,0.61638-2.0617,1.4201-2.9375,2.375-0.87577,0.95489-1.5757,2.073-1.7812,3.2812-0.18767,1.1034,0.21525,2.2584,1.125,3.2812,0.016475,0.01852,0.014374,0.04409,0.03125,0.0625,0.25612,1.0385,0.44149,1.8225,0.8125,2.5938,0.53394,1.1103,1.4839,1.8183,2.5,2.0938,0.69368,0.18807,1.4097,0.14049,2.125,0-0.35305,2.0835-0.44821,4.3418-0.1875,7.375,0.06877,0.80012,0.19585,1.5903,0.34375,2.375-0.372,1.0078-0.74871,2.0117-1.125,3.0312-0.98877,0.97851-1.9799,1.9587-2.9688,2.9375-0.54043,0.53539-0.92728,0.8279-1.1875,1.3438-0.26022,0.51585-0.22998,1.0623-0.09375,1.875,0.32857,1.9614,1.2482,4.0249,2.9688,5.75,0.90572,0.90802,2.2899,1.9661,3.8125,2.6875,1.1224,0.53181,2.34,0.87343,3.5312,0.75-0.16519,0.49762-0.30694,0.97698-0.53125,1.4688-0.47693,1.0458-0.56906,2.0134-0.3125,2.8125,0.25656,0.79911,0.84807,1.3813,1.5312,1.8125,1.3664,0.86241,3.2054,1.2327,4.6562,1.625,1.2175,0.3293,3.3494,0.93908,5.375,1.0625,1.0128,0.06171,2.0119,0.01985,2.875-0.3125,0.86306-0.33235,1.6055-1.0311,1.875-2.0312,0.37448-1.39,0.41873-2.2904,0.3125-3.5625,0.71369-1.5837,0.90393-1.8192,1.5312-2.75,0.45822-0.67961,0.72342-1.2109,0.8125-1.8125s0.0013-1.1697-0.09375-1.9688c-0.0087-0.07346-0.02215-0.1717-0.03125-0.25,1.6966,0.20776,3.3709,0.25564,5.0312,0.1875-0.12997,0.06714-0.20643,0.11691-0.34375,0.1875-0.83282,0.42813-1.3444,1.132-1.5,1.9062-0.15564,0.77425-0.02648,1.5969,0.21875,2.375,0.49046,1.5562,1.4701,3.0558,2.0625,3.9688,1.2454,1.9192,2.417,3.6124,3.9688,4.5625,1.5518,0.95011,3.5008,1.0126,5.7188-0.1875,0.77917-0.42176,1.2446-0.91731,1.5938-1.4375,0.32888-0.48993,0.57054-0.99765,0.9375-1.5625,0.18181-0.11619,0.36119-0.23274,0.625-0.4375,0.33292-0.25841,0.71862-0.58209,1.1562-0.9375,0.74877-0.6081,1.5634-1.2537,2.25-1.8125,0.31785,0.20802,0.64301,0.37668,1.0312,0.46875,0.6127,0.1453,1.3368,0.19079,2.1562,0.25,0.94152,0.068,4.0976,0.08832,4.9375,0.09375,1.3033,0.0082,2.4188-0.05906,3.3438-0.59375,0.92493-0.53469,1.4542-1.5869,1.5625-3.0938,0.0896-1.251-0.04994-1.8591-0.59375-2.875-0.03877-1.4383-0.08678-2.8789-0.125-4.3125-0.04628-1.7153-0.4091-2.8196-1.0625-4.375-0.5359-1.2746-0.89369-2.4345-1.5312-3.75,0.01348-0.08054,0.01867-0.16843,0.03125-0.25,0.57408,0.55376,1.1498,1.1081,1.7188,1.6562,0.8293,0.79878,1.6134,1.5387,2.5625,2.0938,0.9491,0.55501,2.0619,0.90865,3.4375,0.84375,2.941-0.139,6.1217-2.3013,7-5.1875,0.20493-0.67431,0.41543-1.3517,0.625-2.0312,3.9419,0.6485,8.4292,0.4489,11.906-1.4062,5.32-2.8392,7.7462-8.5087,8.3438-14.406,0.48809-4.8169-0.37879-12.647-2.7188-17.125-0.4592-0.87892-1.4251-1.5608-2.5312-2-0.55309-0.21961-1.1602-0.36344-1.75-0.34375-0.58984,0.01969-1.2012,0.22637-1.6562,0.6875-1.0995,1.1145-1.7373,2.554-2.625,3.3125-0.54929,0.46949-1.3095,0.73794-2.0312,1.0312-0.69618-1.6066-1.5792-2.9665-2.6562-4.25-1.02-1.214-2.017-1.833-3.282-2.625-2.421-1.516-4.351-3.475-6.656-5.3752-3.511-2.8946-6.85-4.3699-10.406-4.5938zm-0.188,2.7812c3.0829,0.13321,5.9604,1.3547,9.2188,4.0938,1.3589,1.1424,2.622,2.2257,3.9688,3.2812-0.24915,0.07208-0.47571,0.07977-0.75,0.1875a0.64216,0.64216,0,0,0,0.375,1.2188c0.70078-0.13351,1.619-0.0025,2.5,0.15625,0.22478,0.14255,0.46184,0.30445,0.6875,0.4375,1.2375,0.72916,1.7524,1.0085,2.5312,2.0938,0.54624,0.76092,0.95954,1.5586,1.4062,2.3438-0.13424-0.02639-0.27876-0.08148-0.40625-0.09375-0.60786-0.05844-1.1852,0.1088-1.6875,0.375-0.0098,0.0025-0.02208-0.0027-0.03125,0-0.03003,0.0089-0.07141,0.02142-0.09375,0.03125-0.0068,0.003-0.02524-0.0029-0.03125,0-0.01169,0.007-0.01966,0.02412-0.03125,0.03125-0.62925,0.30182-1.6798,0.65743-2.25,0.75a0.64216,0.64216,0,0,0,-0.125,1.2188c0.29519,0.10194,0.62126,0.14359,0.96875,0.15625,0.01008,0.000367,0.02119-0.000341,0.03125,0-0.0063,0.04447-0.02691,0.07994-0.03125,0.125-0.0495,0.51505,0.08979,0.98716,0.28125,1.4375-0.12671,0.05282-0.24787,0.10101-0.375,0.15625a0.64216,0.64216,0,0,0,0.343,1.221c0.91412-0.13928,1.7504-0.15923,2.5938-0.15625-0.41596,0.02003-0.83762,0.055-1.2812,0.15625-1.8111,0.413-2.7187,1.2934-3.1875,2.3438-0.46884,1.0504-0.6179,2.1662-1.3438,3.5a0.64216,0.64216,0,0,0,1.0625,0.71875c0.88072-1.0766,1.2615-2.1399,1.7188-2.9062,0.30778-0.51583,0.70693-0.8736,1.2188-1.1562-0.03533,0.07796-0.09613,0.13724-0.125,0.21875-0.39374,1.1118-0.48652,2.1144-0.5625,3.0312-0.07599,0.91683-0.14672,1.7456-0.5,2.5938a0.64291,0.64291,0,0,0,1.1562,0.5625c1.0682-1.8505,1.0938-3.5313,1.9062-5.1875,0.0772-0.15744,0.41274-0.54969,0.78125-0.84375,0.3685-0.29406,0.81431-0.46741,0.875-0.46875,0.11623,0.89444,0.23714,1.8104,0.1875,2.5-0.11742,1.6329-0.60449,4.1888-0.84375,5.0625a0.64216,0.64216,0,0,0,1.125,0.5625c1.0986-1.4122,1.4295-3.829,1.8125-5.5,0.43764-1.9093,0.3049-4.1265-0.0625-6.0938-0.05168-0.27673,0.04286-0.33812,0.0625-0.5,0.4004,0.13042,0.80226,0.25903,1.2188,0.34375,0.63109,0.12838,1.3481,0.12057,2.125-0.15625,2.5809-0.92042,3.9971-2.902,4.7812-5.1875,0.16048,0.1967,0.40923,0.38735,0.46875,0.53125,1.7187,4.1576,2.5485,10.957,2.0938,15.156-0.51197,4.7268-2.8353,9.8387-6.875,12.094-5.2034,2.9042-11.445,1.173-16.875-0.65625-1.065-0.35877-1.8328-0.90599-2.875-1.5625a0.64216,0.64216,0,0,0,-0.25,-0.09375c0.49906-0.24556,1.2514-0.5554,1.7812-0.84375a0.64216,0.64216,0,0,0,-0.407,-1.186c-0.58903,0.09951-1.5611,0.32173-2.0625,0.40625-0.77399,0.13069-1.3796,0.30392-1.7812,0.78125-0.40168,0.47732-0.47832,1.0489-0.59375,1.7812-0.10373,0.6572-0.26553,1.4937-0.375,2.1875a0.64216,0.64216,0,0,0,1.2188,0.3125c0.28408-0.75982,0.64951-1.645,0.96875-2.3438,0.16189-0.35418,0.24697-0.475,0.34375-0.5625,0.03157-0.02854,0.16406-0.08949,0.21875-0.125a0.64216,0.64216,0,0,0,-0.03125,0.34375c0.26628,1.1988,0.35549,2.4352,0.03125,3.5312-0.29438,0.99448-0.68507,2.3627-0.65625,3.6562,0.01441,0.64676,0.12723,1.2852,0.5,1.8438,0.08333,0.12484,0.23636,0.20264,0.34375,0.3125-0.73807-0.44442-1.4241-1.0396-2.1875-1.7188-0.97681-0.86916-1.92-1.6836-2.8438-2.5a0.64216,0.64216,0,0,0,-0.251,-0.155c-2.4991-0.78847-4.4411-1.697-6.75-3.4062a0.64216,0.64216,0,0,0,-0.875,0.9375c1.5614,1.8352,2.8579,2.9961,4.9375,3.9688-0.38035,3.1574-1.4676,5.6099-2.4688,8.8438-0.08171,0.26384-0.39504,0.91902-0.8125,1.6875s-0.92362,1.692-1.4688,2.5625c-0.54513,0.87051-1.1141,1.6954-1.5938,2.3438-0.23982,0.32416-0.44611,0.61166-0.625,0.8125s-0.34886,0.31544-0.34375,0.3125c-0.29895,0.17218-0.66965,0.47411-1.2188,0.90625-0.5491,0.43214-1.2359,0.96028-1.9062,1.5-0.67034,0.53972-1.3509,1.0961-1.9062,1.5312-0.55531,0.43516-1.003,0.77173-1.125,0.84375a0.64216,0.64216,0,0,0,-0.1875,0.1875c-0.70149,0.93191-1.281,1.9802-1.9688,2.3438-1.2608,0.66664-2.058,0.38875-2.9688-0.375-0.91076-0.76375-1.7758-2.0936-2.5625-3.3438-0.3539-0.56251-0.9777-1.6231-1.3125-2.5938-0.1674-0.48531-0.24965-0.94921-0.21875-1.25s0.09358-0.42992,0.34375-0.5625c1.4606-0.77375,2.3952-1.4404,3.7188-2.3125,0.22383,0.284,0.46922,0.60968,0.59375,0.8125a0.64216,0.64216,0,0,0,1.1875,-0.4375c-0.061-0.491-0.127-0.981-0.188-1.466-0.104-0.841-0.1-1.475-0.031-2.344,0.06875-0.87198,0.12024-1.7379,0.1875-2.5938a0.64216,0.64216,0,0,0,-1.25,-0.25c-0.22196,0.77449-0.71892,1.6747-1,2.6562-0.04606,0.161-0.07827,0.31815-0.125,0.46875-3.413,0.655-6.776,0.717-10.187,0.157-0.222-1.231-0.47-2.517-0.688-3.438a0.64367,0.64367,0,0,0,-1.2812,0.125c-0.0801,1.2561-0.02524,4.4329-0.03125,6.2188-0.0049,1.3779-0.000458,1.5853-0.6875,2.7188-0.65146,1.0747-0.94944,1.3762-1.9062,3.2812a0.64216,0.64216,0,0,0,-0.09375,0.3125c0.07747,1.1717,0.10451,1.8318-0.1875,2.875-0.04947,0.1766-0.1842,0.30994-0.65625,0.40625s-1.1638,0.08489-1.9062,0c-1.4849-0.16978-3.1458-0.62141-3.8438-0.8125-0.88979-0.24353-2.16-0.51595-3.0312-0.96875-0.43561-0.2264-0.73384-0.51349-0.875-0.75s-0.19775-0.44806-0.03125-0.875c0.80716-2.0694,1.3001-4.2176,1.6875-7.0625a0.64216,0.64216,0,0,0,-0.093,-0.468c-3.09-4.452-5.989-10.618-6.531-15.938-0.43-4.214-0.172-6.7,0.718-9.218,1.44-4.069,3.44-7.549,6.626-10.344,3.906-3.4273,7.5819-4.948,12.938-5.9375-1.1733,1.3589-2.3379,2.7407-3.5938,4.2188-1.76,2.0719-2.7631,4.1523-3.8438,6.3438-0.76088,1.5425-1.2013,2.6951-1.125,3.875,0.07633,1.1799,0.67222,2.2309,1.6875,3.5938,1.6635,2.2332,2.4876,3.2108,3.1875,5.2188-0.54215,1.223-0.77617,2.3883-0.96875,4a0.64216,0.64216,0,0,0,0.15625,0.5c2.097,2.292,3.7113,3.9634,5.9688,4.5,2.0863,0.49588,3.9669,0.38158,5.875-0.59375,4.0074-2.0489,7.5632-4.5229,11.781-4.625a0.64216,0.64216,0,0,0,0.594,-0.406c2.115-5.2,1.907-9.634,0.906-14.594-0.667-3.306-0.915-6.438-1.125-9.844a0.64367,0.64367,0,0,0,-1.2812,-0.125c-0.8514,3.5817-1.0097,6.7892-0.375,10.375,0.72882,4.1146,1.2141,8.5315-0.59375,11.969-4.071,0.45344-7.4766,2.8014-10.938,4.5938-1.3117,0.67968-2.6532,0.725-4.1562,0.3125-1.2613-0.34637-2.1261-1.1686-3.5938-2.8438,0.0146-1.5774,0.31279-2.3357,1.125-3.9375,1.3685-2.6974,2.8632-5.2036,4.5312-7.875a0.64216,0.64216,0,0,0,-1.0312,-0.75c-1.7952,2.1671-3.4831,4.0879-5,6.25-0.62765-1.26-1.3851-2.2603-2.5312-3.8125-0.69255-0.93784-1.0024-1.5463-1.0625-2.0938-0.06007-0.54745,0.11011-1.1708,0.625-2.25,1.0735-2.2489,1.9355-4.1396,3.6875-6.0312,3.1823-3.4366,6.0368-7.2241,9.4375-10.531,0.9012-0.87647,1.4581-1.2474,2.0938-1.4688,0.63565-0.2214,1.4304-0.30946,2.6875-0.5,2.264-0.3431,4.4812-0.77812,6.7812-1.3125a0.64216,0.64216,0,0,0,-0.21875,-1.25c-1.7046,0.15888-3.3671,0.1946-5.0312,0.25,1.5337-1.8903,2.7924-3.2027,5.5625-4.4062,4.2-1.8239,7.571-2.789,10.656-2.6558zm1.7812,10.375a0.64216,0.64216,0,0,0,-0.156,0.031c-2.3784,0.59552-3.9226,1.4092-4.7812,2.5938-0.85864,1.1846-0.90733,2.6438-0.59375,4.2188a0.64216,0.64216,0,0,0,1.25,0.03125c0.48852-2.1634,1.237-4.0289,4.5625-5.625a0.64216,0.64216,0,0,0,-0.28125,-1.25zm-13.719,0.25a0.64216,0.64216,0,0,0,-0.03125,0.03125c-1.8657,0.21088-3.7327,0.41734-5.5938,0.59375-0.77685,0.07349-1.2895,0.0865-1.8125,0.28125-0.52296,0.19475-0.92436,0.52467-1.5,1.0938-1.0327,1.0208-1.8358,2.9166-2.5312,4.875-0.69541,1.9584-1.2313,3.9503-1.5,5.125a0.64234,0.64234,0,0,0,1.2188,0.40625c0.42312-0.97536,1.1329-2.7514,1.9375-4.4688,0.50529-1.0785,1.033-2.0216,1.5312-2.7812-0.0481,0.74301,0.03477,1.4784,0.21875,2.6562a0.64216,0.64216,0,0,0,1.25,0c0.31099-2.3805,1.0638-3.2675,2.4375-5.0625,1.557-0.39996,3.0216-0.87434,4.625-1.5a0.64216,0.64216,0,0,0,-0.25,-1.25zm41.906,1.1875c-0.82279,1.4397-1.9764,2.6195-3.375,3.5312-0.31979,0.20846-0.55627,0.51431-0.90625,0.6875-0.23586,0.11667-0.40158,0.07461-0.59375,0.125,0.49078-0.18517,1.0247-0.43784,1.5-0.8125,1.2968-1.0224,2.0772-2.4784,3.0312-3.4062,0.12195-0.11855,0.2278-0.12046,0.34375-0.125zm-22.25,4.1875a0.64216,0.64216,0,0,0,-0.28125,0.0625c-0.64928,0.30036-1.3898,0.4353-2.1875,0.59375-0.79767,0.15845-1.6666,0.35405-2.4375,0.875-0.71633,0.48385-1.3754,1.3128-2.0625,2.1562-0.687,0.844-1.377,1.713-1.875,2.157a0.64216,0.64216,0,0,0,0.65625,1.0625c0.64974-0.25201,1.1956-0.69075,1.75-1.0938,0.05805,0.19463,0.03629,0.40771,0.125,0.59375,0.26715,0.55969,0.69455,0.96663,1.1562,1.3125-0.29866,0.45612-0.61503,0.89399-0.8125,1.4375a0.64216,0.64216,0,0,0,1.0938,0.625c2.102-2.491,5.231-4.383,8.094-5.187a0.64745,0.64745,0,0,0,-0.188,-1.281c-0.72259-0.01039-1.5423,0.1937-2.375,0.40625-0.05437-0.18734-0.06939-0.38036-0.15625-0.5625-0.267-0.559-0.693-0.968-1.157-1.312,0.37278-0.23354,0.77132-0.42577,1.0938-0.71875a0.64216,0.64216,0,0,0,-0.4375,-1.125zm-66.156,2.719a0.64216,0.64216,0,0,0,-0.4063,0.125c-0.97147,0.68451-1.7663,1.2875-2.4375,1.9062a0.64216,0.64216,0,0,0,-0.9375,-0.218c-1.0318,0.72086-1.7192,1.296-2.0938,2.0938-0.37459,0.79774-0.34563,1.6883-0.25,2.9375a0.64216,0.64216,0,0,0,0.9375,0.5c-0.043246,0.92476-0.024208,1.9098,0.09375,3.1562a0.64216,0.64216,0,0,0,1.25,0c0.3901-4.417,1.1423-6.082,4.2814-9.407a0.64216,0.64216,0,0,0,-0.4375,-1.094zm78.094,0.34375c0.24783,0.01105,0.4976,0.006,0.75,0.03125,0.01968,0.09275,0.04296,0.18776,0.0625,0.28125-0.26772-0.1241-0.53124-0.27969-0.8125-0.3125zm-75.344,4.562c-0.2401,1.05-0.2335,2.044-0.3125,2.813-0.08773,0.8541-0.26585,1.4637-1.0938,2.125a0.64216,0.64216,0,0,0,-0.0937,0.093c-0.5169-0.535-0.6793-1.052-0.6563-1.593,0.023091-0.54173,0.26276-1.1486,0.65625-1.75,0.39349-0.60145,0.93735-1.1826,1.5-1.6875zm2.8125,7.375c-0.06097,0.18051-0.12908,0.34696-0.1875,0.53125-0.0069,0.02172-0.02421,0.04012-0.03125,0.0625-0.63519,0.24301-1.3312,0.47888-1.875,0.46875-0.6248-0.01163-0.9732-0.17207-1.25-0.75-0.030635-0.06393-0.034041-0.15453-0.0625-0.21875,0.08209,0.09937,0.11285,0.22351,0.21875,0.3125,0.30381,0.25529,0.73182,0.40493,1.1562,0.375,0.42443-0.02993,0.88072-0.1831,1.4375-0.40625,0.23298-0.09334,0.38063-0.26159,0.59375-0.375zm65.531,15.75c-0.30286,0.39007-0.6679,0.72239-1.0938,1.0312a0.64216,0.64216,0,0,0,-0.062,-0.218c0.4413-0.20463,0.84666-0.47764,1.1562-0.8125zm-64.875,1.844c1.1521,3.3475,2.7383,6.5726,4.5625,9.375-0.11829,0.45224-0.22547,0.87227-0.4375,1.1562-0.26327,0.35221-0.54645,0.44628-1,0.4375-0.45355-0.0088-1.0502-0.20258-1.6562-0.5-1.2122-0.59483-2.4623-1.6079-2.9688-2.125-1.1665-1.191-1.9529-2.6192-2.125-3.8438-0.06782-0.48421-0.02431-0.57416,0-0.625,0.02431-0.05083,0.19107-0.24847,0.5625-0.625,0.96629-0.97819,1.9389-1.958,2.9062-2.9375a0.64216,0.64216,0,0,0,0.125,-0.21875c0.01169-0.03126,0.01962-0.06256,0.03125-0.09375zm51.969,2.875c0.06211,0.17456,0.07959,0.31834,0.15625,0.5,0.56818,1.3467,0.8048,2.0544,0.84375,3.4375,0.04333,1.5397,0.08121,3.0821,0.125,4.625a0.64216,0.64216,0,0,0,0.09375,0.28125c0.4856,0.85101,0.49062,0.70445,0.40625,1.6562-0.08351,0.94028-0.26187,1.2521-0.4375,1.375-0.17563,0.12289-0.66559,0.17135-1.5312,0.15625-0.41368-0.0071-1.408,0.01292-2.4062,0-0.99829-0.01292-2.0074-0.03347-2.3438-0.0625-0.61183-0.05279-0.6955-0.11902-1-0.1875,0.84666-0.90434,1.715-2.0887,2.5312-3.4375,1.085-1.7929,2.0034-3.6153,2.3438-4.6875,0.40919-1.2885,0.81332-2.4539,1.2188-3.6562z" fill-rule="evenodd" transform="matrix(0.98760175,0,0,0.98760175,0.6164674,0.38001373)"/>')
            .addViewBox('hadoop', '0 0 100 100')
            .addShape("kafka", '<path d="m 237.61686,249.26774 c -18.59017,0 -35.25655,8.23614 -46.66953,21.20309 L 161.7022,249.76736 c 3.10449,-8.54739 4.88702,-17.72533 4.88702,-27.33167 0,-9.4398 -1.72051,-18.46383 -4.72278,-26.88489 l 29.17966,-20.4841 c 11.41184,12.90148 28.03457,21.09283 46.57076,21.09283 34.31246,0 62.23218,-27.91513 62.23218,-62.23218 0,-34.317049 -27.91972,-62.232171 -62.23218,-62.232171 -34.31245,0 -62.23217,27.915122 -62.23217,62.232171 0,6.14236 0.92802,12.06535 2.59339,17.67479 L 148.7789,172.09659 C 136.58147,156.96465 119.01923,146.39928 99.009473,143.1742 l 0,-35.19108 c 28.189617,-5.9207 49.429457,-30.966782 49.429457,-60.894136 0,-34.317052 -27.91971,-62.232174 -62.232167,-62.232174 -34.312458,0 -62.232174,27.915122 -62.232174,62.232174 0,29.526515 20.689694,54.263646 48.315386,60.606996 l 0,35.6482 c -37.701782,6.61786 -66.4656712,39.52106 -66.4656712,79.09151 0,39.7634 29.0487252,72.7872 67.0227102,79.17994 l 0,37.64206 c -27.908231,6.13432 -48.872425,31.02306 -48.872425,60.75057 0,34.31705 27.919716,62.23217 62.232174,62.23217 34.312457,0 62.232167,-27.91512 62.232167,-62.23217 0,-29.72751 -20.96419,-54.61625 -48.872418,-60.75057 l 0,-37.6432 C 119.18232,298.3113 136.42182,287.95497 148.49406,273.1584 l 29.44038,20.83786 c -1.63437,5.5589 -2.54975,11.42332 -2.54975,17.50366 0,34.31705 27.91972,62.23217 62.23217,62.23217 34.31246,0 62.23218,-27.91512 62.23218,-62.23217 0,-34.31705 -27.91972,-62.23218 -62.23218,-62.23218 l 0,0 z m 0,-145.51353 c 16.63882,0 30.172,13.53892 30.172,30.17314 0,16.63422 -13.53318,30.17199 -30.172,30.17199 -16.63881,0 -30.17199,-13.53777 -30.17199,-30.17199 0,-16.63422 13.53318,-30.17314 30.17199,-30.17314 l 0,0 z M 56.033622,47.088984 c 0,-16.63422 13.534327,-30.171992 30.173141,-30.171992 16.638817,0 30.171987,13.537772 30.171987,30.171992 0,16.63422 -13.53317,30.171991 -30.171987,30.171991 -16.638814,0 -30.173141,-13.537771 -30.173141,-30.171991 l 0,0 z M 116.37875,400.00826 c 0,16.63422 -13.53317,30.17199 -30.171987,30.17199 -16.638814,0 -30.173141,-13.53777 -30.173141,-30.17199 0,-16.63422 13.534327,-30.172 30.173141,-30.172 16.638817,0 30.171987,13.53778 30.171987,30.172 l 0,0 z M 86.204466,264.51568 c -23.206133,0 -42.084588,-18.87501 -42.084588,-42.07999 0,-23.20613 18.878455,-42.08459 42.084588,-42.08459 23.204984,0 42.083434,18.87846 42.083434,42.08459 0,23.20498 -18.87845,42.07999 -42.083434,42.07999 l 0,0 z m 151.412394,77.15738 c -16.63881,0 -30.17199,-13.53892 -30.17199,-30.17314 0,-16.63422 13.53318,-30.17199 30.17199,-30.17199 16.63882,0 30.172,13.53777 30.172,30.17199 0,16.63422 -13.53318,30.17314 -30.172,30.17314 l 0,0 z" transform="matrix(0.06703178,0,0,0.06703204,5.6095866,1.015081)"/>')
            .addViewBox("kafka", "0 0 32 32")
            .addShape("teradata",
            ' <g id="teradata" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">\n' +
                '                <g id="text" fill="#354145">\n' +
                '                  <path d="M78.882,72.796 L123.941,72.796 C120.763,60.83 111.788,55.595 101.878,55.595 C92.53,55.595 81.873,61.204 78.882,72.796 Z M149.182,90.184 L78.134,90.184 C80.564,103.646 90.099,111.873 101.504,111.873 C108.796,111.873 117.957,110.937 124.689,99.533 L146.751,104.206 C138.524,123.652 121.884,133 101.504,133 C75.142,133 53.64,112.994 53.64,83.64 C53.64,54.286 75.142,34.093 101.878,34.093 C126.745,34.093 148.246,53.351 149.182,81.771 L149.182,90.184 Z"\n' +
                '                    id="Fill-1"></path>\n' +
                '                  <path d="M387.843,83.64 C387.843,66.439 374.568,55.595 361.294,55.595 C346.336,55.595 335.118,66.439 335.118,83.64 C335.118,100.841 346.336,111.498 361.294,111.498 C374.568,111.498 387.843,100.841 387.843,83.64 Z M412.523,130.195 L387.843,130.195 L387.843,122.156 C380.364,129.074 370.081,133 356.993,133 C333.248,133 311.186,112.994 311.186,83.64 C311.186,54.286 333.248,34.093 356.993,34.093 C370.081,34.093 380.364,38.019 387.843,44.937 L387.843,0.937 L412.523,0.937 L412.523,130.195 Z"\n' +
                '                    id="Fill-3"></path>\n' +
                '                  <path d="M630.3,92.427 C630.3,104.393 618.894,113.368 605.807,113.368 C596.271,113.368 589.915,108.88 589.915,101.962 C589.915,95.606 595.149,91.306 603.003,91.306 L630.3,91.306 L630.3,92.427 Z M614.407,37.117 L614.407,37.093 L580.299,37.093 L580.299,57.658 L614.407,57.658 C623.943,57.658 630.3,61.765 630.3,71.113 L630.3,72.61 L603.377,72.61 C579.818,72.61 566.356,84.576 566.356,102.524 C566.356,120.846 580.566,133 601.881,133 C614.595,133 623.943,128.7 630.3,122.53 L630.3,130.195 L653.858,130.195 L653.858,69.244 C653.858,47.082 638.243,37.617 614.407,37.117 Z"\n' +
                '                    id="Fill-4"></path>\n' +
                '                  <path d="M484.378,92.427 C484.378,104.393 472.973,113.368 459.885,113.368 C450.349,113.368 443.992,108.88 443.992,101.962 C443.992,95.606 449.227,91.306 457.08,91.306 L484.378,91.306 L484.378,92.427 Z M468.485,37.117 L468.485,37.093 L434.377,37.093 L434.377,57.658 L468.485,57.658 C478.02,57.658 484.378,61.765 484.378,71.113 L484.378,72.61 L457.454,72.61 C433.895,72.61 420.434,84.576 420.434,102.524 C420.434,120.846 434.644,133 455.958,133 C468.672,133 478.02,128.7 484.378,122.53 L484.378,130.195 L507.935,130.195 L507.935,69.244 C507.935,47.082 492.321,37.617 468.485,37.117 Z"\n' +
                '                    id="Fill-5"></path>\n' +
                '                  <path d="M279.3,92.427 C279.3,104.393 267.894,113.368 254.807,113.368 C245.271,113.368 238.914,108.88 238.914,101.962 C238.914,95.606 244.15,91.306 252.003,91.306 L279.3,91.306 L279.3,92.427 Z M263.408,37.117 L263.408,37.093 L229.299,37.093 L229.299,57.658 L263.408,57.658 C272.943,57.658 279.3,61.765 279.3,71.113 L279.3,72.61 L252.376,72.61 C228.818,72.61 215.356,84.576 215.356,102.524 C215.356,120.846 229.566,133 250.881,133 C263.595,133 272.943,128.7 279.3,122.53 L279.3,130.195 L302.858,130.195 L302.858,69.244 C302.858,47.082 287.244,37.617 263.408,37.117 Z"\n' +
                '                    id="Fill-6"></path>\n' +
                '                  <path d="M216.11,37.026 C200.966,37.026 190.121,43.069 182.643,53.913 L182.643,36.899 L157.963,36.899 L157.963,130.197 L182.643,130.197 L182.643,100.095 C182.643,74.106 193.113,57.776 215.923,57.776 L217.044,57.776 L217.044,37.029 C216.741,37.027 216.431,37.026 216.11,37.026"\n' +
                '                    id="Fill-7"></path>\n' +
                '                  <path d="M48.982,107.707 C45.229,109.115 41.291,110.002 38.328,110.002 C30.102,110.002 24.68,105.142 24.68,93.923 L24.68,57.09 L49.982,57.09 L49.982,36.898 L24.68,36.898 L24.68,14.007 L0,14.007 L0,95.793 C0,121.408 14.584,133 36.646,133 C44.438,133 51.879,131.338 61.481,126.199 C56.364,121.123 51.667,114.8 48.982,107.707"\n' +
                '                    id="Fill-8"></path>\n' +
                '                  <path d="M558.509,109.788 C557.521,109.926 556.586,110.002 555.733,110.002 C547.507,110.002 542.085,105.142 542.085,93.923 L542.085,57.09 L568.068,57.09 L568.068,36.898 L542.085,36.898 L542.085,14.007 L517.404,14.007 L517.404,95.793 C517.404,121.408 531.988,133 554.051,133 C559.44,133 564.302,132.206 569.964,130.017 C562.645,124.774 559.799,116.281 558.509,109.788"\n' +
                '                    id="Fill-9"></path>\n' +
                '                </g>\n' +
                '                <path d="M695.029,116.028 C695.029,124.853 688.257,131.624 678.817,131.624 C669.377,131.624 662.605,124.853 662.605,116.028 C662.605,107.615 669.377,100.227 678.817,100.227 C688.257,100.227 695.029,107.615 695.029,116.028"\n' +
                '                  id="Fill-11" fill="#E46C42"></path>\n' +
                '              </g>')
            .addViewBox("teradata","0 0 696 133");
    }

    runFn($ocLazyLoad: any, $translate: any){
        $ocLazyLoad.load({name:'kylo',files:['bower_components/angular-material-icons/angular-material-icons.css',
                                             'bower_components/angular-material-expansion-panel/dist/md-expansion-panel.css',
                                             'bower_components/angular-material-data-table/dist/md-data-table.css',
                                             'bower_components/nvd3/build/nv.d3.css',
                                             'bower_components/codemirror/lib/codemirror.css',
                                             'bower_components/vis/dist/vis.min.css'
        ]})

    }
}
const app = new App();
export default app;
