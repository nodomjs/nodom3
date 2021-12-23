import {Module} from '../../../dist/nodom.esm.js'
/**
 * 路由主模块
 */
export class MdlMod1 extends Module {
    template(){
        return "<div>这是首页,路径是{{$route.path}}</div>";
    }
    
}