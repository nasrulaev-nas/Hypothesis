
import { createClient } from '@supabase/supabase-js';
import { MOCK_EXPERIMENTS, MOCK_FACTS, MOCK_PROJECT } from './mockStore';

// Пытаемся получить ключи из процесса (Vite заменит их при сборке)
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

const isConfigured = 
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL.startsWith('https://') &&
  !SUPABASE_URL.includes('your-project-url');

// Создаем клиент только если есть конфиг
export const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

if (!supabase) {
  console.warn("Supabase is not configured. Using mock data mode.");
}

const handleSupabaseError = (error: any) => {
  if (!error) return;
  console.error("Supabase Error:", error);
  throw new Error(error.message || "Database connection error");
};

export const db = {
  projects: {
    async getAll() {
      if (!supabase) return [MOCK_PROJECT]; 
      try {
        const { data, error } = await supabase.from('projects').select('*');
        if (error) handleSupabaseError(error);
        return data || [];
      } catch (e) {
        return [MOCK_PROJECT];
      }
    },
    async getById(id: string) {
      if (!supabase) return { ...MOCK_PROJECT, id };
      try {
        const { data, error } = await supabase.from('projects').select('*, business_facts(*)').eq('id', id).single();
        if (error) handleSupabaseError(error);
        return data;
      } catch (e) {
        return { ...MOCK_PROJECT, id };
      }
    }
  },

  experiments: {
    async getAll() {
      if (!supabase) return MOCK_EXPERIMENTS;
      try {
        const { data, error } = await supabase.from('experiments').select('*').order('created_at', { ascending: false });
        if (error) return MOCK_EXPERIMENTS;
        return data || [];
      } catch (e) {
        return MOCK_EXPERIMENTS;
      }
    },
    async getById(id: string) {
      if (!supabase) return MOCK_EXPERIMENTS.find(e => e.id === id) || null;
      try {
        const { data, error } = await supabase.from('experiments').select('*').eq('id', id).single();
        if (error) handleSupabaseError(error);
        return data;
      } catch (e) {
        return MOCK_EXPERIMENTS.find(e => e.id === id) || null;
      }
    },
    async create(experiment: any) {
      if (!supabase) return { ...experiment, id: 'temp-' + Date.now() };
      try {
        const { data, error } = await supabase.from('experiments').insert([experiment]).select();
        if (error) handleSupabaseError(error);
        return data?.[0];
      } catch (e: any) {
        throw e;
      }
    }
  },

  facts: {
    async getByProject(projectId: string) {
      if (!supabase) return MOCK_FACTS;
      try {
        const { data, error } = await supabase.from('business_facts').select('*').eq('project_id', projectId).maybeSingle();
        if (error) handleSupabaseError(error);
        return data || MOCK_FACTS;
      } catch (e) {
        return MOCK_FACTS;
      }
    },
    async update(projectId: string, facts: any) {
      if (!supabase) return;
      try {
        const { error } = await supabase.from('business_facts').upsert({ project_id: projectId, ...facts });
        if (error) handleSupabaseError(error);
      } catch (e: any) {
        throw e;
      }
    }
  }
};
