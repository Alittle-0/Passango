import requests
from bs4 import BeautifulSoup
from requests import Response
import re
from Vietnamese import INVALID_CHARACTERS, VIETNAMESE_DIACRITIC_MAP

#################################################################################

class Lyric:
    """
    
    Take scrape lyric from:
        www.azlyrics.com
        
    """

    def __init__(self, artist: str, song: str):
        self.artist = artist
        self.song = song
    
    def url(self) -> str:
        """Generate the AZLyrics URL for the song."""
        return "https://www.azlyrics.com/lyrics/{}/{}.html"\
            .format(self._parse_(self.artist), self._parse_(self.song))
            
    def _parse_(self, s: str) -> str:
        out = s.lower().replace(" ", "")
        for accented, plain in VIETNAMESE_DIACRITIC_MAP.items():
            out = out.replace(accented, plain)
        for c in INVALID_CHARACTERS:
            out = out.replace(c, "")
        return out
            
    def scrape(self) -> str:
        """Scrape and return the lyric from AZLyrics."""
        try:
            # Fetch the webpage
            response = requests.get(self.url(), timeout=100)
            if not response.ok:
                return f"Failed to fetch lyric. Status code: {response.status_code}"
            else:
                lyric = self._scrape_lyric_(response)
                return lyric if lyric else "No lyric found."
        except requests.RequestException as e:
            return f"Error fetching lyric: {e}"
    
    def _scrape_lyric_(self, r: Response) -> str:
        r.encoding = 'utf-8'
        dom = BeautifulSoup(r.text, "html.parser")
        
        # Updated selector to match current AZLyrics structure
        # The lyrics are typically in a div without a class but after specific comment markers
        try:
            # Look for the lyrics div - it's usually between specific comment markers
            lyrics_divs = dom.find_all("div", class_=None)
            
            for div in lyrics_divs:
                # Check if this is the lyrics div - it's usually preceded by comments
                prev = div.previous_sibling
                if prev and isinstance(prev, str) and "Usage of azlyrics.com content" in prev:
                    # Clean and return lyrics
                    lyrics = div.get_text().strip()
                    return lyrics
            
            # Alternative method - try to find the lyrics container
            content_div = dom.find("div", class_="ringtone")
            if content_div:
                lyrics_div = content_div.find_next("div")
                if lyrics_div:
                    lyrics = lyrics_div.get_text().strip()
                    return lyrics
                
            # If still not found, try another common pattern
            main_div = dom.find("div", class_="main-page")
            if main_div:
                lyrics_divs = main_div.find_all("div")
                for div in lyrics_divs:
                    if div.get_text().strip() and not div.get("class"):
                        return div.get_text().strip()
            
            return "No lyric found."
            
        except Exception as e:
            return f"Error parsing lyric: {e}"
#################################################################################
