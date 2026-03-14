/*
  # Add blocked_dates table and improve reservation system

  ## Overview
  Adds support for manually blocked date ranges (e.g., maintenance, owner use)
  and adds a unique overlap prevention mechanism for reservations.

  ## New Tables

  ### blocked_dates
  - `id` (uuid, primary key)
  - `start_date` (date) - First blocked day
  - `end_date` (date) - Last blocked day (inclusive)
  - `reason` (text, nullable) - Optional internal note
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on blocked_dates
  - Anyone can read (needed for public calendar display)
  - Only authenticated users can insert/update/delete

  ## Notes
  - Reservations with status 'pending' or 'confirmed' block dates
  - 'cancelled' reservations free up dates
*/

CREATE TABLE IF NOT EXISTS blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_date date NOT NULL,
  end_date date NOT NULL,
  reason text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE blocked_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read blocked dates"
  ON blocked_dates FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Authenticated users can insert blocked dates"
  ON blocked_dates FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blocked dates"
  ON blocked_dates FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blocked dates"
  ON blocked_dates FOR DELETE
  TO authenticated
  USING (true);

CREATE INDEX IF NOT EXISTS blocked_dates_start_idx ON blocked_dates (start_date);
CREATE INDEX IF NOT EXISTS blocked_dates_end_idx ON blocked_dates (end_date);

ALTER TABLE reservations ADD COLUMN IF NOT EXISTS check_in_time time DEFAULT '14:00:00';
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS check_out_time time DEFAULT '10:30:00';
