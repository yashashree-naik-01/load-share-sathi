-- Simple approach: Just add the column and update status values
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS initiator_type text DEFAULT 'farmer';

-- Update all existing rows to have the initiator_type
UPDATE public.bookings 
SET initiator_type = 'farmer' 
WHERE initiator_type IS NULL;

-- Make the column NOT NULL after setting default values
ALTER TABLE public.bookings 
ALTER COLUMN initiator_type SET NOT NULL;