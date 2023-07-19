import {Module,Nodom} from '/dist/nodom.esm.js'
export class MdlPMod1 extends Module {
    template(){
        return `
        <div class='result code1'>
            <div style='border-bottom: 1px solid #999'>
                <a x-route='/router/route1/home'  class={{home?'colorimp':''}} active='home'>首页</a>
                <a x-route='/router/route1/list'  class={{list?'colorimp':''}} active='list'>列表</a>
                <a x-route='/router/route1/data'  class={{data?'colorimp':''}} active='data'>数据</a>
            </div>
            <a x-route={{route2}}>to router2</a>
            <button e-click='redirect'>to router3</button>
            <div x-router test='1'></div>
        </div>	
        `;
    } 
    data(){
        return{
            home: true,
            list: false,
            data: false,
            route2:'/router/route2/rparam/home/1'
        }
    }
    
    redirect(){
        Nodom['$Router'].redirect("/router/route3/r1/r2");
    }
}
