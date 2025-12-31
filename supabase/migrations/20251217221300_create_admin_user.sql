-- Create pgcrypto extension for password hashing in extensions schema
create extension if not exists "pgcrypto" with schema "extensions";

-- Insert 'dev@daechang.com' user if not exists
DO $$
DECLARE
  new_user_id uuid := gen_random_uuid();
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'dev@daechang.com') THEN
    -- Insert into auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      new_user_id,
      'authenticated',
      'authenticated',
      'dev@daechang.com',
      extensions.crypt('1234', extensions.gen_salt('bf')), -- Explicitly use extensions schema
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      now(),
      now()
    );

    -- Insert into public.admins
    INSERT INTO public.admins (id, email)
    VALUES (new_user_id, 'dev@daechang.com');
  END IF;
END $$;
