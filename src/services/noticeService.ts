
import { supabase } from "@/integrations/supabase/client";
import type { Notice } from "@/types/notice";

export const fetchNotices = async (limit?: number): Promise<Notice[]> => {
  let query = supabase
    .from("notices")
    .select("*")
    .order("created_at", { ascending: false })
    .eq("published", true);
  
  if (limit) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  
  if (error) {
    console.error("Error fetching notices:", error);
    throw error;
  }
  
  return data || [];
};

export const fetchNoticeById = async (id: string): Promise<Notice | null> => {
  const { data, error } = await supabase
    .from("notices")
    .select("*")
    .eq("id", id)
    .single();
  
  if (error) {
    console.error(`Error fetching notice ${id}:`, error);
    return null;
  }
  
  return data;
};

export const createNotice = async (notice: Omit<Notice, "id" | "created_at" | "updated_at">): Promise<Notice> => {
  const { data, error } = await supabase
    .from("notices")
    .insert([notice])
    .select()
    .single();
  
  if (error) {
    console.error("Error creating notice:", error);
    throw error;
  }
  
  return data;
};

export const updateNotice = async (id: string, notice: Partial<Notice>): Promise<Notice> => {
  const { data, error } = await supabase
    .from("notices")
    .update({ ...notice, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    console.error(`Error updating notice ${id}:`, error);
    throw error;
  }
  
  return data;
};

export const deleteNotice = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("notices")
    .delete()
    .eq("id", id);
  
  if (error) {
    console.error(`Error deleting notice ${id}:`, error);
    throw error;
  }
};

export const uploadNoticeFile = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from("notices")
    .upload(filePath, file);

  if (error) {
    console.error("Error uploading file:", error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from("notices")
    .getPublicUrl(filePath);

  return publicUrl;
};
