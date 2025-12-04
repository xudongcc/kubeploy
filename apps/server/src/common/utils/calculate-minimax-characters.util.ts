import { isChineseCharacter } from './is-chinese-character.util';

/**
 * 适配 minimax 的计费字符数计算
 * 计费规则：
 * - 中文字符算2个字符，其他字符算1个字符
 *
 * @param text 要计算的文本
 * @returns 计费字符数
 */
export const calculateMinimaxCharacters = (text: string): number => {
  let totalCharacters = 0;

  for (const char of text) {
    // 判断是否为中文字符
    if (isChineseCharacter(char)) {
      totalCharacters += 2; // 中文字符算2个字符
    } else {
      totalCharacters += 1; // 其他字符（英文、标点、空格等）算1个字符
    }
  }

  return totalCharacters;
};
