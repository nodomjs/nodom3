import {Module,registModule} from '/dist/nodom.esm.js'
import { ModuleC } from './modulec.js';

export class ModuleB extends Module{
    modules = [ModuleC]
    template(props){
        return `
            <div style='background:#f0f0f0;padding:5px'>
                <div>这是子模块B</div>
                <p>模块B的内容</p>
                <p>ppp.z is:{{ppp.z}}</p>
                <button e-click='change'>change ppp.z</button>
                <br />
                <slot>haha slot b</slot>
            </div>
        `
        
    }
    data(){
        return{
            name:'yang',
            x1:0,
            x2:0
        }
    }

    change(model,dom){
        // console.log(this);
        model.x2 = 'hahaha'
        model.ppp.z = 'module b changed x.y.z'
    }
}

registModule(ModuleB,'mod-b');