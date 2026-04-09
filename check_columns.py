import pandas as pd
import urllib.request
import io
import json

def analyze_columns(doc_id, sheet_name):
    url = f"https://docs.google.com/spreadsheets/d/{doc_id}/export?format=xlsx"
    results = {}
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response:
            file_content = response.read()
            xls = pd.ExcelFile(io.BytesIO(file_content))
            
            if sheet_name in xls.sheet_names:
                df = pd.read_excel(io.BytesIO(file_content), sheet_name=sheet_name)
                cols = df.columns.tolist()
                results['columns'] = cols
                
                target_cols = ['Receita / Visitas', 'Order', 'Visitas', 'Revenue']
                results['analysis'] = {}
                for tc in target_cols:
                    matches = [col for col in cols if tc.lower() in str(col).lower()]
                    results['analysis'][tc] = {
                        'found': len(matches) > 0,
                        'matches': matches
                    }
                
                results['sample'] = df.head(2).to_dict(orient='records')
            else:
                results['error'] = f"Sheet '{sheet_name}' not found"

    except Exception as e:
        results['error'] = str(e)
    
    with open('column_analysis.json', 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, ensure_ascii=False)

analyze_columns('1vWHXdrgN6JUstWk6g5cXuLJwYJRkniObUcFgBMs4108', 'Semana')
