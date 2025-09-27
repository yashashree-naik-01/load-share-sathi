import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Profile {
  id: string;
  user_id: string;
  user_type: 'farmer' | 'truck_owner';
  full_name: string;
  phone: string;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface FarmerLoad {
  id: string;
  farmer_id: string;
  crop_type: string;
  quantity: number;
  unit: string;
  pickup_location: string;
  destination: string;
  pickup_date: string;
  pickup_time?: string;
  estimated_price?: number;
  status: 'pending' | 'matched' | 'booked' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface TruckRoute {
  id: string;
  truck_owner_id: string;
  vehicle_type: string;
  capacity: number;
  capacity_unit: string;
  start_location: string;
  end_location: string;
  available_date: string;
  available_time?: string;
  price_per_km: number;
  status: 'available' | 'matched' | 'booked' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  farmer_load_id: string;
  truck_route_id: string;
  farmer_id: string;
  truck_owner_id: string;
  total_price: number;
  distance_km?: number;
  status: 'pending' | 'confirmed' | 'in_transit' | 'completed' | 'cancelled';
  booking_date: string;
  completion_date?: string;
  created_at: string;
  updated_at: string;
}

export const useSupabase = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [farmerLoads, setFarmerLoads] = useState<FarmerLoad[]>([]);
  const [truckRoutes, setTruckRoutes] = useState<TruckRoute[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [profilesRes, loadsRes, routesRes, bookingsRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('farmer_loads').select('*'),
        supabase.from('truck_routes').select('*'),
        supabase.from('bookings').select('*')
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (loadsRes.error) throw loadsRes.error;
      if (routesRes.error) throw routesRes.error;
      if (bookingsRes.error) throw bookingsRes.error;

      setProfiles(profilesRes.data as Profile[] || []);
      setFarmerLoads(loadsRes.data as FarmerLoad[] || []);
      setTruckRoutes(routesRes.data as TruckRoute[] || []);
      setBookings(bookingsRes.data as Booking[] || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Create functions
  const createFarmerLoad = async (load: Omit<FarmerLoad, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('farmer_loads')
      .insert(load)
      .select()
      .single();
    
    if (error) throw error;
    setFarmerLoads(prev => [...prev, data as FarmerLoad]);
    return data as FarmerLoad;
  };

  const createTruckRoute = async (route: Omit<TruckRoute, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('truck_routes')
      .insert(route)
      .select()
      .single();
    
    if (error) throw error;
    setTruckRoutes(prev => [...prev, data as TruckRoute]);
    return data as TruckRoute;
  };

  const createBooking = async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'booking_date'>) => {
    const { data, error } = await supabase
      .from('bookings')
      .insert(booking)
      .select()
      .single();
    
    if (error) throw error;
    setBookings(prev => [...prev, data as Booking]);
    return data as Booking;
  };

  const updateLoadStatus = async (loadId: string, status: FarmerLoad['status']) => {
    const { data, error } = await supabase
      .from('farmer_loads')
      .update({ status })
      .eq('id', loadId)
      .select()
      .single();
    
    if (error) throw error;
    setFarmerLoads(prev => prev.map(load => load.id === loadId ? data as FarmerLoad : load));
    return data as FarmerLoad;
  };

  const updateTruckRouteStatus = async (routeId: string, status: TruckRoute['status']) => {
    const { data, error } = await supabase
      .from('truck_routes')
      .update({ status })
      .eq('id', routeId)
      .select()
      .single();
    
    if (error) throw error;
    setTruckRoutes(prev => prev.map(route => route.id === routeId ? data as TruckRoute : route));
    return data as TruckRoute;
  };

  return {
    profiles,
    farmerLoads,
    truckRoutes,
    bookings,
    loading,
    createFarmerLoad,
    createTruckRoute,
    createBooking,
    updateLoadStatus,
    updateTruckRouteStatus,
    refetch: fetchData
  };
};