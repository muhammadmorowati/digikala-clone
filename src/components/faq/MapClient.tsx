'use client';

import dynamic from 'next/dynamic';

// Load your Map component client-side only
const Map = dynamic(() => import('./Map'), { ssr: false });

export default function MapClient() {
  return <Map />;
}
