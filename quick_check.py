import pandas as pd
import urllib.request
import io

def quick_check(doc_id):
    url = f"https://docs.google.com/spreadsheets/d/{doc_id}/export?format=xlsx"
    print(f"\nChecking {doc_id}...")
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            file_content = response.read()
            xls = pd.ExcelFile(io.BytesIO(file_content))
            for sheet in xls.sheet_names:
                df = pd.read_excel(io.BytesIO(file_content), sheet_name=sheet, nrows=2)
                print(f"Tab: {sheet}, Found Cols: {df.columns.tolist()}")
    except Exception as e:
        print(f"Error: {e}")

quick_check('1vWHXdrgN6JUstWk6g5cXuLJwYJRkniObUcFgBMs4108')
quick_check('1eoxb8h94yJKcCiQh12CMnhelr44cKS26KlVk0LzdrGk')
