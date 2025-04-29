from typing import TypeVar
from utils import CHINESE_LANGUAGE, ENGLISH_LANGUAGE

class I18n:
    Candidate = TypeVar("Candidate")

    def __init__(self) -> None:
        from utils.config_manager import get_config
        user_language = get_config().language
        if   user_language == ENGLISH_LANGUAGE: self.language_index = 0
        elif user_language == CHINESE_LANGUAGE: self.language_index = 1
        else: self.language_index = 0

    def __call__(self, candidates: list[Candidate]) -> Candidate:
        if len(candidates) == 0:
            raise IndexError("Empty i18n candidates")
        if self.language_index < len(candidates):
            return candidates[self.language_index]
        return candidates[0] # return English text

__i18n_instance: I18n | None = None
def get_i18n() -> I18n:
    global __i18n_instance
    if __i18n_instance is None:
        __i18n_instance = I18n()
    return __i18n_instance
