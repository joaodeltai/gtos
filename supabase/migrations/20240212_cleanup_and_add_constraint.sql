-- Primeiro, vamos deletar as biografias duplicadas mantendo apenas a mais recente
DELETE FROM public.biographies a
WHERE a.ctid <> (
    SELECT b.ctid
    FROM public.biographies b
    WHERE b.user_id = a.user_id
    ORDER BY b.updated_at DESC
    LIMIT 1
);

-- Agora podemos adicionar a coluna additional_info
alter table public.biographies
add column if not exists additional_info text;

-- E finalmente adicionar a constraint unique
alter table public.biographies
add constraint unique_user_id unique (user_id);
