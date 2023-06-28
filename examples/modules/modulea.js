import {Module,registModule} from '../../dist/nodom.esm.js'
import {ModuleB} from './moduleb.js'
export class ModuleA extends Module{
    modules=[ModuleB];
    template(props){
        if(props.p1){
            return `
                <div class='modulea' style='color:red'>
                    <div>这是子模块A</div>
                    <p>模块A的内容</p>
                    <slot></slot>
                </div>
            `
        }else if(props.temp){
            return `
                <div>
                    <h1>props传模版</h1>
                    ${props.temp}
                </div>
            `
        }else{
            // this.model.x1 = this.srcDom.model.xxx;
            // <div class={{'modulea' + (x1?' cls1':' cls2')}} role='modulea'></div>
            this.model.x = props.x;
            return `
                <div role='modulea'>
                    moduleA
                    <button e-click='change'>修改x.y.z</button>
                    <div>这是外部数据x.y.z:{{x.y.z}}</div>
                    <moduleb $ppp={{x.y}} />
                    <div>name:{{name.first + ' ' + name.last}}</div>
                    <slot>
                    </slot>
                    <p>---分割线---</p>
                    <!--
                    <div>
                        <p>这是外部数据x2:{{x2}}</p>
                        <slot name='s2'>第二个slot</slot>
                    </div>-->
                </div>
            `
        }
        
    }
    data(){
        return{
            name:{first:'yang',last:'lei'},
            x1:0,
            x2:0,
            rows:[{name:'nodom1'},{name:'nodom2'},{name:'nodom3'}]
        }
    }
    change(model){
        model.x2='hello';
        model.name.first='li';
        model.x.y.z='module a changed x.y.z';
    }
}

registModule(ModuleA,'mod-a');