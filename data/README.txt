SIH 2026 — NTRO — AI Based Network Attack Forecasting
PROJECT-READY SYNTHETIC DATASET PACKAGE

This package is synthetic prototype data designed to demonstrate the proposed forecasting architecture.
It is NOT real or classified government telemetry.

WHAT IS INCLUDED
1. Public reference dataset catalog: 8 datasets to use as external training/benchmark sources.
2. Seven common logical data layers.
3. Ten government sector profiles.
4. Ten sector-specific synthetic CSV datasets.
5. Exactly 100 major attack scenarios (10 per sector).
6. Exactly 400 attack-sequence variants (4 per scenario).
7. Asset catalog and topology nodes/edges for asset-level target prediction and blast-radius analysis.
8. Twelve attack-stage labels.
9. A compact MITRE ATT&CK-style technique mapping for the prototype.
10. One final unified training table.
11. One temporal sequence dataset.
12. Separate train/validation/test sequence files.

DESIGN PRINCIPLE
Normal network behaviour -> suspicious behaviour -> current attack stage -> predicted next stage
-> likely target asset -> criticality -> blast-radius estimate -> recommended response.

IMPORTANT PRESENTATION NOTE
Do not say the project has access to classified government traffic. Present these sector datasets as
synthetic government-shaped scenarios built over realistic asset/topology structures, combined with
public cybersecurity datasets.

Each sector CSV contains 1,000 events:
- 600 normal baseline events
- 400 attack events
The attack events are derived from the 10 sector scenarios and 4 variants per scenario.

The temporal sequence dataset is the most important dataset for the forecasting model because it contains:
CURRENT_ATTACK_STAGE -> NEXT_ATTACK_STAGE, plus TARGET_ASSET and TARGET_CRITICALITY.

The final unified training table is the common ML table after normalization and feature engineering.
