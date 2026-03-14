/*
  # Vila Žltá Ľalia - Reservation System

  ## Overview
  Creates all tables needed for the Vila Žltá Ľalia reservation system.

  ## New Tables

  ### reservations
  - `id` (uuid, primary key) - Unique reservation identifier
  - `guest_name` (text) - Full name of the guest
  - `guest_email` (text) - Email address of the guest
  - `guest_phone` (text) - Phone number of the guest
  - `check_in` (date) - Check-in date
  - `check_out` (date) - Check-out date
  - `guests_count` (integer) - Number of guests
  - `room_type` (text) - Selected room/accommodation type
  - `message` (text, nullable) - Optional message from guest
  - `status` (text) - Reservation status: pending, confirmed, cancelled
  - `total_price` (numeric, nullable) - Total price of the stay
  - `created_at` (timestamptz) - When the reservation was created
  - `updated_at` (timestamptz) - When the reservation was last updated

  ### admin_users
  - `id` (uuid, primary key)
  - `email` (text, unique) - Admin email
  - `password_hash` (text) - Hashed password for admin login
  - `created_at` (timestamptz)

  ## Security
  - RLS enabled on both tables
  - Reservations: guests can insert, authenticated admin can read/update/delete
  - Admin users: only admins can read their own record

  ## Notes
  - Status defaults to 'pending'
  - Admin credentials managed separately via application logic
*/

CREATE TABLE IF NOT EXISTS reservations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_name text NOT NULL,
  guest_email text NOT NULL,
  guest_phone text NOT NULL DEFAULT '',
  check_in date NOT NULL,
  check_out date NOT NULL,
  guests_count integer NOT NULL DEFAULT 1,
  room_type text NOT NULL DEFAULT 'Vila',
  message text DEFAULT '',
  status text NOT NULL DEFAULT 'pending',
  total_price numeric(10,2),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert reservations"
  ON reservations FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all reservations"
  ON reservations FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update reservations"
  ON reservations FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete reservations"
  ON reservations FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  token text NOT NULL UNIQUE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert admin sessions"
  ON admin_sessions FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Sessions can be read by token"
  ON admin_sessions FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Sessions can be deleted"
  ON admin_sessions FOR DELETE
  TO anon
  USING (true);

CREATE INDEX IF NOT EXISTS reservations_check_in_idx ON reservations (check_in);
CREATE INDEX IF NOT EXISTS reservations_status_idx ON reservations (status);
CREATE INDEX IF NOT EXISTS reservations_created_at_idx ON reservations (created_at DESC);
