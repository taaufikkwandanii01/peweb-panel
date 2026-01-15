-- Migration Script: Sync approved users to usersProfiles table
-- This script creates usersProfiles entries for all approved users that don't have one yet
-- Run this ONCE to fix existing approved users

-- Note: This is a manual script to be run in Supabase SQL Editor
-- You'll need to adapt this to work with your Supabase setup

-- First, let's check if there are any approved users without profiles
-- (This is just for informational purposes)

-- SELECT 
--   u.id,
--   u.email,
--   u.raw_user_meta_data->>'full_name' as full_name,
--   u.raw_user_meta_data->>'role' as role,
--   u.raw_user_meta_data->>'status' as status
-- FROM auth.users u
-- LEFT JOIN public."usersProfiles" p ON u.id = p.id
-- WHERE 
--   u.raw_user_meta_data->>'status' = 'approved'
--   AND p.id IS NULL;

-- Insert approved users into usersProfiles if they don't exist
-- This query safely handles the migration

DO $$
DECLARE
  user_record RECORD;
  insert_count INTEGER := 0;
BEGIN
  -- Loop through all approved users without profiles
  FOR user_record IN 
    SELECT 
      u.id,
      u.email,
      u.raw_user_meta_data->>'full_name' as full_name,
      u.raw_user_meta_data->>'phone' as phone,
      u.raw_user_meta_data->>'role' as role,
      u.created_at
    FROM auth.users u
    LEFT JOIN public."usersProfiles" p ON u.id = p.id
    WHERE 
      u.raw_user_meta_data->>'status' = 'approved'
      AND p.id IS NULL
  LOOP
    -- Insert profile for each approved user
    INSERT INTO public."usersProfiles" (
      id,
      email,
      full_name,
      phone,
      role,
      location,
      bio,
      github,
      linkedin,
      expertise,
      created_at,
      updated_at
    ) VALUES (
      user_record.id,
      user_record.email,
      COALESCE(user_record.full_name, 'User'),
      user_record.phone,
      COALESCE(user_record.role, 'developer'),
      NULL,
      NULL,
      NULL,
      NULL,
      NULL,
      user_record.created_at,
      NOW()
    )
    ON CONFLICT (id) DO NOTHING;
    
    insert_count := insert_count + 1;
  END LOOP;
  
  RAISE NOTICE 'Migration completed: % profiles created', insert_count;
END $$;

-- Verify the migration
SELECT 
  COUNT(*) as total_approved_users,
  COUNT(p.id) as users_with_profiles,
  COUNT(*) - COUNT(p.id) as users_without_profiles
FROM auth.users u
LEFT JOIN public."usersProfiles" p ON u.id = p.id
WHERE u.raw_user_meta_data->>'status' = 'approved';
