-- Add additional_info column to biographies table
alter table public.biographies
add column additional_info text;

-- Add unique constraint to user_id
alter table public.biographies
add constraint unique_user_id unique (user_id);
