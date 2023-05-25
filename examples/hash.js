// FNV-1a哈希算法
function fnv1aHash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return h >>> 0; // 返回无符号32位整数
  }
  
  // 假设这是你要加密的两个唯一整数
  const integer1 = 422323;
  const integer2 = 732323;
  
  // 将整数合并成一个字符串
  const combinedString = `${integer1}-${integer2}`;
  
  // 使用FNV-1a哈希函数计算哈希值
  const hashedValue = fnv1aHash(combinedString);
  
  console.log('加密后的整数:', hashedValue);
  