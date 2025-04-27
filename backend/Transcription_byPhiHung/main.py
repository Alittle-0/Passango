from Transcription_byPhiHung.scrape_lyric import Lyric
from Transcription_byPhiHung.find import find_artist_by_song

def main(song_title: str) -> tuple[str, str, str]:

    # Get the current script directory
    
    artist, song = find_artist_by_song(song_title)
    
    if artist and song:  # Only proceed if artist and song are non-empty
        service = Lyric(artist, song)
        lyric = service.scrape()

        return (artist, song, lyric)
    else:
        return ("", "", "")

