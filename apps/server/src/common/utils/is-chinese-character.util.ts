/**
 * 判断字符是否为中文字符
 * 包括基本中文字符、中文扩展字符区等
 *
 * @param char 要判断的字符
 * @returns 是否为中文字符
 */
export const isChineseCharacter = (char: string): boolean => {
  // 使用 codePointAt(0) 来获取完整的 Unicode 码点
  const code = char.codePointAt(0);

  if (code === undefined) {
    return false;
  }

  // 基本中文字符范围 (U+4E00-U+9FFF) - 中日韩统一表意文字
  if (code >= 0x4e00 && code <= 0x9fff) return true;

  // 中文扩展A区 (U+3400-U+4DBF) - 中日韩统一表意文字扩展A区
  if (code >= 0x3400 && code <= 0x4dbf) return true;

  // 中文扩展B区 (U+20000-U+2A6DF) - 中日韩统一表意文字扩展B区
  if (code >= 0x20000 && code <= 0x2a6df) return true;

  // 中文扩展C区 (U+2A700-U+2B73F) - 中日韩统一表意文字扩展C区
  if (code >= 0x2a700 && code <= 0x2b73f) return true;

  // 中文扩展D区 (U+2B740-U+2B81F) - 中日韩统一表意文字扩展D区
  if (code >= 0x2b740 && code <= 0x2b81f) return true;

  // 中文扩展E区 (U+2B820-U+2CEAF) - 中日韩统一表意文字扩展E区
  if (code >= 0x2b820 && code <= 0x2ceaf) return true;

  // 中文扩展F区 (U+2CEB0-U+2EBEF) - 中日韩统一表意文字扩展F区（较新版本）
  if (code >= 0x2ceb0 && code <= 0x2ebef) return true;

  // 中文兼容字符 (U+F900-U+FAFF) - 中日韩兼容表意文字
  if (code >= 0xf900 && code <= 0xfaff) return true;

  // 中文兼容字符补充 (U+2F800-U+2FA1F) - 中日韩兼容表意文字补充
  if (code >= 0x2f800 && code <= 0x2fa1f) return true;

  return false;
};
