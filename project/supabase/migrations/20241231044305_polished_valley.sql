/*
  # Add feedback and universities tables

  1. New Tables
    - `feedback`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `subject` (text)
      - `message` (text)
      - `created_at` (timestamp)
    
    - `universities`
      - `id` (uuid, primary key)
      - `name` (text)
      - `location` (text)
      - `acceptance_rate` (numeric)
      - `annual_fees` (numeric)
      - `description` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for feedback and universities
*/

-- Feedback Table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can create feedback"
  ON feedback FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own feedback"
  ON feedback FOR SELECT
  USING (auth.uid() = user_id);

-- Universities Table
CREATE TABLE IF NOT EXISTS universities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text NOT NULL,
  acceptance_rate numeric CHECK (acceptance_rate >= 0 AND acceptance_rate <= 100),
  annual_fees numeric CHECK (annual_fees >= 0),
  description text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE universities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Universities are viewable by everyone"
  ON universities FOR SELECT
  USING (true);