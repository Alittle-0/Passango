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
            print(self.url())
            response = requests.get(self.url(), timeout=100)
            if not response.ok:
                print(self.url())
                return f"Failed to fetch lyric. Status code: {response.status_code}"
            else:
                lyric = self._scrape_lyric_(response)
                return lyric if lyric else "No lyric found."
        except requests.RequestException as e:
            return f"Error fetching lyric: {e}"
    
    def _scrape_lyric_(self, r: Response) -> str:
        r.encoding = 'utf-8'
        dom = BeautifulSoup(r.text, "html.parser")
        body = dom.body
        divs = body.find_all("div", {"class": "col-xs-12 col-lg-8 text-center"})[0]
        
        target = {0:0}
        
        for i, d in enumerate(divs):
            try:
                query = d.find_all("br")
                n_br = len(query)
                if n_br > list(target.values())[0]:
                    target = {i:n_br}
            except:
                pass
        
        target = list(target.keys())[0]
        lyric = list(divs.children)[target].text
        
        return lyric
#################################################################################
