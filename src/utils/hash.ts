export function hash(str: string) {
  let hash = 2166136261; // FNV-1a 算法的初始值
  for (let i = 0; i < str.length; i++) {
    // 逐个字符处理，并将结果限制在 32 位带符号整数
    hash ^= str.charCodeAt(i);
    hash *= 16777619;
    hash &= 0xffffffff; // 确保结果为 32 位整数
  }
  // 转换为无符号整数
  return hash >>> 0;
}
