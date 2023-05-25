
// let arr = [];
// const cnt = 10000000;
// for(let i=0;i<cnt;i++){
//     arr[i] = i;
// }

// console.time('t1');
// let tmp = 99999999;
// for(let i=0;i<cnt;i++){
//     if(arr[i] === tmp){
//         break;
//     }
// }

// console.timeEnd('t1');

// let key = [];
// for(let i=1;i<100;i++){
//     key[i] = i;
// }
// let mid = [];
// for(let i=1;i<10000;i++){
//     mid[i] = i;
// }

// // FNV-1a哈希算法
// function fnv1aHash(str) {
//     let h = 2166136261;
//     for (let i = 0; i < str.length; i++) {
//         h ^= str.charCodeAt(i);
//         h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
//     }
//     return h >>> 0; // 返回无符号32位整数
// }

// function combineIntegers(x, y) {
//     return (x << 18) | y;
// }

// let arr1 = [];
// let map = {};
// console.time('t21');
// for(let i=1;i<100;i++){
//     for(let j=1;j<1000;j++){
//         // const x = (i+j)*(i+j+1)+j;
//         // fnv1aHash(i+'_'+j);
//         const x = combineIntegers(i,j);
//         // console.log(x);
//         // if(map[x]){
//         //     console.log(x);
//         //     break;
//         // }
//         // map[x] = true;
//     }
// }

// console.timeEnd('t21');

// let map1 = new Map();
// map1.set(1,'a');
// map1.set(2,'b');
// console.log(map1);

const obj = {a:1,b:2}
// console.time('t1');
// let proxy;
// for(let i=0;i<1000;i++){
//     proxy = new Proxy(obj, {
//         get(target, name) {
//           return "[[" + name + "]]";
//         }
//       });
// }
// console.timeEnd('t1');
let proxy = Proxy.revocable(obj,{
    get(target, name,receiver) {
        // return "[[" + name + "]]";
        console.log(target,name,proxy)
        // console.log(target,name,receiver)
        return target[name];
    },
    foo:()=>{}
})
console.log(proxy.proxy)
// console.log(Object.keys(proxy))
// console.log(proxy.revoke)