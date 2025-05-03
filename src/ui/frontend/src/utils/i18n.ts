const ENGLISH_LANGUAGE = "en_"
const CHINESE_LANGUAGE = "zh_"

export class I18n {
  languageIndex: number

  constructor(userLanguage: string) {
    if (userLanguage === ENGLISH_LANGUAGE) {
      this.languageIndex = 0
    } else if (userLanguage === CHINESE_LANGUAGE) {
      this.languageIndex = 1
    } else {
      this.languageIndex = 0
    }
  }

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

// export default await (async () => {
//   const userLanguage = globalThis.config.language
//   let languageIndex
//   if (userLanguage === ENGLISH_LANGUAGE) {
//     languageIndex = 0
//   } else if (userLanguage === CHINESE_LANGUAGE) {
//     languageIndex = 1
//   } else {
//     languageIndex = 0
//   }

//   return function(...candidates) {
//     if (candidates.length === 0) {
//       throw new Error("Empty i18n candidates")
//     }
//     if (languageIndex < candidates.length) {
//       return candidates[languageIndex]
//     }
//     // return English text by default
//     return candidates[0]
//   }
// })()
