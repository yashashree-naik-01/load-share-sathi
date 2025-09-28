-- Add DL number and number plate to truck routes
ALTER TABLE public.truck_routes 
ADD COLUMN dl_number TEXT,
ADD COLUMN number_plate TEXT;

-- Add booked_capacity to track partial bookings
ALTER TABLE public.truck_routes 
ADD COLUMN booked_capacity NUMERIC DEFAULT 0;

-- Add a function to calculate available capacity
CREATE OR REPLACE FUNCTION get_available_capacity(route_id UUID)
RETURNS NUMERIC AS $$
DECLARE
    total_capacity NUMERIC;
    used_capacity NUMERIC;
BEGIN
    SELECT capacity INTO total_capacity 
    FROM truck_routes 
    WHERE id = route_id;
    
    SELECT COALESCE(SUM(fl.quantity), 0) INTO used_capacity
    FROM bookings b
    JOIN farmer_loads fl ON b.farmer_load_id = fl.id
    WHERE b.truck_route_id = route_id 
    AND b.status IN ('confirmed', 'pending_farmer_acceptance', 'pending_truck_acceptance');
    
    RETURN total_capacity - used_capacity;
END;
$$ LANGUAGE plpgsql;