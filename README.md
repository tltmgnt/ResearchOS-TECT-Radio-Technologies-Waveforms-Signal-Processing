# ResearchOS TECT — Radio Technologies, Waveforms & Signal Processing
Independent research foundation for software-defined radio and waveform/receiver evaluation.

## Implemented app
Reproducible BPSK/QPSK symbol-rate simulations, Eb/N0 sweeps, Gaussian noise, fixed receiver phase error, BER with Wilson intervals, RMS EVM and received constellations. Seeded experiments run in a browser worker. JSON import/export, CSV results, Markdown reports, evidence notes, human review and browser-local storage are included.

These are established reference waveforms. No novel waveform, hardware SDR integration, occupied-bandwidth metric or RF transmission is implemented. See [model contract and roadmap](docs/MODEL.md).

## Run
Node 22+; no npm dependencies:
```sh
npm test
npm run build
python -m http.server 8000 --directory dist
```
Open http://localhost:8000. Or serve the repository root. Modules, workers and demo loading require localhost or HTTPS; opening via file:// is unsupported.

## CLI
```sh
node cli.mjs example.json
node cli.mjs example.json results.json
node cli.mjs example.json results.csv
```
Existing output files are refused. CLI and browser share the model. Export local studies regularly; there is no account synchronization or telemetry.

## Validation and distribution
Nine tests and Node 22/24 CI cover model checks, syntax, CLI execution and static packaging. CI uploads downloadable app builds. Consult actual CI outcomes: execution and interactive browser verification were unavailable during implementation. Hosting is not configured yet.

Independent research prototype; no operational validation, DARPA affiliation, endorsement or novelty claim. Apache-2.0 license retained.
