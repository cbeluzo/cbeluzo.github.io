#!/usr/bin/env python3

from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parents[1]
TARGET_FILES = [
  ROOT / "index.html",
  ROOT / "admin" / "admin.html",
  ROOT / "admin" / "plano_negocios_modal_wizard_ifsp.html",
  ROOT / "gestao-ti" / "gestao-ti.html",
  ROOT / "gestao-ti" / "jogo_da_governanca" / "00_Jogo_da_Governanca.html",
  ROOT / "gestao-projetos" / "gestao-projetos.html",
  ROOT / "pesquisa" / "pesquisa.html",
  ROOT / "apresentacoes" / "apresentacoes.html",
  ROOT / "legacy" / "index.html",
  ROOT / "intro-adm" / "index.html",
  ROOT / "intro-adm" / "plano_negocios_modal_wizard_ifsp.html",
]
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


def validate_links() -> list[str]:
  errors: list[str] = []

  for html_file in TARGET_FILES:
    if not html_file.exists():
      errors.append(f"{html_file.relative_to(ROOT)}: arquivo esperado não encontrado")
      continue

    content = html_file.read_text(encoding="utf-8")
    parser = LinkExtractor()
    parser.feed(content)

    for raw_reference in parser.references:
      if not is_local_reference(raw_reference):
        continue

      target = resolve_reference(html_file, raw_reference)
      if not target.exists():
        relative_source = html_file.relative_to(ROOT)
        relative_target = Path(unquote(urlsplit(raw_reference).path))
        errors.append(f"{relative_source}: referência local ausente -> {relative_target}")

  return errors


def main() -> int:
  errors = validate_links()

  if errors:
    print("Falhas de validação encontradas:\n")
    for error in errors:
      print(f"- {error}")
    return 1

  print(f"Validação concluída com sucesso em {len(TARGET_FILES)} arquivos HTML.")
  return 0


if __name__ == "__main__":
  sys.exit(main())
