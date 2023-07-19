import {Module,registModule} from '/dist/nodom.esm.js'

export class ModuleC extends Module{
    template(props){
        return `
            <div>
                <div>这是子模块C</div>
                <div>name is:{{d}}</div>
            </div>
        `
    }
    data(){
        return{
            name:'modulec',
            x1:0,
            x2:0
        }
    }
    
    
    changeX2(dom,module){
        console.log(this);
        this.x2 = 'hahaha'
    }

}

registModule(ModuleC,'modc');