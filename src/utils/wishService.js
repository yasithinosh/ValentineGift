import { supabase } from './supabase';

export async function uploadImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `wishes/${fileName}`;

    const { error } = await supabase.storage
        .from('wish-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

    if (error) throw error;

    const { data } = supabase.storage
        .from('wish-images')
        .getPublicUrl(filePath);

    return data.publicUrl;
}

export async function createWish({ wishName, toName, fromName, message, templateId, imageUrl }) {
    // Don't pass user_id — the database default auth.uid() handles it
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('wishes')
        .insert([{
            wish_name: wishName.toLowerCase().trim(),
            to_name: toName,
            from_name: fromName,
            message,
            template_id: templateId,
            image_url: imageUrl || '',
        }])
        .select()
        .single();

    if (error) throw error;
    return data;
}

export async function getWishByName(wishName) {
    const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .eq('wish_name', wishName.toLowerCase().trim())
        .single();

    if (error) throw error;
    return data;
}

export async function getUserWishes() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase
        .from('wishes')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
}
