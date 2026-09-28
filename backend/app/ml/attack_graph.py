"""
NTRO AI Cyber Forecast - Attack Graph Builder (NetworkX)
"""
import networkx as nx
import logging
import sqlite3
from app.database.db import get_connection

logger = logging.getLogger(__name__)


def build_attack_graph(prediction_id: str) -> dict:
    """
    Build an attack graph for a specific prediction using NetworkX.
    Returns a JSON-serialisable dict for the frontend.
    """
    conn = get_connection()
    try:
        # Get prediction
        pred = conn.execute(
            "SELECT * FROM attack_predictions WHERE prediction_id = ?",
            (prediction_id,)
        ).fetchone()

        if not pred:
            return {"nodes": [], "edges": [], "error": "Prediction not found"}

        # Get timeline events for this attack
        timeline = conn.execute(
            """
            SELECT * FROM attack_timeline
            WHERE attack_id = ?
            ORDER BY timestamp
            """,
            (prediction_id,)
        ).fetchall()

        # Get related asset info
        def get_asset(asset_id):
            if not asset_id:
                return None
            row = conn.execute(
                "SELECT * FROM assets WHERE asset_id = ?", (asset_id,)
            ).fetchone()
            return dict(row) if row else None

        G = nx.DiGraph()

        # Add source and target
        src = get_asset(pred["source_asset_id"])
        tgt = get_asset(pred["target_asset_id"])

        src_id = pred["source_asset_id"] or "external"
        tgt_id = pred["target_asset_id"] or "unknown"

        G.add_node(src_id, **{
            "label": src["hostname"] if src else src_id,
            "type": src["asset_type"] if src else "External",
            "criticality": src["criticality"] if src else "LOW",
            "ip": src["ip_address"] if src else "Unknown",
            "role": "source",
        })

        G.add_node(tgt_id, **{
            "label": tgt["hostname"] if tgt else tgt_id,
            "type": tgt["asset_type"] if tgt else "Unknown",
            "criticality": tgt["criticality"] if tgt else "LOW",
            "ip": tgt["ip_address"] if tgt else "Unknown",
            "role": "target",
        })

        # Add timeline nodes and edges
        prev_node = src_id
        for row in timeline:
            stage = row["stage"]
            event_label = row["event"]
            node_id = f"{tgt_id}_{stage}"

            if node_id not in G:
                G.add_node(node_id, **{
                    "label": event_label,
                    "type": "event",
                    "stage": stage,
                    "classification": row["classification"],
                    "severity": row["severity"],
                    "timestamp": row["timestamp"],
                    "role": "event",
                })

            G.add_edge(prev_node, node_id, **{
                "stage": stage,
                "classification": row["classification"],
                "confidence": row["confidence"],
            })
            prev_node = node_id

        # Final edge to target
        if prev_node != tgt_id:
            G.add_edge(prev_node, tgt_id, **{
                "stage": pred["predicted_stage"],
                "classification": "PREDICTED",
                "confidence": pred["confidence"],
            })

        # Serialise
        nodes = [
            {"id": n, **data}
            for n, data in G.nodes(data=True)
        ]
        edges = [
            {"source": u, "target": v, **data}
            for u, v, data in G.edges(data=True)
        ]

        return {
            "prediction_id": prediction_id,
            "nodes": nodes,
            "edges": edges,
            "node_count": G.number_of_nodes(),
            "edge_count": G.number_of_edges(),
        }

    finally:
        conn.close()
