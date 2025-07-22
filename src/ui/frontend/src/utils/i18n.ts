const ENGLISH_LANGUAGE = "en_"
const CHINESE_LANGUAGE = "zh_"

export class I18n {
  private languageIndex: number

  constructor(userLanguage: string) {
    if (userLanguage === ENGLISH_LANGUAGE) {
      this.languageIndex = 0
    } else if (userLanguage === CHINESE_LANGUAGE) {
      this.languageIndex = 1
    } else {
      this.languageIndex = 0
    }
  }

  /**
   * @description Language order:
   * - English
   * - Chinese
   */
  select<T>(...candidates: T[]): T {
    if (candidates.length === 0) {
      throw new Error("Empty i18n candidates")
    }
    if (this.languageIndex < candidates.length) {
      return candidates[this.languageIndex]
    }
    // return English text by default
    return candidates[0]
  }
}

