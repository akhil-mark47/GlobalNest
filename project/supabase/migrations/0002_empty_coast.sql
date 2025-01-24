/*
  # Create Housing and Jobs Tables

  1. New Tables
    - `housing`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `price` (numeric)
      - `location` (jsonb)
      - `available_from` (date)
      - `available_until` (date)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `jobs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `company` (text)
      - `description` (text)
      - `location` (jsonb)
      - `type` (text)
      - `salary` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for CRUD operations
*/

-- Housing Table
CREATE TABLE IF NOT EXISTS housing (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  location jsonb NOT NULL,
  available_from date NOT NULL,
  available_until date NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CHECK (available_from <= available_until)
);

ALTER TABLE housing ENABLE ROW LEVEL SECURITY;

-- Housing Policies
CREATE POLICY "Housing listings are viewable by everyone"
  ON housing FOR SELECT
  USING (true);

CREATE POLICY "Users can create housing listings"
  ON housing FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own housing listings"
  ON housing FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own housing listings"
  ON housing FOR DELETE
  USING (auth.uid() = user_id);

-- Jobs Table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  company text NOT NULL,
  description text NOT NULL,
  location jsonb NOT NULL,
  type text NOT NULL,
  salary text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Jobs Policies
CREATE POLICY "Job listings are viewable by everyone"
  ON jobs FOR SELECT
  USING (true);

CREATE POLICY "Users can create job listings"
  ON jobs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own job listings"
  ON jobs FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own job listings"
  ON jobs FOR DELETE
  USING (auth.uid() = user_id);