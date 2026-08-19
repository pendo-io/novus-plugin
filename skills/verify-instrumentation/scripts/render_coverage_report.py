#!/usr/bin/env python3
"""Render a self-contained HTML tagging coverage report from JSON."""

from __future__ import annotations

import argparse
import html
import json
from pathlib import Path
from typing import Any


def esc(value: Any) -> str:
    return html.escape(str(value if value is not None else ""), quote=True)


def num(value: Any) -> str:
    return f"{int(value):,}"


def pct(value: Any) -> str:
    if value is None:
        return "Unavailable"
    return f"{float(value):.1f}%"


def validate(data: dict[str, Any]) -> None:
    required = (
        "meta", "summary", "types", "gaps", "tagsNotInMemory",
        "configuredNotObserved", "limitations", "nextAction",
    )
    for field in required:
        if field not in data:
            raise ValueError(f"Missing required field: {field}")

    meta = data["meta"]
    for field in (
        "appName", "scope", "scopeType", "windowStart", "windowEnd",
        "coverageLabel", "memorySections", "dataSources",
    ):
        if field not in meta:
            raise ValueError(f"Missing required field: meta.{field}")

    summary = data["summary"]
    fields = (
        "memoryCoverage", "taggedMemorySurfaces", "memorySurfaces",
        "trafficCoverage", "recognizedEvents", "meaningfulEvents",
    )
    for field in fields:
        if field not in summary:
            raise ValueError(f"Missing required field: summary.{field}")
    for field in ("memoryCoverage", "trafficCoverage"):
        if summary[field] is not None and not 0 <= float(summary[field]) <= 100:
            raise ValueError(f"summary.{field} must be between 0 and 100")
    if int(summary["taggedMemorySurfaces"]) > int(summary["memorySurfaces"]):
        raise ValueError("taggedMemorySurfaces cannot exceed memorySurfaces")
    if int(summary["recognizedEvents"]) > int(summary["meaningfulEvents"]):
        raise ValueError("recognizedEvents cannot exceed meaningfulEvents")


def bar(
    label: str,
    percent: Any,
    recognized: Any,
    total: Any,
    traffic: bool = False,
    nouns: tuple[str, str] = ("recognized", "observed"),
) -> str:
    if percent is None:
        return f"""
        <div class="meter unavailable">
          <div class="meter-label"><span>{esc(label)}</span><strong>Unavailable</strong></div>
          <div class="bar" aria-label="{esc(label)} unavailable"><span style="width:0%"></span></div>
          <small>No reliable traffic denominator</small>
        </div>"""
    value = max(0.0, min(100.0, float(percent)))
    css = "bar traffic" if traffic else "bar"
    return f"""
    <div class="meter">
      <div class="meter-label"><span>{esc(label)}</span><strong>{pct(value)}</strong></div>
      <div class="{css}" role="progressbar" aria-label="{esc(label)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="{value:.1f}"><span style="width:{value:.1f}%"></span></div>
      <small>{num(recognized)} {esc(nouns[0])} / {num(total)} {esc(nouns[1])}</small>
    </div>"""


def type_card(item: dict[str, Any]) -> str:
    label = str(item.get("type", "Type"))
    return f"""
    <article class="type-card">
      <div class="type-title"><span>{esc(label[:1].upper())}</span><h3>{esc(label)}</h3></div>
      {bar('Memory alignment', item.get('memoryCoverage'), item.get('taggedMemorySurfaces', 0), item.get('memorySurfaces', 0), nouns=('tagged', 'expected'))}
      {bar('Traffic coverage', item.get('trafficCoverage'), item.get('recognizedEvents', 0), item.get('meaningfulEvents', 0), True)}
    </article>"""


def traffic_note(item: dict[str, Any]) -> str:
    count = int(item.get("eventCount", 0) or 0)
    share = float(item.get("trafficShare", 0) or 0)
    if count or share:
        return f"<strong>{num(count)} events · {pct(share)}</strong>"
    return '<strong class="muted">No traffic evidence</strong>'


