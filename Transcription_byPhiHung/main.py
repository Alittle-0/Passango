from test import Lyric
from reset import html

def main():

    song = input("Song: ")
    artist = input("Artist: ")
    service = Lyric(artist, song)
    lyric = service.scrape()
    
    if not lyric.startswith("Error") and not lyric.startswith("Failed") and lyric != "No lyric found.":
        # Assuming basic.html is in the same directory
        html_path = "Transcription_byPhiHung/basic.html"
        html(html_path, lyric, song, artist)
    else:
        print(lyric)

if __name__ == "__main__":
    main()
