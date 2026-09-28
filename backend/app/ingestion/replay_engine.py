import asyncio
import csv
import logging
from pathlib import Path
from datetime import datetime

from app.ingestion.event_processor import EventProcessor
from app.config import settings

logger = logging.getLogger(__name__)

class ReplayEngine:
    def __init__(self):
        self.is_running = False
        self.is_paused = False
        self.current_index = 0
        self.total_events = 0
        self.events_processed = 0
        self.task: asyncio.Task | None = None
        self.processor = EventProcessor()
        
        self.dataset_path = Path("data/raw/network_events.csv")
        self.events = []
        
    def load_dataset(self):
        if not self.dataset_path.exists():
            logger.error(f"Dataset not found at {self.dataset_path}")
            return
            
        logger.info(f"Loading dataset from {self.dataset_path}")
        with open(self.dataset_path, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            self.events = list(reader)
        self.total_events = len(self.events)
        logger.info(f"Loaded {self.total_events} events for replay")
        
    async def _replay_loop(self):
        """Background loop pushing events at a simulated speed."""
        try:
            while self.is_running:
                if self.is_paused:
                    await asyncio.sleep(0.5)
                    continue
                    
                if self.current_index >= self.total_events:
                    logger.info("Replay completed")
                    self.is_running = False
                    break
                    
                raw_event = dict(self.events[self.current_index])
                import uuid
                from datetime import datetime, timezone
                raw_event['event_id'] = f'EVT-{uuid.uuid4().hex[:8]}'
                raw_event['timestamp'] = datetime.now(timezone.utc).isoformat()
                self.current_index += 1
                self.events_processed += 1
                
                # Push event to processor
                await self.processor.process_and_publish(raw_event)
                
                # Sleep briefly to simulate real-time ingestion (e.g. ~10 events per second)
                # For demo, speed can be variable
                await asyncio.sleep(0.1)
                
        except asyncio.CancelledError:
            logger.info("Replay loop cancelled")
        except Exception as e:
            logger.exception(f"Error in replay loop: {e}")
            self.is_running = False

    def start(self):
        if not self.events:
            self.load_dataset()
            
        if self.is_running:
            return {"status": "already running"}
            
        self.is_running = True
        self.is_paused = False
        # Reset if at end
        if self.current_index >= self.total_events:
            self.current_index = 0
            self.events_processed = 0
            
        self.task = asyncio.create_task(self._replay_loop())
        return {"status": "started"}
        
    def pause(self):
        if self.is_running and not self.is_paused:
            self.is_paused = True
            return {"status": "paused"}
        return {"status": "not running or already paused"}
        
    def resume(self):
        if self.is_running and self.is_paused:
            self.is_paused = False
            return {"status": "resumed"}
        return {"status": "not paused"}
        
    def stop(self):
        self.is_running = False
        self.is_paused = False
        if self.task:
            self.task.cancel()
        self.current_index = 0
        self.events_processed = 0
        return {"status": "stopped"}
        
    def get_status(self):
        return {
            "mode": "REPLAY",
            "status": "PAUSED" if self.is_paused else ("RUNNING" if self.is_running else "STOPPED"),
            "eventsProcessed": self.events_processed,
            "eventsRemaining": self.total_events - self.current_index,
            "eventsPerSecond": 10 if self.is_running and not self.is_paused else 0
        }

# Global singleton
replay_engine = ReplayEngine()

