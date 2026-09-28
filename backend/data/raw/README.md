# NTRO AI Cyber Forecast — Synthetic Dataset

All records are SYNTHETIC and intended for SIH development/demo/ML experimentation.
They do not represent real Indian government infrastructure or real incidents.

Main ML file: `network_events.csv`

ML target: `attack_label`

Classes:
NORMAL, RECONNAISSANCE, INITIAL_ACCESS, CREDENTIAL_ACCESS, EXECUTION,
PERSISTENCE, LATERAL_MOVEMENT, EXFILTRATION, IMPACT

Recommended flow:
network_events -> preprocessing -> anomaly detection -> classification ->
temporal sequence -> GRU/LSTM forecasting -> API -> Attack Analysis.

`attack_timeline.csv` distinguishes OBSERVED, INFERRED and PREDICTED events.
