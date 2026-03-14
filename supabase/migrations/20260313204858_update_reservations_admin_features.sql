/*
  # Update reservations for full admin management

  ## Summary
  Extends the reservations system to support a full-featured admin panel.

  ## Changes

  ### 1. reservations table
  - Add `rejected` and `manual` to the status enum
    - `rejected` — admin explicitly rejected the reservation
    - `manual` — admin manually entered (e.g. from Booking.com)
  - Add `is_manual` boolean column to distinguish admin-created entries
  - Add `internal_note` text column for admin-only notes

  ### 2. blocked_dates table
  - No structural changes needed

  ## Notes
  - Uses safe ALTER with DO blocks to avoid errors if columns exist
  - All existing data is preserved
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'is_manual'
  ) THEN
    ALTER TABLE reservations ADD COLUMN is_manual boolean NOT NULL DEFAULT false;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'reservations' AND column_name = 'internal_note'
  ) THEN
    ALTER TABLE reservations ADD COLUMN internal_note text NOT NULL DEFAULT '';
  END IF;
END $$;

ALTER TABLE reservations
  DROP CONSTRAINT IF EXISTS reservations_status_check;

ALTER TABLE reservations
  ADD CONSTRAINT reservations_status_check
  CHECK (status IN ('pending', 'confirmed', 'cancelled', 'rejected', 'manual'));
