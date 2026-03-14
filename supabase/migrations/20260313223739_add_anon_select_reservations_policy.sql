/*
  # Allow anonymous users to read reservation availability data

  1. Security Changes
    - Add SELECT policy for `anon` role on `reservations` table
    - This allows the public reservation calendar to see which dates are occupied
    - Only date and status columns are exposed (enforced at application level)

  2. Notes
    - Required for the public availability calendar and conflict detection
    - Without this, the calendar shows all dates as free and duplicate bookings are possible
*/

CREATE POLICY "Anyone can view reservation dates"
  ON reservations FOR SELECT
  TO anon
  USING (status IN ('pending', 'confirmed', 'manual'));
