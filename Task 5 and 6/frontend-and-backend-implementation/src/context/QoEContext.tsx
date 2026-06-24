import React, { createContext, useContext, useMemo, useState } from 'react';
import { qoePresets } from '../data/mock';
import { NetworkQuality, QoEMetrics } from '../data/types';

interface QoEContextValue {
  metrics: QoEMetrics;
  setQuality: (quality: NetworkQuality) => void;
}

const QoEContext = createContext<QoEContextValue | undefined>(undefined);

export function QoEProvider({ children }: { children: React.ReactNode }) {
  const [quality, setQuality] = useState<NetworkQuality>('moderate');

  const value = useMemo<QoEContextValue>(
    () => ({ metrics: qoePresets[quality], setQuality }),
    [quality],
  );

  return <QoEContext.Provider value={value}>{children}</QoEContext.Provider>;
}

export function useQoE(): QoEContextValue {
  const ctx = useContext(QoEContext);
  if (!ctx) {
    throw new Error('useQoE must be used within a QoEProvider');
  }
  return ctx;
}
