import {Module} from '/dist/nodom.esm.js'
/**
 * 路由主模块
 */
export class MdlMod2 extends Module {
    template(){
        return "<div>这是商品列表页,路径是{{$route.path}}</div>";
    }
}