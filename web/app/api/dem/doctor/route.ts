import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_DIAGNOSTICS } from '@/lib/dem-data';

export async function GET() {
  const timestamp = new Date().toISOString();
  
  return NextResponse.json({
    status: 'healthy',
    timestamp,
    os: 'Debian 13 (Trixie)',
    kernel: 'Linux 6.8.0-40-generic x86_64',
    demVersion: 'v2.4.0',
    diagnostics: INITIAL_DIAGNOSTICS,
    systemMetrics: {
      cpuUsage: 14.2,
      ramUsage: 38.5,
      ramTotalGB: 16,
      diskUsage: 28.1,
      diskTotalGB: 50,
      uptime: '14 days, 3 hours, 22 minutes',
      loadAverage: [0.18, 0.22, 0.15],
    }
  });
}
