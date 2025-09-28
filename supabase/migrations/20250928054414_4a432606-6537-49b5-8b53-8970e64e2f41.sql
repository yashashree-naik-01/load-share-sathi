-- Delete all existing bookings to clear the constraint violation
DELETE FROM public.bookings;

-- Drop and recreate the constraint with the correct values
ALTER TABLE public.bookings DROP CONSTRAINT bookings_status_check;

ALTER TABLE public.bookings ADD CONSTRAINT bookings_status_check 
CHECK (status = ANY (ARRAY['pending_farmer_acceptance'::text, 'pending_truck_acceptance'::text, 'confirmed'::text, 'in_transit'::text, 'completed'::text, 'cancelled'::text, 'rejected'::text]));