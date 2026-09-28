from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import asyncio
import json
import logging
from datetime import datetime, timedelta
from typing import List

from app.database.db import get_connection

router = APIRouter()
logger = logging.getLogger(__name__)

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        # Broadcast to all connected clients
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)
        for d in disconnected:
            self.disconnect(d)

manager = ConnectionManager()

# Background task to poll database and emit new events (Simulation loop)
async def event_generator_loop():
    logger.info("Starting Live Threat Stream Generator Loop")
    last_timestamp_processed = None
    
    # We will simulate real-time ingestion by stepping through the network_events table
    while True:
        try:
            if len(manager.active_connections) > 0:
                with get_connection() as conn:
                    cursor = conn.cursor()
                    if not last_timestamp_processed:
                        # Grab a starting timestamp
                        cursor.execute("SELECT timestamp FROM network_events ORDER BY timestamp DESC LIMIT 1 OFFSET 100")
                        row = cursor.fetchone()
                        if row:
                            last_timestamp_processed = row[0]
                        else:
                            last_timestamp_processed = "2026-01-01T00:00:00"

                    # Get events after the last processed timestamp
                    cursor.execute("""
                        SELECT event_id, timestamp, source_ip, destination_ip, source_port, destination_port, protocol, 
                               attack_label, severity_level, source_asset_id, target_asset_id
                        FROM network_events 
                        WHERE timestamp > ?
                        ORDER BY timestamp ASC LIMIT 5
                    """, (last_timestamp_processed,))
                    
                    rows = cursor.fetchall()
                    for row in rows:
                        event = {
                            "type": "NEW_EVENT",
                            "event": {
                                "eventId": row[0],
                                "timestamp": row[1],
                                "sourceIp": row[2],
                                "destinationIp": row[3],
                                "sourcePort": row[4],
                                "destinationPort": row[5],
                                "protocol": row[6],
                                "eventType": row[7],
                                "attackType": row[7],
                                "severity": row[8],
                                "sourceAssetId": row[9],
                                "destinationAssetId": row[10]
                            }
                        }
                        await manager.broadcast(event)
                        last_timestamp_processed = row[1]
                        await asyncio.sleep(0.5) # Simulate slight delay between events
            
            await asyncio.sleep(2) # Polling interval
        except Exception as e:
            logger.error(f"Error in event stream loop: {e}")
            await asyncio.sleep(5)


@router.websocket("/ws/threat-events")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            # Handle incoming commands like "PAUSE", "RESUME", "SPEED_UP" if necessary
    except WebSocketDisconnect:
        manager.disconnect(websocket)
