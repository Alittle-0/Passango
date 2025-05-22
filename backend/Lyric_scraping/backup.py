from lyricsgenius import Genius
import re
from time import sleep

#Set up genius API
genius = Genius("x3bp80DR14IGGAp5wrM02u38x3z4iQ1N42G5Hi0SMuuGYefK7CBcLw7nQdU7dFPI", timeout=15, retries=3)

#backup lyrics
def backup_lyrics(artist, song, delay=2) -> str:
    """ Backup lyrics using Genius API. """
    try:
        # Add delay before fetching lyrics
        sleep(delay)
        
        # Search for the song
        song_inf = genius.search_song(song, artist)
        
        # Check if the song was found
        if song_inf is None:
            return "Song not found"

        # Get the lyrics
        lyrics = song_inf.lyrics
        
        # Remove section headers using regex
        cleaned_lyrics = re.sub(r'\[.*?\]', '', lyrics)
        
        # Remove extra blank lines
        cleaned_lyrics = re.sub(r'\n\s*\n', '\n\n', cleaned_lyrics)
        
        # Return the lyrics
        return cleaned_lyrics
    
    except Exception as e:
        return str(e)
