# Baseband model and evaluation contract

## Implemented reference experiment
Uncoded BPSK and Cartesian QPSK use independent equiprobable bits and unit average symbol energy. BPSK maps bits to real ±1. QPSK maps each bit independently to ±1/sqrt(2) on I and Q. This is a reference comparison for future waveform work, not an implementation of a novel waveform.

For k bits per symbol and gamma = 10^(Eb/N0[dB]/10), independent real and imaginary Gaussian noise have variance 1/(2 k gamma). The transmitted complex symbol is rotated by the declared fixed phase error before adding noise. Decisions use the signs of I (and Q for QPSK), assuming ideal timing with no phase compensation. Noiseless symbol energy is one.

RMS EVM = sqrt(mean(|received−transmitted|²)) relative to unit symbol energy. It includes both noise and phase mismatch. BPSK EVM includes imaginary noise although the bit decision uses only I.

## Randomness and intervals
A nonzero 32-bit seed initializes xorshift32. Open-interval uniforms feed Box–Muller Gaussian sampling. Each waveform/SNR experiment restarts the seed; results across experiments are correlated. Reproducibility is expected on the same numerical runtime; minor transcendental differences can occur across engines.
BER = errors / transmitted bits. A two-sided 95% Wilson binomial interval uses z=1.959963984540054. Intervals assume independent bit errors under the stated model; they are not hardware confidence, validation, or uncertainty about model applicability. Zero observed errors retain a positive upper bound. There is no adaptive stopping or multiple-comparison correction.

## Scope and units
Symbols are symbol-rate samples; no pulse shaping, oversampling, sample clock, occupied bandwidth, PSD, OFDM, coding, fading, multipath, phase tracking, carrier-frequency offset, interference waveform, or RF propagation is modeled. Bits/symbol is modulation order, not measured bits/s/Hz. No spectral efficiency or interference-resilience metric is reported. No hardware driver, SDR transmission or RF capture is connected.

## Research workflow and roadmap
Record source assumptions and reviewer rationale. Start with reference AWGN baselines; independently validate noise normalization and error counts. Future waveform comparisons should add an explicit pulse/channel/receiver contract, published baselines, unit-consistent bandwidth metrics and authorized measured data. No novelty, real-world performance, DARPA affiliation or endorsement is claimed.

The app stores one study in browser-local storage. Source and review notes are unverified declarations. Exports are ordinary JSON/CSV/Markdown files, not signed evidence bundles. Preserve measured source material separately.

Automated tests cover seeded behavior, invalid inputs, reference BER scale, energy normalization indirectly through QPSK/BPSK comparison, phase inversion and interval edge cases. Browser, accessibility and cross-engine verification remain required.
