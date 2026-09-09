import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { CropScenario } from '../types';

export const diagnosisService = {
  // Save an AI diagnosis to Supabase
  async recordDiagnosis(scenario: CropScenario): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) {
      return false;
    }

    try {
      const { error } = await supabase.from('crop_diagnoses').insert({
        crop_name: scenario.cropName,
        diagnosis: scenario.diagnosis,
        diagnosis_mr: scenario.diagnosisMr,
        category: scenario.category,
        confidence: scenario.confidence,
        severity_percent: scenario.severityPercent,
        early_warning_days: scenario.earlyWarningDays,
        ndvi_score: scenario.ndviScore,
        ndre_score: scenario.ndreScore,
        disambiguation_note: scenario.disambiguationNote.en,
        ipm_advice: scenario.ipmAdvice
      });

      return !error;
    } catch (err) {
      console.warn('Failed to record diagnosis in Supabase:', err);
      return false;
    }
  }
};
