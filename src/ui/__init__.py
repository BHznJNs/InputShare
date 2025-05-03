from utils import script_abs_path

script_path = script_abs_path(__file__)
ICON_ICO_PATH = script_path.joinpath("../assets/icon.ico")
ICON_PNG_PATH = script_path.joinpath("../assets/icon.png")

CONNECT_PAGE_PATH = script_path.joinpath("./frontend-dist/connect.html")
SETTINGS_PAGE_PATH = script_path.joinpath("./frontend-dist/settings.html")
