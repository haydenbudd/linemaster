import {
  Factory,
  Heart,
  Car,
  Palette,
  Coffee,
  Zap,
  Wind,
  Radio,
  CircleDot,
  ToggleLeft,
  Gauge,
  Wrench,
  HardHat,
  Plug,
  Wheat,
  ShieldCheck,
  Store,
} from 'lucide-react';

export interface Option {
  id: string;
  label: string;
  icon?: any;
  description: string;
  isMedical?: boolean;
  availableFor?: string[];
  hideFor?: string[];
  parentCategory?: string;
}

export interface Category {
  id: string;
  label: string;
  icon: any;
  description: string;
  isMedical?: boolean;
}

export const categories: Category[] = [
  {
    id: 'industrial',
    label: 'Industrial',
    icon: Factory,
    description: 'Manufacturing, automotive, construction, and heavy-duty applications.',
  },
  {
    id: 'medical',
    label: 'Medical',
    icon: Heart,
    description: 'Surgical, diagnostic, and patient care equipment.',
    isMedical: true,
  },
  {
    id: 'commercial',
    label: 'Commercial',
    icon: Store,
    description: 'Light-duty commercial and specialty applications.',
  },
];

export const applications: Option[] = [
  // Industrial sub-categories
  {
    id: 'industrial',
    label: 'Manufacturing & Metalworking',
    icon: Wrench,
    description: 'Welding (TIG/MIG), CNC machining, assembly lines, and industrial presses.',
    parentCategory: 'industrial',
  },
  {
    id: 'automotive',
    label: 'Automotive & Equipment Repair',
    icon: Car,
    description: 'Vehicle lifts, tire changers, paint booths, and shop maintenance tools.',
    parentCategory: 'industrial',
  },
  {
    id: 'construction',
    label: 'Construction & Material Handling',
    icon: HardHat,
    description: 'Scissor lifts, booms, road pavers, and earth-moving equipment.',
    parentCategory: 'industrial',
  },
  {
    id: 'utilities',
    label: 'Utilities & Environmental Services',
    icon: Plug,
    description: 'Sewer and waste management systems, utility infrastructure maintenance.',
    parentCategory: 'industrial',
  },
  {
    id: 'agriculture',
    label: 'Agriculture & Food Services',
    icon: Wheat,
    description: 'Farming machinery, commercial food processing, and preparation equipment.',
    parentCategory: 'industrial',
  },
  {
    id: 'defense',
    label: 'Defense & Communications',
    icon: ShieldCheck,
    description: 'Military-grade equipment and hands-free communication devices.',
    parentCategory: 'industrial',
  },
  // Medical (no sub-categories — triggers medical flow directly)
  {
    id: 'medical',
    label: 'Medical & Healthcare',
    icon: Heart,
    description: 'Surgical, diagnostic, patient care',
    isMedical: true,
    parentCategory: 'medical',
  },
  // Commercial sub-categories
  {
    id: 'tattoo',
    label: 'Tattoo & Body Art',
    icon: Palette,
    description: 'Precision control for artists.',
    parentCategory: 'commercial',
  },
  {
    id: 'general',
    label: 'General / Other',
    icon: Coffee,
    description: 'Office, consumer, and specialty applications.',
    parentCategory: 'commercial',
  },
];

export const technologies: Option[] = [
  {
    id: 'electrical',
    label: 'Electrical',
    icon: Zap,
    description: 'Standard wired connection.',
    availableFor: ['industrial', 'automotive', 'construction', 'utilities', 'agriculture', 'defense', 'woodworking', 'tattoo', 'general'],
  },
  {
    id: 'pneumatic',
    label: 'Pneumatic (Air)',
    icon: Wind,
    description: 'Uses compressed air.',
    availableFor: ['industrial', 'automotive', 'construction', 'utilities', 'agriculture', 'defense', 'woodworking', 'general'],
  },
  {
    id: 'wireless',
    label: 'RF Wireless',
    icon: Radio,
    description: 'Cord-free operation.',
    availableFor: ['industrial', 'automotive', 'construction', 'utilities', 'agriculture', 'defense', 'general'],
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
  {
    id: 'any',
    label: 'No Preference',
    description: 'Show all IP ratings.',
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
