import {Module,registModule} from '/dist/nodom.esm.js'

export class ModuleE extends Module{
    template(){
        // this.model.rows = this.props.$data.rows;
        return `
            <div style='border:solid 1px;'>
                <div>id is:{{id}},name is:<span style='color:red;font-weight:bold;padding-left:10px'>{{name}}</span></div>
                <!--<p>子模块e</p>
                <button e-click='change'>change</button>
                <button e-click='change1'>change1</button>
                <for cond={{rows}}>
                    <div>id is:{{id}},name is:<span style='color:red;font-weight:bold;padding-left:10px'>{{name}}</span></div>
                </for>
                <div>id is:{{id}},name is:<span style='color:red;font-weight:bold;padding-left:10px'>{{name}}</span></div>-->
            </div>
        `
    }

    change(){
        this.model.o2 = {name:'nodom'};
    }
    change1(){
        this.model.o2.name = 'nodom3';
    }
}

registModule(ModuleE,'mod-e');