/*
  # Add overlap prevention for reservations

  ## Summary
  Prevents double-bookings at the database level using a PostgreSQL exclusion constraint
  via the btree_gist extension. Also adds indexes for faster availability queries.

  ## Changes

  ### 1. Enable btree_gist extension
  Required for the daterange exclusion constraint.

  ### 2. reservations table
  - Add exclusion constraint: no two active reservations (pending, confirmed, manual)
    can have overlapping check_in/check_out ranges.
  - Active statuses: 'pending', 'confirmed', 'manual'
  - Cancelled and rejected reservations do NOT block dates.

  ### 3. Indexes
  - Index on (status) for fast filtering
  - Index on (check_in, check_out) for range queries

  ## Notes
  - Uses daterange with '&&' (overlaps) operator
  - The constraint fires on INSERT and UPDATE
  - Admin manual entries with status 'manual' are also protected
*/

CREATE EXTENSION IF NOT EXISTS btree_gist;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'reservations_no_overlap'
  ) THEN
    ALTER TABLE reservations
      ADD CONSTRAINT reservations_no_overlap
      EXCLUDE USING gist (
        daterange(check_in, check_out, '[)') WITH &&
      )
      WHERE (status IN ('pending', 'confirmed', 'manual'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_dates ON reservations(check_in, check_out);
CREATE INDEX IF NOT EXISTS idx_blocked_dates_range ON blocked_dates(start_date, end_date);
