export const MIRROR_PRESETS = [
  { id: 'mini', name: 'Mirror Mini', widthCm: 15, heightCm: 10, resolutionLabel: '900 x 600p' },
  { id: 'mid', name: 'Mirror Mid', widthCm: 32, heightCm: 18, resolutionLabel: '1920 x 1080p' },
  { id: 'pro', name: 'Mirror Pro', widthCm: 67.5, heightCm: 38, resolutionLabel: '3840 x 2160p' },
] as const;

export type MirrorPresetId = (typeof MIRROR_PRESETS)[number]['id'];
export type MirrorPreset = (typeof MIRROR_PRESETS)[number];
