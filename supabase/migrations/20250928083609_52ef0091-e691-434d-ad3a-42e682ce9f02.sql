-- Fix the function search path security warning
CREATE OR REPLACE FUNCTION get_available_capacity(route_id UUID)
RETURNS NUMERIC 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;