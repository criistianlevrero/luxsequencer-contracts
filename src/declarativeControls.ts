export type ControlType =
  | 'slider'
  | 'color'
  | 'gradient'
  | 'select'
  | 'toggle'
  | 'vector2d'
  | 'range'
  | 'curve'
  | 'matrix'
  | 'text';

export interface PresetValue {
  name: string;
  value: unknown;
  description?: string;
}

export interface PropertyDependency {
  property: string;
  condition: (value: unknown) => boolean;
  effect: 'show' | 'hide' | 'enable' | 'disable';
}

export interface SliderConstraints {
  min: number;
  max: number;
  step: number;
  defaultValue?: number;
  logarithmic?: boolean;
  formatter?: (value: number) => string;
  valueLabels?: ((value: number) => string) | Record<number | string, string>;
  curves?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
  bipolar?: boolean;
  detents?: number[];
}

export interface ColorConstraints {
  format?: 'hex' | 'rgb' | 'hsl';
  alpha?: boolean;
  palette?: string[];
}

export interface GradientConstraints {
  minColors?: number;
  maxColors?: number;
  allowHardStops?: boolean;
  supportsHardStops?: boolean;
  format?: 'array' | 'object' | 'css';
}

export interface SelectConstraints {
  options: Array<{
    value: unknown;
    label: string;
    description?: string;
    icon?: string;
    group?: string;
  }>;
  searchable?: boolean;
  multiple?: boolean;
  multiSelect?: boolean;
  allowGroups?: boolean;
  placeholder?: string;
}

export interface ToggleConstraints {
  style?: 'switch' | 'checkbox' | 'button';
  size?: 'sm' | 'md' | 'lg';
  onLabel?: string;
  offLabel?: string;
}

export interface Vector2DConstraints {
  xRange: [number, number];
  yRange: [number, number];
  lockAspectRatio?: boolean;
  polarMode?: boolean;
  gridSnap?: boolean;
  gridSize?: number;
}

export interface RangeConstraints {
  min: number;
  max: number;
  step: number;
  allowOverlap?: boolean;
  formatter?: (value: number) => string;
}

export interface TextConstraints {
  maxLength?: number;
  minLength?: number;
  pattern?: RegExp;
  patternError?: string;
  placeholder?: string;
  multiline?: boolean;
  validator?: (value: string) => string | true;
  formatter?: (value: string) => string;
  allowInvalid?: boolean;
  autoResize?: boolean;
  showCharacterCount?: boolean;
  required?: boolean;
  rows?: number;
  inputType?: string;
  clearable?: boolean;
  formatHints?: string[];
}

export interface ControlConstraints {
  slider?: SliderConstraints;
  color?: ColorConstraints;
  gradient?: GradientConstraints;
  select?: SelectConstraints;
  toggle?: ToggleConstraints;
  vector2d?: Vector2DConstraints;
  range?: RangeConstraints;
  text?: TextConstraints;
}

export interface StandardControlSpec {
  id: string;
  type: ControlType;
  category: string;
  label: string;
  constraints: ControlConstraints;
  presets?: PresetValue[];
  metadata?: {
    description?: string;
    tooltip?: string;
    units?: string;
    category?: string;
    order?: number;
    presets?: PresetValue[];
    dependencies?: PropertyDependency[];
  };
}

export interface RendererControlSpec {
  standard: StandardControlSpec[];
}

export interface DeclarativeControlSchema {
  schemaVersion: string;
  rendererId: string;
  rendererName: string;
  description: string;
  presets?: Array<{
    id: string;
    name: string;
    settings: unknown;
  }>;
  sections: Array<{
    id: string;
    title: string;
    description?: string;
    defaultOpen?: boolean;
    controls: Array<{
      type: ControlType;
      id: string;
      label: string;
      description?: string;
      constraints?: ControlConstraints;
      min?: number;
      max?: number;
      step?: number;
      defaultValue?: unknown;
      formatter?: (value: unknown) => string;
      valueLabels?: Record<number | string, string>;
      maxColors?: number;
      minColors?: number;
      supportsHardStops?: boolean;
      dependencies?: PropertyDependency[];
    }>;
  }>;
  globalDependencies?: PropertyDependency[];
  validation?: Array<{
    property: string;
    rules: Array<{
      type: 'range' | 'custom';
      min?: number;
      max?: number;
      validator?: (value: unknown) => boolean;
      message: string;
    }>;
  }>;
  metadata?: {
    version: string;
    author: string;
    created: string;
    lastModified: string;
    tags: string[];
    performance: {
      complexity: 'low' | 'medium' | 'high';
      gpuIntensive: boolean;
      recommendedMaxInstances: number;
    };
    features: string[];
    requirements: {
      webgl?: string;
      shaderModel?: string;
      extensions?: string[];
    };
  };
}
