-- Create profiles table for user information (simplified for prototyping)
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  user_type TEXT NOT NULL CHECK (user_type IN ('farmer', 'truck_owner')),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create farmer_loads table
CREATE TABLE public.farmer_loads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  crop_type TEXT NOT NULL,
  quantity DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  pickup_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  pickup_date DATE NOT NULL,
  pickup_time TIME,
  estimated_price DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'matched', 'booked', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create truck_routes table
CREATE TABLE public.truck_routes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vehicle_type TEXT NOT NULL,
  capacity DECIMAL(10,2) NOT NULL,
  capacity_unit TEXT NOT NULL DEFAULT 'kg',
  start_location TEXT NOT NULL,
  end_location TEXT NOT NULL,
  available_date DATE NOT NULL,
  available_time TIME,
  price_per_km DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'matched', 'booked', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_load_id UUID NOT NULL REFERENCES public.farmer_loads(id) ON DELETE CASCADE,
  truck_route_id UUID NOT NULL REFERENCES public.truck_routes(id) ON DELETE CASCADE,
  farmer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  truck_owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  total_price DECIMAL(10,2) NOT NULL,
  distance_km DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'in_transit', 'completed', 'cancelled')),
  booking_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completion_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farmer_loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.truck_routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (can be updated when auth is implemented)
CREATE POLICY "Allow all access for now" ON public.profiles FOR ALL USING (true);
CREATE POLICY "Allow all access for now" ON public.farmer_loads FOR ALL USING (true);
CREATE POLICY "Allow all access for now" ON public.truck_routes FOR ALL USING (true);
CREATE POLICY "Allow all access for now" ON public.bookings FOR ALL USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_farmer_loads_updated_at
  BEFORE UPDATE ON public.farmer_loads
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_truck_routes_updated_at
  BEFORE UPDATE ON public.truck_routes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert dummy data for profiles
INSERT INTO public.profiles (id, user_id, user_type, full_name, phone, location) VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, '11111111-1111-1111-1111-111111111111'::uuid, 'farmer', 'Rajesh Kumar', '+91-9876543210', 'Mumbai, Maharashtra'),
  ('22222222-2222-2222-2222-222222222222'::uuid, '22222222-2222-2222-2222-222222222222'::uuid, 'farmer', 'Priya Sharma', '+91-9876543211', 'Pune, Maharashtra'),
  ('33333333-3333-3333-3333-333333333333'::uuid, '33333333-3333-3333-3333-333333333333'::uuid, 'truck_owner', 'Vikram Singh', '+91-9876543212', 'Delhi, Delhi'),
  ('44444444-4444-4444-4444-444444444444'::uuid, '44444444-4444-4444-4444-444444444444'::uuid, 'truck_owner', 'Amit Patel', '+91-9876543213', 'Ahmedabad, Gujarat');

-- Insert dummy farmer loads
INSERT INTO public.farmer_loads (farmer_id, crop_type, quantity, unit, pickup_location, destination, pickup_date, pickup_time, estimated_price, status) VALUES
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Rice', 1000, 'kg', 'Mumbai, Maharashtra', 'Pune, Maharashtra', '2024-02-15', '09:00', 5000, 'pending'),
  ('11111111-1111-1111-1111-111111111111'::uuid, 'Wheat', 2000, 'kg', 'Mumbai, Maharashtra', 'Delhi, Delhi', '2024-02-20', '08:00', 12000, 'pending'),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Tomatoes', 500, 'kg', 'Pune, Maharashtra', 'Mumbai, Maharashtra', '2024-02-18', '07:00', 3000, 'pending'),
  ('22222222-2222-2222-2222-222222222222'::uuid, 'Onions', 1500, 'kg', 'Pune, Maharashtra', 'Nashik, Maharashtra', '2024-02-22', '06:00', 4500, 'pending');

-- Insert dummy truck routes
INSERT INTO public.truck_routes (truck_owner_id, vehicle_type, capacity, capacity_unit, start_location, end_location, available_date, available_time, price_per_km, status) VALUES
  ('33333333-3333-3333-3333-333333333333'::uuid, 'Mini Truck', 1500, 'kg', 'Delhi, Delhi', 'Mumbai, Maharashtra', '2024-02-15', '10:00', 25, 'available'),
  ('33333333-3333-3333-3333-333333333333'::uuid, 'Pickup Truck', 800, 'kg', 'Mumbai, Maharashtra', 'Pune, Maharashtra', '2024-02-16', '09:00', 20, 'available'),
  ('44444444-4444-4444-4444-444444444444'::uuid, 'Tempo', 2000, 'kg', 'Ahmedabad, Gujarat', 'Mumbai, Maharashtra', '2024-02-18', '08:00', 22, 'available'),
  ('44444444-4444-4444-4444-444444444444'::uuid, 'Large Truck', 5000, 'kg', 'Pune, Maharashtra', 'Delhi, Delhi', '2024-02-20', '07:00', 30, 'available');

-- Insert dummy bookings
INSERT INTO public.bookings (farmer_load_id, truck_route_id, farmer_id, truck_owner_id, total_price, distance_km, status) VALUES
  (
    (SELECT id FROM public.farmer_loads WHERE crop_type = 'Rice' LIMIT 1),
    (SELECT id FROM public.truck_routes WHERE vehicle_type = 'Pickup Truck' LIMIT 1),
    '11111111-1111-1111-1111-111111111111'::uuid,
    '33333333-3333-3333-3333-333333333333'::uuid,
    3200,
    160,
    'pending'
  );