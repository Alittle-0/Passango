from Lyric_scraping.scrape_lyric import Lyric

def process_AZlyric(song_title: str, artist: str) -> str:
    service = Lyric(artist, song_title)
    lyric = service.scrape()
    return lyric