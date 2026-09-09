import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { SensorTelemetry } from '../types';

export const telemetryService = {
  // Fetch latest telemetry reading from Supabase
  async getLatestTelemetry(taluka?: string): Promise<SensorTelemetry | null> {
    if (!isSupabaseConfigured() || !supabase) {
      return null;
    }

    try {
      let query = supabase
        .from('telemetry_readings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1);

      if (taluka) {
        query = query.eq('taluka', taluka);
      }

      const { data, error } = await query;
      if (error || !data || data.length === 0) {
        return null;
      }

      const row = data[0];
      return {
        airTemp: Number(row.air_temp),
        humidity: Number(row.humidity),
        soilN: Number(row.soil_n),
        soilP: Number(row.soil_p),
        soilK: Number(row.soil_k),
        soilMoisture: Number(row.soil_moisture),
        soilPh: Number(row.soil_ph),
        vpd: Number(row.vpd),
        batteryLevel: Number(row.battery_level || 95),
        solarCharging: Boolean(row.solar_charging),
        timestamp: new Date(row.created_at).toLocaleTimeString()
      };
    } catch (err) {
      console.warn('Failed to fetch telemetry from Supabase:', err);
      return null;
    }
  },

  // Record a new telemetry reading from edge device or simulator
  async recordTelemetry(
    telemetry: SensorTelemetry,
    taluka: string = 'Ausa',
    district: string = 'Latur',
    gatewayId: string = 'ARGO_NODE_MH_001'
  ): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) {
      return false;
    }

    try {
      const { error } = await supabase.from('telemetry_readings').insert({
        gateway_id: gatewayId,
        taluka,
        district,
        air_temp: telemetry.airTemp,
        humidity: telemetry.humidity,
        soil_n: telemetry.soilN,
        soil_p: telemetry.soilP,
        soil_k: telemetry.soilK,
        soil_moisture: telemetry.soilMoisture,
        soil_ph: telemetry.soilPh,
        vpd: telemetry.vpd,
        battery_level: telemetry.batteryLevel,
        solar_charging: telemetry.solarCharging,
        anomaly_flag: telemetry.humidity > 85 || telemetry.soilN < 50
      });

      return !error;
    } catch (err) {
      console.warn('Failed to record telemetry to Supabase:', err);
      return false;
    }
  },

  // Subscribe to real-time telemetry updates from ESP32 / IoT nodes
  subscribeToTelemetry(onNewReading: (reading: SensorTelemetry) => void): (() => void) | null {
    if (!isSupabaseConfigured() || !supabase) {
      return null;
    }

    const channel = supabase
      .channel('realtime:telemetry_readings')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'telemetry_readings' },
        (payload) => {
          const row = payload.new;
          onNewReading({
            airTemp: Number(row.air_temp),
            humidity: Number(row.humidity),
            soilN: Number(row.soil_n),
            soilP: Number(row.soil_p),
            soilK: Number(row.soil_k),
            soilMoisture: Number(row.soil_moisture),
            soilPh: Number(row.soil_ph),
            vpd: Number(row.vpd),
            batteryLevel: Number(row.battery_level || 95),
            solarCharging: Boolean(row.solar_charging),
            timestamp: new Date(row.created_at).toLocaleTimeString()
          });
        }
      )
      .subscribe();

    const client = supabase;
    return () => {
      if (client) {
        client.removeChannel(channel);
      }
    };
  }
};
