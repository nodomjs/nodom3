import {Module} from '../../dist/nodom.esm.js'
import {ModuleA} from './modulea.js'
import {ModuleB} from './moduleb.js'
import {ModuleC} from './modulec.js'
import {ModuleD} from './moduled.js'
export class ModuleMain extends Module{
    modules=[ModuleC]
    template(){
        return `
            <div>
                <button e-click='change'>change</button>
                <button e-click='getSubModule'>get sub module</button>
                <!--<div>y is {{y}}</div>
                <div>x.y is {{x.y}}</div>
                <h2>默认slot</h2>
                <p>第一个子模块</p>
                <mod-a xxx={{xxx}} class='m1' style='font-weight:bold;' p1='true' x-show={{show}}>
                    <mod-b p2='false' xxx='222'>
                        <modc>
                            <div>name is:{{name}}</div>
                        </modc>
                    </mod-b>
                    <slot name='s2'><p  style='color:red'>替换的第二个slot  {{name}}</p></slot>
                </mod-a>
                <hr/>
                
                <p>第二个子模块</p>
                <h2>替换plug</h2>
                <ModuleA $yyy={{xxx}} $n={{name}} $x1={{x.y}} $x2={{y}} xxx='222'>
                    <slot>
                        <h3 style='color:red'> hello change plug 2</h3>    
                    </slot>
                    <slot name='s2'>替换的第二个slot  {{name}}</slot>
                </ModuleA>
                -->
                <p>第三个子模块</p>
                <h2>默认子节点自动转换为slot节点</h2>
                <p>x.y is:{{x.y.z}}</p>
                <p>name is:{{name}}</p>
                <ModuleA x={{x}} style='background:#9cf' role='mda1'>
                    <!--<slot name='s1'>
                        <for cond={{rows}}>
                            <p style='color:blue'>
                                {{name}}
                            </p>
                        </for>
                    </slot>
                    <slot name='s2'><h1>被替换的s2</h1></slot>-->
                    <ModuleC x-repeat={{rows}} $d={{name}} index='idx' idx={{idx}}  test={{genTest(a,b,c)}}/>
                </ModuleA>
           </div>
        `
    }
    data(){
        return{
            show:true,
            x:{
                y:{z:123}
            },
            xxx:0,
            y:'hello world!',
            name:'nodom',
            rows:[
                {name:'nodom'},
                {name:'noomi'},
            ]
        }
    }

    getData(){
        // return {
        //     x1:'x.y',
        //     x2:['y',true]
        // }
        return{
            n:'name',
            x1:'x.y',
            x2:['y',true]
        }
    }
    change(model){
        model.xxx=222;
        model.show = !model.show;
        model.y = 'aaaa';
        model.name='nodom3'
        model.x.y.z='module main change x.y.z'
        model.rows.push({name:'relaen'})
        console.log(model);
    }

    genTest(a,b,c){
        return 'mc'
    }

    getSubModule(){
        console.log(this.getModule('modulec',true,{idx:0}));
    }
}
