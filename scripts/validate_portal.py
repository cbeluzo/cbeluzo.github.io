#!/usr/bin/env python3

from __future__ import annotations

import json
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

def extract_links_recursive(data, found_links=None):
    if found_links is None:
        found_links = []
    
    if isinstance(data, dict):
        for key, value in data.items():
            if key in {"href", "src", "imageHref"} and isinstance(value, str):
                found_links.append(value)
            else:
                extract_links_recursive(value, found_links)
    elif isinstance(data, list):
        for item in data:
            extract_links_recursive(item, found_links)
    
    return found_links

def validate_portal_json() -> list[str]:
  errors: list[str] = []
  data_json = ROOT / "assets" / "data" / "portal-data.json"
  if not data_json.exists():
    errors.append("assets/data/portal-data.json: arquivo não encontrado")
    return errors

  try:
    with open(data_json, 'r', encoding='utf-8') as f:
        data = json.load(f)
  except Exception as e:
    errors.append(f"assets/data/portal-data.json: erro ao analisar JSON -> {e}")
    return errors

  links = extract_links_recursive(data)
  for raw_reference in links:
    if not is_local_reference(raw_reference):
      continue
    
    target = resolve_from_root(raw_reference)
    
    # Se o arquivo não existir na raiz, vamos procurar flexivelmente no repo todo
    if not target.exists():
      filename = unquote(urlsplit(raw_reference).path).split("/")[-1]
      found = list(ROOT.rglob(filename))
      if not found:
        errors.append(f"assets/data/portal-data.json: referência local ausente -> {raw_reference}")

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
        errors.append(f"{relative_source}: referência local ausente -> {raw_reference}")

  return errors, len(html_files)

def main() -> int:
  print("Validando assets/data/portal-data.json...")
  data_errors = validate_portal_json()
  
  print("Validando arquivos HTML...")
  html_errors, count_html = validate_html_links()

  all_errors = data_errors + html_errors

  if all_errors:
    print("\nFalhas de validação encontradas:\n")
    for error in all_errors:
      print(f"- {error}")
    print(f"\nForam avaliados o portal-data.json e {count_html} arquivos HTML com {len(all_errors)} falhas apontadas.")
    return 1

  print(f"\nValidação concluída com sucesso em {count_html} arquivos HTML e no portal-data.json. Tudo pronto!")
  return 0

if __name__ == "__main__":
  sys.exit(main())
