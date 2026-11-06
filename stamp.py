"""Cache-busting: stamp a short content hash onto every CSS/JS link in index.html.

GitHub Pages lets browsers keep files for 10 minutes, so after a deploy phones can
show the old site. Run this before each commit; a changed file gets a new ?v= value
and browsers fetch it at once.  Usage:  python stamp.py
"""
import hashlib, io, os, re

ROOT = os.path.dirname(os.path.abspath(__file__))
html_path = os.path.join(ROOT, 'index.html')
html = io.open(html_path, encoding='utf-8').read()


def stamp(match):
    attr, path = match.group(1), match.group(2)
    with open(os.path.join(ROOT, path), 'rb') as f:
        v = hashlib.sha1(f.read()).hexdigest()[:8]
    return f'{attr}="{path}?v={v}"'


new = re.sub(r'(href|src)="((?:assets/)?[\w./-]+\.(?:css|js))(?:\?v=\w+)?"', stamp, html)
if new != html:
    io.open(html_path, 'w', encoding='utf-8').write(new)
for m in re.finditer(r'(?:href|src)="([\w./-]+\.(?:css|js)\?v=\w+)"', new):
    print(m.group(1))
