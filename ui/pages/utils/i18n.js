const ENGLISH_LANGUAGE = "en_"
const CHINESE_LANGUAGE = "zh_"

export default await (async () => {
  const userLanguage = (await backend.config()).language
  let languageIndex
  if (userLanguage === ENGLISH_LANGUAGE) {
    languageIndex = 0
  } else if (userLanguage === CHINESE_LANGUAGE) {
    languageIndex = 1
  } else {
    languageIndex = 0
  }

  return function(...candidates) {
    if (candidates.length === 0) {
      throw new Error("Empty i18n candidates")
    }
    if (languageIndex < candidates.length) {
      return candidates[languageIndex]
    }
    // return English text by default
    return candidates[0]
  }
})()
