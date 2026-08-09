import { useEffect, useMemo, useState } from 'react';

const demoFindings = [
  { label: 'Walls & paint', result: 'PASS', detail: 'No major cracks or moisture marks detected.' },
  { label: 'Furniture condition', result: 'PASS', detail: 'Desk, bed frame and storage appear serviceable.' },
  { label: 'Floor & safety', result: 'REVIEW', detail: 'Minor scuff near the door should be recorded.' },
];

export default function AIRoomInspectionPage() {
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState('ready');
  const [progress, setProgress] = useState(0);

  useEffect(() => () => files.forEach((file) => URL.revokeObjectURL(file.preview)), [files]);

  const score = status === 'complete' ? (files.length ? 96 : 92) : null;
  const findings = useMemo(() => demoFindings.map((finding, index) => ({
    ...finding,
    result: files.length && index === 2 ? 'REVIEW' : finding.result,
  })), [files]);

  const handleFiles = (event) => {
    const selected = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/')).slice(0, 6);
    setFiles(selected.map((file) => ({ file, preview: URL.createObjectURL(file) })));
    setStatus('ready');
    setProgress(0);
  };

  const runInspection = () => {
    setStatus('scanning');
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((current) => {
        const next = Math.min(current + 20, 100);
        if (next === 100) {
          clearInterval(interval);
          setStatus('complete');
        }
        return next;
      });
    }, 180);
  };

  return (
    <div className="bg-surface font-body-md text-on-surface">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl p-margin-mobile lg:p-margin-desktop">
        <section className="flex flex-col justify-center">
          <div className="inline-flex items-center gap-sm bg-primary text-on-primary px-sm py-xs mb-lg w-max border-2 border-primary"><span className="material-symbols-outlined text-label-caps">verified</span><span className="font-label-caps text-label-caps tracking-widest uppercase">AI Integrity Check</span></div>
          <h1 className="font-heading text-h1-mobile md:text-h1 text-on-surface mb-md font-bold">Proof, not promises.</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-xl max-w-2xl">Upload room evidence and generate a shareable condition report before a deposit dispute can start.</p>

          <div className="bg-surface-container-low border-2 border-primary p-lg mb-lg">
            <div className="flex items-center justify-between gap-md mb-lg"><div className="flex items-center gap-sm"><span className="material-symbols-outlined text-electric-purple">analytics</span><span className="font-h3 text-h3 text-primary">Condition report</span></div><span className="px-sm py-xs bg-acid-lime border-2 border-primary font-label-caps text-label-caps">{score ? `SCORE: ${score}/100` : 'NOT RUN'}</span></div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">{findings.map((finding) => <div key={finding.label} className={`p-md bg-surface border-2 border-primary ${finding.result === 'REVIEW' ? 'border-l-8 border-l-acid-lime' : ''}`}><span className="block font-label-caps text-label-caps text-on-surface-variant mb-sm uppercase">{finding.label}</span><div className="flex items-center justify-between gap-sm"><span className="font-h3 text-h3 text-on-surface">{status === 'complete' ? finding.result : '—'}</span>{status === 'complete' && <span className="material-symbols-outlined text-electric-purple">{finding.result === 'PASS' ? 'check_circle' : 'priority_high'}</span>}</div>{status === 'complete' && <p className="font-body-sm text-on-surface-variant mt-sm">{finding.detail}</p>}</div>)}</div>
          </div>
          <p className="font-label-caps text-label-caps text-on-surface-variant flex items-center gap-xs"><span className="material-symbols-outlined text-[16px]">info</span>Demo analysis is local and illustrative. Humans decide.</p>
        </section>

        <section className="bg-surface-container border-2 border-primary overflow-hidden min-h-[560px] flex flex-col">
          <div className="bg-primary text-on-primary p-md flex items-center justify-between border-b-2 border-primary"><span className="font-label-caps text-label-caps uppercase flex items-center gap-sm"><span className="material-symbols-outlined text-acid-lime">radar</span>AI Condition Scan</span><span className="font-h3 text-h3 text-acid-lime">{status === 'complete' ? 'COMPLETE' : status === 'scanning' ? `${progress}%` : 'READY'}</span></div>
          <div className="flex-1 p-lg flex flex-col justify-center gap-lg">
            <label className="border-2 border-primary border-dashed p-xl flex flex-col items-center justify-center gap-md bg-surface hover:bg-acid-lime/10 cursor-pointer min-h-[240px]" htmlFor="inspection-images"><span className="material-symbols-outlined text-[64px] text-electric-purple">add_photo_alternate</span><span className="font-h3 text-h3 text-primary">{files.length ? `${files.length} image${files.length > 1 ? 's' : ''} selected` : 'Upload room evidence'}</span><span className="font-body-md text-on-surface-variant text-center">Use clear photos of walls, floors, furniture and meters. Up to 6 images.</span><input id="inspection-images" className="sr-only" type="file" accept="image/*" multiple onChange={handleFiles} /></label>
            {files.length > 0 && <div className="grid grid-cols-3 gap-sm">{files.map(({ file, preview }) => <img key={`${file.name}-${file.lastModified}`} src={preview} alt={file.name} className="w-full aspect-square object-cover border-2 border-primary" />)}</div>}
            {status === 'scanning' && <div aria-live="polite" className="h-3 bg-surface border-2 border-primary overflow-hidden"><div className="h-full bg-electric-purple transition-all" style={{ width: `${progress}%` }} /></div>}
            <button type="button" onClick={runInspection} disabled={status === 'scanning'} className="w-full py-md bg-acid-lime border-2 border-primary font-label-caps text-label-caps text-primary disabled:opacity-50">{status === 'scanning' ? 'ANALYSING EVIDENCE...' : status === 'complete' ? 'RUN AGAIN' : 'RUN DEMO INSPECTION'}</button>
          </div>
          <div className="bg-surface p-md border-t-2 border-primary flex justify-between items-center"><span className="font-label-caps text-label-caps text-on-surface-variant">Evidence stays attached to your report</span><span className="material-symbols-outlined text-electric-purple">lock</span></div>
        </section>
      </div>
    </div>
  );
}
