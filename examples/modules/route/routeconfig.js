import {Nodom} from "/dist/nodom.esm.js";
import {MdlRouteDir} from "./mdlroutedir.js";
import {MdlPMod1} from "./mdlpmod1.js";
import {MdlPMod2} from "./mdlpmod2.js";
import {MdlPMod3} from "./mdlpmod3.js";
import {MdlMod4} from "./mdlmod4.js";
import {MdlMod5} from "./mdlmod5.js";
import {MdlMod6} from "./mdlmod6.js";
import {MdlMod7} from "./mdlmod7.js";
import {MdlMod8} from "./mdlmod8.js";

export function initRoute(){
    Nodom.createRoute([{
        path: '/router',
        module: MdlRouteDir,
        routes: [
            {
                path: '/route1',
                module: MdlPMod1,
                routes: [{
                    path: '/home',
                    module:'/examples/modules/route/mdlmod1.js'
                }, {
                    path: '/list',
                    module:'/examples/modules/route/mdlmod2.js'
                }, {
                    path: '/data',
                    module:'/examples/modules/route/mdlmod3.js'
                }]
            },
            {
                path: '/route2',
                module: MdlPMod2,
                onEnter: function (module,path) {
                    console.log('route2 enter',module,path);
                },
                onLeave: function (module,path) {
                    console.log('route2 leave',module,path);
                },
                routes: [{
                    path: '/rparam/:page/:id',
                    module: MdlMod4,
                    onEnter: function () {
                        console.log('route2/rparam');
                    },
                    routes:[{
                        path:'/desc',
                        module:MdlMod7
                    },{
                        path:'/comment',
                        module:MdlMod8
                    }]
                }]
            }, 
            {
                path: '/route3',
                module: MdlPMod3,
                routes: [{
                    path: '/r1',
                    module: MdlMod5,
                    routes: [{
                        path: '/r2',
                        module: MdlMod6
                    }]
                }]
            }
        ]
    }])
}