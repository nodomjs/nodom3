import {Module, Nodom,Router, Util} from '/dist/nodom.esm.js'
//启用路由
Nodom.use(Router,[null,function(mdl,path){
    console.log('enter',mdl,path)
},function(mdl,path){
    console.log('leave',mdl,path)
}]);

export class MdlRouteMain extends Module {
    template(){
        return `
        <div>
            <div>当前时间:{{formatDate(date1)}}</div>
            <a x-route='/router' class={{page1?'colorimp':''}} active='page1'>page1</a>
            <div x-router></div>
        </div>
        `;
    }
    data(){
        return{
            page1: true,
            page2: false,
            date1: (new Date()).getTime()
        }
    }

    formatDate(d){
        return Util.formatDate(d,'yyyy/MM/dd');
    }
    onInit(){
        let hash = location.hash;
        if(hash){
            Nodom['$Router'].go(hash.substr(1));
        }else{
            Nodom['$Router'].go('/router/route1/home');
        }
    }

}