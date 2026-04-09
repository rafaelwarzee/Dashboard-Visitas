import pandas as pd
import urllib.request
import io
import json

def get_tabs(doc_id):
    url = f"https://docs.google.com/spreadsheets/d/{doc_id}/export?format=xlsx"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            file_content = response.read()
            xls = pd.ExcelFile(io.BytesIO(file_content))
            print(f"-- TABS FOR {doc_id} --")
            print(json.dumps(xls.sheet_names, indent=2))
            
            # Print the first few columns of the first tab to understand structure
            print("\nHeader of first tab:", xls.sheet_names[0])
            df = pd.read_excel(io.BytesIO(file_content), sheet_name=xls.sheet_names[0])
            print(df.columns.tolist())
            print(df.head(2))

    except Exception as e:
        print(f"Failed for {doc_id}: {e}")

print("Checking 1vWHXdrgN6JUstWk6g5cXuLJwYJRkniObUcFgBMs4108 (URL Planilha)")
get_tabs('1vWHXdrgN6JUstWk6g5cXuLJwYJRkniObUcFgBMs4108')

print("\nChecking 1eoxb8h94yJKcCiQh12CMnhelr44cKS26KlVk0LzdrGk (URL Scraping)")
get_tabs('1eoxb8h94yJKcCiQh12CMnhelr44cKS26KlVk0LzdrGk')
