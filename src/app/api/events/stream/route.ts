import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection packet
      const initData = JSON.stringify({
        type: 'SYSTEM_CONNECTED',
        timestamp: new Date().toISOString(),
        node: 'BOP-17-EDGE-STREAM',
        status: 'SUBSCRIBED'
      });
      controller.enqueue(encoder.encode(`data: ${initData}\n\n`));

      // Periodic heartbeat and event dispatch
      const interval = setInterval(() => {
        const pingData = JSON.stringify({
          type: 'TELEMETRY_HEARTBEAT',
          timestamp: new Date().toISOString(),
          fps: +(28.2 + Math.random() * 1.4).toFixed(1),
          latencyMs: Math.floor(88 + Math.random() * 10),
          queueDepth: Math.floor(1 + Math.random() * 3)
        });
        controller.enqueue(encoder.encode(`data: ${pingData}\n\n`));
      }, 3000);

      req.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive'
    }
  });
}
