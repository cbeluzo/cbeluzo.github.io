#!/usr/bin/env python3

from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]
IGNORED_PREFIXES = ("http://", "https://", "mailto:", "tel:", "javascript:", "data:", "//", "#")

class LinkExtractor(HTMLParser):
  def __init__(self) -> None:
    super().__init__()
    self.references: list[str] = []

  def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
    for name, value in attrs:
      if name in {"href", "src"} and value:
        self.references.append(value)

def is_local_reference(value: str) -> bool:
  return not value.startswith(IGNORED_PREFIXES)

def resolve_reference(source_file: Path, raw_reference: str) -> Path:
  parsed = urlsplit(raw_reference)
  reference_path = unquote(parsed.path)
  return (source_file.parent / reference_path).resolve()

def resolve_from_root(raw_reference: str) -> Path:
  parsed = urlsplit(raw_reference)
  reference_path = unquote(parsed.path)
  # portal-data.js links are usually relative from ROOT
  if reference_path.startswith("./"):
      reference_path = reference_path[2:]
  elif reference_path.startswith("/"):
      reference_path = reference_path[1:]
  return (ROOT / reference_path).resolve()

def get_html_files() -> list[Path]:
  all_html = []
  for path in ROOT.rglob("*.html"):
    if ".git" in path.parts or "node_modules" in path.parts:
      continue
    all_html.append(path)
  return all_html

def validate_portal_data() -> list[str]:
  errors: list[str] = []
  data_js = ROOT / "assets" / "js" / "portal-data.js"
  if not data_js.exists():
    errors.append("assets/js/portal-data.js: arquivo de configuração não encontrado")
    return errors

  content = data_js.read_text(encoding="utf-8")
  # Matches href: "link" or src: "link" or imageHref: "link" etc
  # We'll just look for href, url, path, nav items
  matches = re.finditer(r'(?:href|src|imageHref)\s*:\s*["\']([^"\']+)["\']', content)
  for match in matches:
    raw_reference = match.group(1)
    if not is_local_reference(raw_reference):
      continue
    
    target = resolve_from_root(raw_reference)
    
    # Se o arquivo não existir na raiz, vamos procurar flexivelmente no repo todo
    # pq o portal-data.js define links baseados na página em que será carregado
    if not target.exists():
      filename = unquote(urlsplit(raw_reference).path).split("/")[-1]
      found = list(ROOT.rglob(filename))
      if not found:
        errors.append(f"assets/js/portal-data.js: referência local ausente -> {raw_reference} (avaliada flexivelmente)")

  return errors

def validate_html_links() -> tuple[list[str], int]:
  errors: list[str] = []
  html_files = get_html_files()
  
  for html_file in html_files:
    content = html_file.read_text(encoding="utf-8")
    parser = LinkExtractor()
    parser.feed(content)

    for raw_reference in parser.references:
      if not is_local_reference(raw_reference):
        continue

      target = resolve_reference(html_file, raw_reference)
      if not target.exists():
        relative_source = html_file.relative_to(ROOT)
        
        target_disp = target.relative_to(ROOT) if target.is_relative_to(ROOT) else str(target)
        try:
          target_disp = Path(unquote(urlsplit(raw_reference).path))
        except Exception:
          pass

        errors.append(f"{relative_source}: referência local ausente -> {target_disp}")

  return errors, len(html_files)

def main() -> int:
  print("Validando assets/js/portal-data.js...")
  data_errors = validate_portal_data()
  
  print("Validando arquivos HTML...")
  html_errors, count_html = validate_html_links()

  all_errors = data_errors + html_errors

  if all_errors:
    print("\nFalhas de validação encontradas:\n")
    for error in all_errors:
      print(f"- {error}")
    print(f"\nForam avaliados o portal-data.js e {count_html} arquivos HTML com {len(all_errors)} falhas apontadas.")
    return 1

  print(f"\nValidação concluída com sucesso em {count_html} arquivos HTML e no portal-data.js. Tudo pronto!")
  return 0

if __name__ == "__main__":
  sys.exit(main())
