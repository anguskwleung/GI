"""Export a self-contained HTML; no third party dependencies required."""
import base64
from pathlib import Path
import sys

root = Path(__file__).resolve().parent
html = (root / 'index.html').read_text()
html = html.replace('<link rel="stylesheet" href="workspace.css">', '<style>' + (root / 'workspace.css').read_text() + '</style>')
html = html.replace('<script src="workspace.js"></script>', '<script>' + (root / 'workspace.js').read_text() + '</script>')
# New product links are rendered by JS. Convert their relative URLs to Blob URLs
# on click, so PDF navigation also works from a local standalone HTML.
pdfs = {}
for file in (root / 'documents').glob('*.pdf'):
    pdfs['documents/' + file.name] = base64.b64encode(file.read_bytes()).decode()
import json
loader = '''<script>(()=>{const files=FILES;const urls={};document.addEventListener('click',e=>{const a=e.target.closest('a');if(!a)return;const path=a.getAttribute('href');if(!files[path])return;if(!urls[path]){const bytes=Uint8Array.from(atob(files[path]),c=>c.charCodeAt(0));urls[path]=URL.createObjectURL(new Blob([bytes],{type:'application/pdf'}));}a.href=urls[path];});})();</script>'''.replace('FILES',json.dumps(pdfs))
html = html.replace('</body>', loader + '</body>')
destination = Path(sys.argv[1]) if len(sys.argv)>1 else root.parent / 'Insurance_Quote_Tool.html'
destination.write_text(html)
print(destination)
