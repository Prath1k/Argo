import { supabase, isSupabaseConfigured } from './supabaseClient';
import type { OutbreakCluster } from '../types';
import { MAHARASHTRA_CLUSTERS } from '../data/maharashtraClusters';

export const cropsapService = {
  // Fetch active outbreak clusters from Supabase or fallback to local data
  async getClusters(): Promise<OutbreakCluster[]> {
    if (!isSupabaseConfigured() || !supabase) {
      return MAHARASHTRA_CLUSTERS;
    }

    try {
      const { data, error } = await supabase
        .from('outbreak_clusters')
        .select('*')
        .order('cases_reported', { ascending: false });

      if (error || !data || data.length === 0) {
        return MAHARASHTRA_CLUSTERS;
      }

      return data.map((row) => ({
        id: row.id,
        taluka: row.taluka,
        district: row.district,
        crop: row.crop,
        threat: row.threat,
        threatMr: row.threat_mr || row.threat,
        riskLevel: row.risk_level as 'Low' | 'Moderate' | 'Critical',
        casesReported: Number(row.cases_reported),
        lat: Number(row.lat),
        lng: Number(row.lng),
        etlExceeded: Boolean(row.etl_exceeded),
        advisorySent: Boolean(row.advisory_sent),
        lastUpdated: new Date(row.updated_at).toLocaleTimeString()
      }));
    } catch (err) {
      console.warn('Failed to fetch clusters from Supabase, using fallback:', err);
      return MAHARASHTRA_CLUSTERS;
    }
  },

  // Record an emergency broadcast alert in Supabase
  async dispatchAdvisory(
    clusterId: string,
    taluka: string,
    district: string,
    messageMr: string,
    recipientCount: number = 1480
  ): Promise<boolean> {
    if (!isSupabaseConfigured() || !supabase) {
      return true; // Local simulation succeeds
    }

    try {
      // 1. Insert into advisory_broadcasts
      await supabase.from('advisory_broadcasts').insert({
        cluster_id: clusterId,
        taluka,
        district,
        recipient_count: recipientCount,
        message_mr: messageMr,
        channel: 'SMS_AND_WHATSAPP'
      });

      // 2. Mark cluster advisory_sent = true
      await supabase
        .from('outbreak_clusters')
        .update({ advisory_sent: true, updated_at: new Date().toISOString() })
        .eq('id', clusterId);

      return true;
    } catch (err) {
      console.warn('Failed to dispatch advisory in Supabase:', err);
      return false;
    }
  },

  // Subscribe to real-time cluster changes
  subscribeToClusters(onClusterChange: () => void): (() => void) | null {
    if (!isSupabaseConfigured() || !supabase) {
      return null;
    }

    const channel = supabase
      .channel('realtime:outbreak_clusters')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'outbreak_clusters' },
        () => {
          onClusterChange();
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
