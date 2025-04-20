from bs4 import BeautifulSoup

#################################################################################

def html(html_path: str, lyric: str, song: str, artist: str) -> None:
    """Read HTML file, replace placeholder lyric, and save new file."""
    try:
        # Read the original HTML
        with open(html_path, "r", encoding="utf-8") as f:
            html = f.read()
        
        # Parse HTML with BeautifulSoup
        dom = BeautifulSoup(html, 'html.parser')
        
        # Find the <div class="lyric-script">
        lyric_div = dom.find("div", class_="lyric-script")
        if not lyric_div:
            print("Error: div containing lyric not found in HTML.")
            return
        
        # Update the title in <h1>
        song_name = lyric_div.find("h1")
        if not song_name:
            print("Error: <h1> tag not found in <div class='lyric-script'>.")
            return
        song_name.string = f"{song} by {artist}"
        
        # Update <p> with lyrics
        script = lyric_div.find("p")
        if not script:
            print("Error: <p> tag not found.")
            return
        script.string = lyric
        
        # Save the modified HTML
        output_path = "lyrics.html"
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(str(dom))
        print(f"Updated HTML saved to {output_path}")
        
    except FileNotFoundError:
        print(f"Error: HTML file at {html_path} not found.")
    except Exception as e:
        print(f"Error updating HTML: {e}")  
        
#################################################################################
