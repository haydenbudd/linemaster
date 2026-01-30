import { useState, useCallback } from 'react';

type FlowType = 'standard' | 'medical';

export interface WizardState {
  flow: FlowType;
  step: number;
  selectedApplication: string;
  selectedTechnology: string;
  selectedAction: string;
  selectedEnvironment: string;
  selectedDuty: string;
  selectedMaterial: string;
  selectedConnection: string;
  selectedFeatures: string[];
  // Medical flow
  selectedConsoleStyle: string;
  selectedPedalCount: string;
  selectedMedicalFeatures: string[];
  selectedAccessories: string[];
  // Setters
  setFlow: (flow: FlowType) => void;
  setStep: (step: number) => void;
  setSelectedApplication: (id: string) => void;
  setSelectedTechnology: (id: string) => void;
  setSelectedAction: (id: string) => void;
  setSelectedEnvironment: (id: string) => void;
  setSelectedDuty: (id: string) => void;
  setSelectedMaterial: (id: string) => void;
  setSelectedConnection: (id: string) => void;
  setSelectedFeatures: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedConsoleStyle: (id: string) => void;
  setSelectedPedalCount: (id: string) => void;
  setSelectedMedicalFeatures: React.Dispatch<React.SetStateAction<string[]>>;
  setSelectedAccessories: React.Dispatch<React.SetStateAction<string[]>>;
  resetWizard: () => void;
}

export function useWizardState(): WizardState {
  const [flow, setFlow] = useState<FlowType>('standard');
  const [step, setStep] = useState(0);
  const [selectedApplication, setSelectedApplication] = useState('');
  const [selectedTechnology, setSelectedTechnology] = useState('');
  const [selectedAction, setSelectedAction] = useState('');
  const [selectedEnvironment, setSelectedEnvironment] = useState('');
  const [selectedDuty, setSelectedDuty] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [selectedConnection, setSelectedConnection] = useState('');
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  // Medical flow
  const [selectedConsoleStyle, setSelectedConsoleStyle] = useState('');
  const [selectedPedalCount, setSelectedPedalCount] = useState('');
  const [selectedMedicalFeatures, setSelectedMedicalFeatures] = useState<string[]>([]);
  const [selectedAccessories, setSelectedAccessories] = useState<string[]>([]);

  const resetWizard = useCallback(() => {
    setFlow('standard');
    setStep(0);
    setSelectedApplication('');
    setSelectedTechnology('');
    setSelectedAction('');
    setSelectedEnvironment('');
    setSelectedDuty('');
    setSelectedMaterial('');
    setSelectedConnection('');
    setSelectedFeatures([]);
    setSelectedConsoleStyle('');
    setSelectedPedalCount('');
    setSelectedMedicalFeatures([]);
    setSelectedAccessories([]);
  }, []);

  return {
    flow,
    step,
    selectedApplication,
    selectedTechnology,
    selectedAction,
    selectedEnvironment,
    selectedDuty,
    selectedMaterial,
    selectedConnection,
    selectedFeatures,
    selectedConsoleStyle,
    selectedPedalCount,
    selectedMedicalFeatures,
    selectedAccessories,
    setFlow,
    setStep,
    setSelectedApplication,
    setSelectedTechnology,
    setSelectedAction,
    setSelectedEnvironment,
    setSelectedDuty,
    setSelectedMaterial,
    setSelectedConnection,
    setSelectedFeatures,
    setSelectedConsoleStyle,
    setSelectedPedalCount,
    setSelectedMedicalFeatures,
    setSelectedAccessories,
    resetWizard,
  };
}
