"""Read-only audit of local LOD evidence. Does not run a GPU benchmark."""
import argparse
import hashlib
import json
import statistics
import subprocess
from datetime import datetime, timezone
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--source-root', type=Path, default=Path('/Users/leqiwan/Desktop/shuyuan_wlq/大场景渲染'))
parser.add_argument('--output', type=Path, default=Path('docs/lod-evidence-snapshot.json'))
args = parser.parse_args()

def git(root, *arguments):
    return subprocess.check_output(['git', '-C', str(root), *arguments], text=True).strip()

def fingerprint(path):
    if not path.is_file():
        return {'path': str(path), 'missing': True}
    h = hashlib.sha256()
    with path.open('rb') as stream:
        for block in iter(lambda: stream.read(1024 * 1024), b''):
            h.update(block)
    return {'path': str(path), 'bytes': path.stat().st_size, 'sha256': h.hexdigest()}

viewer = args.source_root / 'supersplat-viewer'
transform = args.source_root / 'splat-transform'
report_root = viewer / 'benchmark-reports'
paths = [
    viewer / 'src/loaders/gsplat/lod/octree/refinement-controller.ts',
    viewer / 'src/loaders/gsplat/lod/octree/out-of-frustum-downgrade.ts',
    viewer / 'public/vendor/playcanvas-2.20.0.js',
    viewer / 'public/index.html',
    viewer / 'package-lock.json',
    transform / 'src/lib/lod/lod-plan.ts',
    transform / 'src/lib/writers/write-lod.ts',
    transform / 'package-lock.json',
]
ladder_path = report_root / '2026-08-11/poland-leaf-ladder/results.json'
repeats_path = report_root / '2026-08-12/scene-chengjian-v7-kf1-budget-repeats/results.json'
paths += [ladder_path, repeats_path]
ladder = json.loads(ladder_path.read_text())
repeats = json.loads(repeats_path.read_text())
ladder_rows = [{k: row.get(k) for k in ('sceneId', 'label', 'leaves', 'firstUsefulMs', 'frameMs', 'updateMs', 'gpuMs', 'totalBlocks', 'gsplatsM', 'blurToClearMs', 'timeoutCount')} for row in ladder['results']]
repeat_groups = []
for budget in sorted(set(row['budget'] for row in repeats['cases'])):
    cases = [r for r in repeats['cases'] if r['budget'] == budget]
    repeat_groups.append({'budget': budget, 'runs': len(cases),
        'firstFrameMs': [r['firstFrameMs'] for r in cases],
        'firstFrameMedianMs': statistics.median(r['firstFrameMs'] for r in cases),
        'cases': [{k: r.get(k) for k in ('label', 'gsplatsAvgM', 'vramTexPeakMb', 'interactionWaypoints')} for r in cases]})
assets = []
for relative in ('assets/sanlitun/lod-meta.json', 'assets/soho-restore/lod-meta.json', 'assets/wuhan/wuhan-v9/lod-meta.json'):
    path = transform / relative
    if not path.is_file():
        assets.append(fingerprint(path)); continue
    meta = json.loads(path.read_text())
    leaves = 0
    def walk(node):
        global leaves
        if isinstance(node, dict):
            if 'lods' in node:
                leaves += 1
            for value in node.values():
                walk(value)
        elif isinstance(node, list):
            for value in node:
                walk(value)
    walk(meta.get('tree'))
    assets.append({**fingerprint(path), 'asset': meta.get('asset'), 'counts': meta.get('counts'), 'lodLevels': meta.get('lodLevels'), 'physicalFiles': len(meta.get('filenames', [])), 'nodesWithLods': leaves,
        'limitation': 'Metadata hash only; SOG payloads are not hashed. Generator version does not prove source commit.'})
snapshot = {
    'auditedAt': datetime.now(timezone.utc).isoformat(),
    'scope': 'Local code identity and historical report extraction; not a current-version performance run.',
    'repositories': [{'path': str(root), 'head': git(root, 'rev-parse', 'HEAD'), 'headDate': git(root, 'show', '-s', '--format=%cI', 'HEAD'), 'trackedChanges': git(root, 'status', '--short', '--untracked-files=no')} for root in (viewer, transform)],
    'files': [fingerprint(path) for path in paths],
    'assets': assets,
    'historicalLeafLadder': ladder_rows,
    'historicalBudgetRepeats': repeat_groups,
    'limitations': ['Historical reports are not bound to current source/vendor/asset hashes.', 'Frame samples and camera poses are not independent repeated runs.', 'No new browser/GPU experiments were performed.', 'Local HEAD is not verified as the deployed production version.']
}
args.output.parent.mkdir(parents=True, exist_ok=True)
args.output.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + '\n')
print(f'Wrote {args.output}; {len(ladder_rows)} ladder cases, {len(repeats["cases"])} repeated budget cases.')
for a in assets:
    print(a['path'], a.get('physicalFiles'), a.get('nodesWithLods'))
