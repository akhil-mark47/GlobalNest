/*
  # Add contact fields to housing and jobs tables

  1. Changes
    - Add contact_email and contact_phone columns to housing table
    - Add contact_email and contact_phone columns to jobs table
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'housing' AND column_name = 'contact_email'
  ) THEN
    ALTER TABLE housing ADD COLUMN contact_email text NOT NULL;
    ALTER TABLE housing ADD COLUMN contact_phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'jobs' AND column_name = 'contact_email'
  ) THEN
    ALTER TABLE jobs ADD COLUMN contact_email text NOT NULL;
    ALTER TABLE jobs ADD COLUMN contact_phone text;
  END IF;
END $$;