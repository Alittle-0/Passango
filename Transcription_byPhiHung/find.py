import requests
from bs4 import BeautifulSoup
import re
from Vietnamese import INVALID_CHARACTERS, VIETNAMESE_DIACRITIC_MAP


def find_artist_by_song(song_name: str) -> str:
    # Format song name for search URL (lowercase, remove special chars)
    song_query = song_name.lower().replace(" ", "+")
    for accented, plain in VIETNAMESE_DIACRITIC_MAP.items():
            song_query = song_query.replace(accented, plain)
    for c in INVALID_CHARACTERS:
        song_query = song_query.replace(c, "")
    url = f"https://search.azlyrics.com/search.php?q={song_query}&x=07e96f882047523bba2ec9295d37161dd2b31be0fbb0740f46a7be9b4f6b14e7"
    
    # Send request with a user-agent to avoid being blocked
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
    }
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Check for request errors
        dom = BeautifulSoup(response.text, "html.parser")

        # Find the first search result (usually a table row with song info)
        parent_div = dom.find("div", class_="col-xs-12 col-sm-10 col-sm-offset-1 col-md-8 col-md-offset-2 text-center")
        if not parent_div:
            return f"Error: {str(e)}"
        
        result = parent_div.find("td", class_ = "text-left visitedlyr")
        URL = result.find("a")
        
        if result:
            # Extract artist from the link text or nearby elements
            artist = result.find("b").find_next("b").text
            return artist
        return "Song or artist not found"
    except Exception as e:
        return f"Error: {str(e)}"