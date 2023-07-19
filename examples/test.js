class Test{
    static foo1(){
        console.log('foo1')
    }
}

Test.foo1 = ()=>{
    console.log('before');
    Reflect.apply(Test.foo1);
    console.log('after');
}


Test.foo1();