def gap_card(item: dict[str, Any]) -> str:
    priority = str(item.get("priority", "Medium"))
    return f"""
    <article class="gap-card {esc(priority.lower())}">
      <div class="gap-meta"><div><span class="pill">{esc(priority)}</span><span class="kind">{esc(item.get('type', 'Surface'))}</span><span class="evidence">{esc(item.get('evidenceSource', 'Memory'))}</span></div>{traffic_note(item)}</div>
      <h3>{esc(item.get('surface', 'Unnamed surface'))}</h3>
      <p class="muted">{esc(item.get('context', ''))} · {esc(item.get('state', 'Unmatched'))}</p>
      <p>{esc(item.get('evidence', 'No evidence note supplied.'))}</p>
      <dl><dt>Repair</dt><dd>{esc(item.get('repair', 'Needs focused investigation.'))}</dd><dt>Proof</dt><dd>{esc(item.get('proof', 'Repeat the same path and confirm recognition.'))}</dd></dl>
    </article>"""


def render(data: dict[str, Any]) -> str:
    meta, summary = data["meta"], data["summary"]
    types = "".join(type_card(item) for item in data["types"])
    gaps = "".join(gap_card(item) for item in data["gaps"]) or '<div class="empty">No memory- or traffic-backed tagging gaps were supplied.</div>'
    memory_rows = "".join(
        f"<tr><td><span class='kind'>{esc(item.get('type', 'Surface'))}</span></td><td><b>{esc(item.get('surface', 'Unnamed surface'))}</b></td><td><code>{esc(item.get('definition', ''))}</code></td><td>{esc(item.get('note', 'Review memory alignment; absence from memory is not proof of staleness.'))}</td></tr>"
        for item in data["tagsNotInMemory"]
    ) or '<tr><td colspan="4" class="empty">No tags outside the checked memory surface were supplied.</td></tr>'
    quiet_rows = "".join(
        f"<tr><td><span class='kind'>{esc(item.get('type', 'Surface'))}</span></td><td><b>{esc(item.get('surface', 'Unnamed surface'))}</b></td><td><code>{esc(item.get('definition', ''))}</code></td><td>{esc(item.get('note', 'Configured, not observed in this window.'))}</td></tr>"
        for item in data["configuredNotObserved"]
    ) or '<tr><td colspan="4" class="empty">No configured-but-unobserved tags supplied.</td></tr>'
    limits = "".join(f"<li>{esc(item)}</li>" for item in data["limitations"]) or "<li>No limitations supplied.</li>"
    sources = " · ".join(esc(item) for item in meta.get("dataSources", [])) or "Sources not supplied"
    memory_sections = " · ".join(esc(item) for item in meta.get("memorySections", [])) or "Memory sections not supplied"
    traffic_available = summary.get("trafficCoverage") is not None
    traffic_description = (
        f"{num(summary['recognizedEvents'])} of {num(summary['meaningfulEvents'])} meaningful event occurrences recognized"
        if traffic_available else "No reliable traffic denominator was available"
    )
    traffic_window = (
        f"{esc(meta.get('windowStart', ''))}<br>through {esc(meta.get('windowEnd', ''))}"
        if meta.get("windowStart") and meta.get("windowEnd") else "Traffic window unavailable"
    )

    return f"""<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Tagging coverage · {esc(meta['scope'])}</title>
<style>
:root{{--ink:#17241f;--muted:#68756f;--paper:#f3f1ea;--card:#fffdf8;--line:#dbddd5;--green:#187557;--green2:#78c3a0;--blue:#3678b9;--red:#b94a3d;--amber:#c77a1f;--shadow:0 14px 38px rgba(26,39,33,.08)}}
*{{box-sizing:border-box}}body{{margin:0;background:var(--paper);color:var(--ink);font:15px/1.5 Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}}main{{max-width:1180px;margin:auto;padding:48px 28px 70px}}
header{{display:flex;justify-content:space-between;align-items:flex-end;gap:28px;margin-bottom:28px}}.eyebrow{{color:var(--green);font-size:12px;font-weight:850;letter-spacing:.14em;text-transform:uppercase}}h1{{font-size:clamp(36px,5vw,62px);line-height:1;letter-spacing:-.045em;margin:7px 0 12px}}h2{{font-size:27px;letter-spacing:-.025em;margin:0}}h3{{margin:0}}.muted,.subtitle{{color:var(--muted)}}
.scope{{min-width:260px;background:var(--ink);color:white;border-radius:18px;padding:18px 20px;box-shadow:var(--shadow)}}.scope b{{display:block;font-size:18px}}.scope span{{color:#cad5d0;font-size:13px}}
.hero{{display:grid;grid-template-columns:1fr 1fr;gap:18px}}.score{{background:var(--card);border:1px solid var(--line);border-radius:23px;padding:25px;box-shadow:var(--shadow);min-width:0}}.score-head{{display:flex;justify-content:space-between;gap:12px}}.big{{font-size:52px;font-weight:880;letter-spacing:-.055em;line-height:1;margin-top:6px}}.score>p{{color:var(--muted);margin:8px 0 18px}}
.meter+.meter{{margin-top:18px}}.meter-label{{display:flex;justify-content:space-between;margin-bottom:8px}}.bar{{height:12px;background:#e4e6e0;border-radius:999px;overflow:hidden}}.bar span{{display:block;height:100%;background:linear-gradient(90deg,var(--green),var(--green2));border-radius:inherit}}.bar.traffic span{{background:linear-gradient(90deg,var(--blue),#7eb0d9)}}.meter small{{display:block;color:var(--muted);margin-top:7px}}.meter.unavailable{{opacity:.68}}
.type-grid{{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin:18px 0 42px}}.type-card{{background:rgba(255,253,248,.72);border:1px solid var(--line);border-radius:19px;padding:21px}}.type-title{{display:flex;gap:10px;align-items:center;margin-bottom:20px}}.type-title>span{{display:grid;place-items:center;width:34px;height:34px;border-radius:10px;background:#dcece4;color:var(--green);font-weight:850}}
.section-head{{display:flex;align-items:center;justify-content:space-between;margin:42px 0 16px}}.count,.kind,.pill,.evidence{{display:inline-block;border-radius:999px;padding:4px 9px;background:#e6e8e2;color:var(--muted);font-size:11px;font-weight:800;letter-spacing:.05em;text-transform:uppercase}}.pill{{background:#f8e3d8;color:#94392d;margin-right:7px}}.evidence{{background:#dfeaf5;color:#285f91;margin-left:7px}}
.gap-grid{{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}}.gap-card{{background:var(--card);border:1px solid var(--line);border-left:5px solid var(--amber);border-radius:17px;padding:20px;box-shadow:0 7px 20px rgba(31,43,37,.05)}}.gap-card.critical{{border-left-color:var(--red)}}.gap-card.high{{border-left-color:#d05a3d}}.gap-card.low{{border-left-color:#789089}}.gap-meta{{display:flex;justify-content:space-between;gap:12px;align-items:center;font-size:12px;color:var(--muted)}}.gap-card h3{{font-size:20px;margin-top:13px}}dl{{display:grid;grid-template-columns:55px 1fr;gap:8px;margin:14px 0 0;padding-top:13px;border-top:1px solid var(--line);font-size:13px}}dt{{font-weight:850;color:var(--green)}}dd{{margin:0}}
.table-wrap{{overflow:auto;background:var(--card);border:1px solid var(--line);border-radius:17px}}table{{width:100%;min-width:700px;border-collapse:collapse}}th,td{{padding:14px 16px;text-align:left;vertical-align:top;border-bottom:1px solid var(--line)}}th{{color:var(--muted);font-size:11px;letter-spacing:.08em;text-transform:uppercase}}tr:last-child td{{border-bottom:0}}code{{background:#eceee8;border-radius:6px;padding:3px 6px;font-size:12px}}
.footer{{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-top:30px}}.panel{{background:#e4e9e4;border-radius:17px;padding:21px}}.panel h3{{margin-bottom:10px}}.panel ul{{margin:0;padding-left:20px}}.panel.action{{background:var(--ink);color:white}}.panel.action p{{color:#e0e8e4;font-size:18px;margin:0}}.empty{{padding:24px;text-align:center;color:var(--muted)}}.provenance{{color:var(--muted);font-size:12px;margin-top:22px}}
@media(max-width:800px){{main{{padding:28px 18px 48px}}header{{display:block}}.scope{{margin-top:20px}}.hero,.type-grid,.gap-grid,.footer{{grid-template-columns:1fr}}.score-head,.gap-meta{{flex-wrap:wrap}}.big{{font-size:44px;overflow-wrap:anywhere}}}}@media print{{body{{background:white}}main{{max-width:none;padding:20px}}.score,.gap-card{{box-shadow:none}}}}
</style></head><body><main>
<header><div><div class="eyebrow">Instrumentation coverage</div><h1>{esc(meta['scope'])}</h1><p class="subtitle">{esc(meta['appName'])} · {esc(meta['coverageLabel'])}</p></div><div class="scope"><b>{esc(meta['scopeType']).replace('-', ' ').title()}</b><span>{memory_sections}<br>{traffic_window}</span></div></header>
<section class="hero"><article class="score"><div class="score-head"><div><div class="eyebrow">Memory alignment</div><div class="big">{pct(summary['memoryCoverage'])}</div></div><span class="count">known product</span></div><p>{num(summary['taggedMemorySurfaces'])} of {num(summary['memorySurfaces'])} concrete memory surfaces tagged</p>{bar('Memory alignment', summary['memoryCoverage'], summary['taggedMemorySurfaces'], summary['memorySurfaces'], nouns=('tagged', 'expected'))}</article>
<article class="score"><div class="score-head"><div><div class="eyebrow">Observed traffic</div><div class="big">{pct(summary['trafficCoverage'])}</div></div><span class="count">runtime</span></div><p>{traffic_description}</p>{bar('Traffic-weighted coverage', summary['trafficCoverage'], summary['recognizedEvents'], summary['meaningfulEvents'], True)}</article></section>
<section class="type-grid">{types}</section>
<div class="section-head"><div><div class="eyebrow">Memory and runtime evidence</div><h2>Tagging gaps</h2></div><span class="count">{len(data['gaps'])} gaps</span></div><section class="gap-grid">{gaps}</section>
<div class="section-head"><div><div class="eyebrow">Memory review queue</div><h2>Tags not reflected in memory</h2></div><span class="count">{len(data['tagsNotInMemory'])} tags</span></div><div class="table-wrap"><table><thead><tr><th>Type</th><th>Surface</th><th>Definition</th><th>Interpretation</th></tr></thead><tbody>{memory_rows}</tbody></table></div>
<div class="section-head"><div><div class="eyebrow">Not counted as gaps</div><h2>Configured, not observed</h2></div><span class="count">{len(data['configuredNotObserved'])} tags</span></div><div class="table-wrap"><table><thead><tr><th>Type</th><th>Surface</th><th>Definition</th><th>Interpretation</th></tr></thead><tbody>{quiet_rows}</tbody></table></div>
<section class="footer"><article class="panel"><h3>Evidence limits</h3><ul>{limits}</ul></article><article class="panel action"><h3>Next action</h3><p>{esc(data['nextAction'])}</p></article></section>
<p class="provenance">Generated {esc(meta.get('generatedAt', ''))} · {sources} · App ID {esc(meta.get('appId', 'not supplied'))}</p>
</main></body></html>"""


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("input", type=Path)
    parser.add_argument("output", type=Path)
    args = parser.parse_args()
    data = json.loads(args.input.read_text(encoding="utf-8"))
    validate(data)
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(render(data), encoding="utf-8")
    print(args.output.resolve())


if __name__ == "__main__":
    main()
