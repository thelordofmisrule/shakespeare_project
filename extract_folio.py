#!/usr/bin/env python3
"""
extract_folio.py
----------------
Convert Bodleian First-Folio TEI to JSON, one file per play.

This version fixes:
  • decorated capitals + spacing
  • duplicated “SO … O …” bug
  • punctuation-gluing after <hi>
  • missing italics + glosses
  • **NEW:** characters list is always populated
"""

from __future__ import annotations
import json, pathlib, re, sys, xml.etree.ElementTree as ET

NS = {"tei": "http://www.tei-c.org/ns/1.0"}
WS_RE = re.compile(r"\s+")

def clean(txt: str | None) -> str:
    return WS_RE.sub(" ", txt or "").strip()

def strip_ns(tag: str) -> str:
    return tag.split("}", 1)[-1]

PUNCT = set(",.;:!?)]}")
def starts_with_punct(txt: str) -> bool:
    return bool(txt.lstrip() and txt.lstrip()[0] in PUNCT)

# ------------------------------------------------------------------ #
# inline element handling                                            #
# ------------------------------------------------------------------ #

def handle_choice(node: ET.Element, glosses: list[dict]) -> str:
    corr = clean(node.findtext("tei:corr", "", NS))
    orig = clean(node.findtext("tei:orig", "", NS))
    if orig or corr:
        glosses.append({"orig": orig, "corr": corr})
    return corr or orig

def flatten_plain(node: ET.Element, glosses: list[dict]) -> str:
    out = []
    if node.text:
        out.append(node.text)
    for ch in node:
        tag = strip_ns(ch.tag)
        if tag == "lb":
            out.append(" ")
        elif tag == "choice":
            out.append(handle_choice(ch, glosses))
        elif tag == "hi":
            out.append(flatten_plain(ch, glosses))
        elif tag == "c":
            out.append(ch.text or "")
        else:
            out.append(flatten_plain(ch, glosses))
        if ch.tail:
            out.append(ch.tail)
    return "".join(out)

def extract_line_text(line: ET.Element) -> tuple[str, list[dict] | None]:
    tokens, glosses = [], []

    def add(txt: str | None, *, glue=False):
        frag = clean(txt)
        if frag:
            if glue and tokens:
                tokens[-1] += frag
            else:
                tokens.append(frag)

    def visit(node: ET.Element):
        tag = strip_ns(node.tag)
        if tag == "lb":
            add(" "); return
        if tag == "c":                       # decorated capital
            add((node.text or "") + (node.tail or ""))
            return
        if tag == "choice":
            add(handle_choice(node, glosses))
        elif tag == "hi":
            ital = flatten_plain(node, glosses)
            add(f"{{% italic: {clean(ital)} %}}")
        else:
            if node.text: add(node.text)
            for ch in node: visit(ch)
        if node.tail: add(node.tail, glue=starts_with_punct(node.tail))

    if line.text: add(line.text)
    for ch in line: visit(ch)

    return clean(" ".join(tokens)), (glosses or None)

def iter_lines(scene: ET.Element) -> list[dict]:
    out = []
    for sp in scene.findall(".//tei:sp", NS):
        speaker = clean(sp.findtext("tei:speaker", "", NS))
        for l in sp.findall(".//tei:l", NS) + sp.findall(".//tei:p", NS):
            txt, gloss = extract_line_text(l)
            if txt:
                out.append({"n": l.get("n", ""), "speaker": speaker,
                            "text": txt, "glosses": gloss})
    return out

# ------------------------------------------------------------------ #
# CHANGE A  –  robust character list                                 #
# ------------------------------------------------------------------ #
def extract_characters(root: ET.Element) -> list[dict]:
    chars = []
    for person in root.findall(".//tei:listPerson/tei:person", NS):
        pid = person.get("{http://www.w3.org/XML/1998/namespace}id") or ""
        # preferred 'standard', else first persName text
        std_name = next(
            (clean(p.text) for p in person.findall("tei:persName", NS)
             if p.get("type") in (None, "standard", "reg", "full") and clean(p.text)),
            ""
        )
        forms = {
            clean(p.text)
            for p in person.findall("tei:persName", NS)
            if p.get("type") not in ("standard", "reg", "full") and clean(p.text)
        }
        chars.append(
            {"id": pid or None,
             "name": std_name or None,
             "forms": sorted(forms) or None}
        )
    return chars

# ------------------------------------------------------------------ #
# play-level                                                          #
# ------------------------------------------------------------------ #
def process(xml_path: pathlib.Path) -> dict:
    root = ET.parse(xml_path).getroot()
    play_id = xml_path.stem.split("-", 1)[-1]
    title = clean(root.findtext(".//tei:titleStmt/tei:title[@type='statement']", "", NS))

    # CHANGE B
    characters = extract_characters(root)

    lines = []
    for scene in root.findall(".//tei:div[@type='scene']", NS):
        lines.extend(iter_lines(scene))

    return {"id": play_id, "title": title,
            "characters": characters, "lines": lines}

# ------------------------------------------------------------------ #
# main                                                               #
# ------------------------------------------------------------------ #
def main():
    raw_dir = pathlib.Path("firstfolio/raw")
    out_dir = pathlib.Path("firstfolio/json")
    out_dir.mkdir(parents=True, exist_ok=True)

    for xml in sorted(raw_dir.glob("F-*.xml")):
        data = process(xml)
        out_path = out_dir / f"{data['id']}.json"
        out_path.write_text(json.dumps(data, indent=2, ensure_ascii=False),
                            encoding="utf-8")
        print(f"Wrote {out_path}")

if __name__ == "__main__":
    sys.exit(main())
