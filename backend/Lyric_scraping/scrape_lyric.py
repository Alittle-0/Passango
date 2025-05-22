import requests
from bs4 import BeautifulSoup
from requests import Response
from Lyric_scraping.parse import parse

#################################################################################

class Lyric:
    """
    
    Take scrape lyric from:
        www.azlyrics.com
        
    """

    def __init__(self, artist: str, song: str):
        self.artist = parse(artist)
        self.song = parse(song)
    
    def url(self) -> str:
        """Generate the AZLyrics URL for the song."""
        
        return "https://www.azlyrics.com/lyrics/{}/{}.html"\
            .format(self.artist, self.song)
            
    def scrape(self) -> str:
        """Scrape and return the lyric from AZLyrics."""
        try:
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
        
        # The lyrics are typically in a div without a class but after specific comment markers
        try:
            # Look for the lyrics div
            lyrics_divs = dom.find_all("div", class_=None)
            
            for div in lyrics_divs:
                # Check if this is the lyrics div
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
