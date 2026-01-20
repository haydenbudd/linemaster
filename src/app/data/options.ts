import {
  Factory,
  Heart,
  Car,
  Hammer,
  Palette,
  Coffee,
  Zap,
  Wind,
  Radio,
  CircleDot,
  ToggleLeft,
  Gauge,
} from 'lucide-react';

export interface Option {
  id: string;
  label: string;
  icon?: any;
  description: string;
  isMedical?: boolean;
  availableFor?: string[];
  hideFor?: string[];
}

export const applications: Option[] = [
  {
    id: 'industrial',
    label: 'Industrial & Manufacturing',
    icon: Factory,
    description: 'Heavy machinery, CNC, assembly',
  },
  {
    id: 'medical',
    label: 'Medical & Healthcare',
    icon: Heart,
    description: 'Surgical, diagnostic, patient care',
    isMedical: true,
  },
  {
    id: 'automotive',
    label: 'Automotive & Repair',
    icon: Car,
    description: 'Lifts, paint booths, tire changers',
  },
  {
    id: 'woodworking',
    label: 'Woodworking',
    icon: Hammer,
    description: 'Saws, lathes, routers',
  },
  {
    id: 'tattoo',
    label: 'Tattoo & Body Art',
    icon: Palette,
    description: 'Precision control for artists',
  },
  {
    id: 'general',
    label: 'General / Other',
    icon: Coffee,
    description: 'Office, consumer, specialty',
  },
];

export const technologies: Option[] = [
  {
    id: 'electrical',
    label: 'Electrical',
    icon: Zap,
    description: 'Standard wired connection.',
    availableFor: ['industrial', 'automotive', 'woodworking', 'tattoo', 'general'],
  },
  {
    id: 'pneumatic',
    label: 'Pneumatic (Air)',
    icon: Wind,
    description: 'Uses compressed air.',
    availableFor: ['industrial', 'automotive', 'woodworking', 'general'],
  },
  {
    id: 'wireless',
    label: 'RF Wireless',
    icon: Radio,
    description: 'Cord-free operation.',
    availableFor: ['industrial', 'automotive', 'general'],
  },
];

export const actions: Option[] = [
  {
    id: 'momentary',
    label: 'Momentary',
    icon: CircleDot,
    description: 'Active while pressed.',
    availableFor: ['electrical', 'pneumatic', 'wireless'],
  },
  {
    id: 'maintained',
    label: 'Maintained',
    icon: ToggleLeft,
    description: 'Press ON, press again OFF.',
    availableFor: ['electrical', 'pneumatic'],
  },
  {
    id: 'variable',
    label: 'Variable Speed',
    icon: Gauge,
    description: 'Speed varies with pressure.',
    availableFor: ['electrical', 'pneumatic'],
  },
];

export const environments: Option[] = [
  {
    id: 'dry',
    label: 'Dry / Indoor',
    description: 'IP20 sufficient.',
  },
  {
    id: 'damp',
    label: 'Damp / Splash',
    description: 'IP56 recommended.',
  },
  {
    id: 'wet',
    label: 'Wet / Washdown',
    description: 'IP68 required.',
  },
];

export const features: Option[] = [
  {
    id: 'shield',
    label: 'Safety Guard/Shield',
    description: 'Prevents accidental activation.',
  },
  {
    id: 'multi_stage',
    label: 'Multi-Stage',
    description: '2 or 3 actuation points.',
  },
  {
    id: 'twin',
    label: 'Twin Pedal',
    description: 'Two independent pedals.',
  },
  {
    id: 'custom_cable',
    label: 'Custom Cable Length',
    description: 'Non-standard cord length.',
    hideFor: ['wireless', 'pneumatic'],
  },
  {
    id: 'custom_connector',
    label: 'Custom Connector',
    description: 'Specific plug type.',
  },
];

export const consoleStyles: Option[] = [
  {
    id: 'aero',
    label: 'Aero Channel',
    description: 'Low-profile, streamlined design.',
  },
  {
    id: 'custom',
    label: 'Custom Design',
    description: 'Unique housing tailored to your needs.',
  },
];

export const pedalCounts: Option[] = [
  { id: '1', label: 'Single', description: 'One function' },
  { id: '2', label: 'Dual', description: 'Two functions' },
  { id: '3', label: 'Triple', description: 'Three functions' },
  { id: '4+', label: 'Multi', description: '4+ controls' },
];

export const medicalTechnicalFeatures: Option[] = [
  {
    id: 'wireless',
    label: 'RF Wireless',
    description: 'No cords in the OR.',
  },
  {
    id: 'linear',
    label: 'Variable Speed',
    description: 'Proportional control.',
  },
  {
    id: 'sealed',
    label: 'Sealed / Washdown',
    description: 'IP68 for sterilization.',
  },
];

export const accessories: Option[] = [
  {
    id: 'toe_loops',
    label: 'Toe Loops',
    description: 'Secure foot positioning.',
  },
  {
    id: 'guards',
    label: 'Pedal Guards',
    description: 'Prevent accidental activation.',
  },
  {
    id: 'labels',
    label: 'Custom Labels/Marking',
    description: 'Branding or identification.',
  },
  {
    id: 'color',
    label: 'Custom Color',
    description: 'Match your device.',
  },
];
