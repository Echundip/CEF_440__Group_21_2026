import { colors } from '../theme/colors';
import { DeliveryMode, NetworkQuality } from './types';

export function recommendedMode(quality: NetworkQuality): DeliveryMode {
  switch (quality) {
    case 'good':
      return 'video-hd';
    case 'moderate':
      return 'video-sd';
    case 'poor':
    default:
      return 'audio';
  }
}

export function modeLabel(mode: DeliveryMode): string {
  switch (mode) {
    case 'video-hd':
      return 'HD Video';
    case 'video-sd':
      return 'SD Video';
    case 'audio':
      return 'Audio Only';
    case 'text':
      return 'Text / Notes';
  }
}

export function qualityLabel(quality: NetworkQuality): string {
  switch (quality) {
    case 'good':
      return 'Good';
    case 'moderate':
      return 'Moderate';
    case 'poor':
      return 'Poor';
  }
}

export function qualityColor(quality: NetworkQuality): string {
  switch (quality) {
    case 'good':
      return colors.good;
    case 'moderate':
      return colors.moderate;
    case 'poor':
      return colors.poor;
  }
}

export function qualitySoftColor(quality: NetworkQuality): string {
  switch (quality) {
    case 'good':
      return colors.goodSoft;
    case 'moderate':
      return colors.moderateSoft;
    case 'poor':
      return colors.poorSoft;
  }
}
