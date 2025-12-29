
import { createClient } from '@supabase/supabase-js';
import { MOCK_EXPERIMENTS, MOCK_FACTS } from './mockStore';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

// Проверка на наличие реальных ключей
const isConfigured = 
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  !SUPABASE_URL.includes('your-project-url') && 
  !SUPABASE_ANON_KEY.includes('your-anon-key');

export const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) 
  : null;

export const db = {
  // Проекты
  projects: {
    async getAll() {
      if (!supabase) return [MOCK_FACTS]; // Возвращаем мок если нет БД
      const { data, error } = await supabase.from('projects').select('*');
      if (error) throw error;
      return data;
    },
    async getById(id: string) {
      if (!supabase) return { ...MOCK_FACTS, id };
      const { data, error } = await supabase.from('projects').select('*, business_facts(*)').eq('id', id).single();
      if (error) throw error;
      return data;
    }
  },

  // Эксперименты
  experiments: {
    async getAll() {
      if (!supabase) {
        // Симулируем задержку сети для реализма
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_EXPERIMENTS;
      }
      try {
        const { data, error } = await supabase.from('experiments').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
      } catch (e) {
        console.warn("Supabase query failed, falling back to mocks:", e);
        return MOCK_EXPERIMENTS;
      }
    },
    async create(experiment: any) {
      if (!supabase) return { ...experiment, id: Math.random().toString() };
      const { data, error } = await supabase.from('experiments').insert([experiment]).select();
      if (error) throw error;
      return data[0];
    },
    async updateStatus(id: string, status: string) {
      if (!supabase) return;
      const { error } = await supabase.from('experiments').update({ status }).eq('id', id);
      if (error) throw error;
    }
  },

  // Факты
  facts: {
    async getByProject(projectId: string) {
      if (!supabase) return MOCK_FACTS;
      const { data, error } = await supabase.from('business_facts').select('*').eq('project_id', projectId).single();
      if (error) throw error;
      return data;
    },
    async update(projectId: string, facts: any) {
      if (!supabase) return;
      const { error } = await supabase.from('business_facts').upsert({ project_id: projectId, ...facts });
      if (error) throw error;
    }
  }
};
