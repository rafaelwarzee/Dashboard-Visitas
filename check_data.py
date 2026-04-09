import pandas as pd
import traceback

def check_sheet(name, sheet_id, gid=None):
    if gid is not None:
        url = f'https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv&gid={gid}'
    else:
        url = f'https://docs.google.com/spreadsheets/d/{sheet_id}/export?format=csv'
    
    print(f"\n--- Checking {name} ---")
    print(f"URL: {url}")
    try:
        df = pd.read_csv(url)
        print(f"Success! Shape: {df.shape}")
        print("Columns:", df.columns.tolist())
        print("Head:")
        print(df.head())
    except Exception as e:
        print(f"Failed to read. Error: {e}")
        # traceback.print_exc()

check_sheet("Web Scraping Source (ID 1)", "1eoxb8h94yJKcCiQh12CMnhelr44cKS26KlVk0LzdrGk", "0")
check_sheet("Planilha Source (ID 2)", "1vWHXdrgN6JUstWk6g5cXuLJwYJRkniObUcFgBMs4108", "0")

