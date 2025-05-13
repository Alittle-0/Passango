from Lyric_scraping.Vietnamese import INVALID_CHARACTERS, VIETNAMESE_DIACRITIC_MAP, SPECIAL_CHARACTERS

def parse(s: str) -> str:
    out = s.lower().replace(" ", "")
    for accented, plain in VIETNAMESE_DIACRITIC_MAP.items():
        out = out.replace(accented, plain)
    for c in INVALID_CHARACTERS:
        out = out.replace(c, "")
    for accented, plain in SPECIAL_CHARACTERS.items():  
        out = out.replace(accented, plain)
    return out

    