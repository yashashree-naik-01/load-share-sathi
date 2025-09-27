import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, Plus, Route, MapPin, Calendar, Weight, IndianRupee, LogOut, Search, Loader2, Package } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabase, type TruckRoute, type FarmerLoad, type Profile } from "@/hooks/useSupabase";
import { useAuth } from "@/hooks/useAuth";

const TruckDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { truckRoutes, farmerLoads, bookings, loading, createTruckRoute } = useSupabase();
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const [showRouteForm, setShowRouteForm] = useState(false);
  const [formData, setFormData] = useState({
    fromLocation: '',
    toLocation: '',
    availableDate: '',
    capacity: '',
    pricePerKm: '',
    vehicleType: ''
  });

  const indianCities = [
    'Mumbai, Maharashtra', 'Delhi, Delhi', 'Pune, Maharashtra', 'Ahmedabad, Gujarat',
    'Nagpur, Maharashtra', 'Indore, Madhya Pradesh', 'Surat, Gujarat', 'Jaipur, Rajasthan',
    'Lucknow, Uttar Pradesh', 'Kanpur, Uttar Pradesh', 'Bhopal, Madhya Pradesh',
    'Coimbatore, Tamil Nadu', 'Nashik, Maharashtra', 'Agra, Uttar Pradesh'
  ];

  const vehicleTypes = [
    'Mini Truck (Tata Ace)', 'Small Truck (7-8 MT)', 'Medium Truck (10-12 MT)',
    'Large Truck (15-20 MT)', 'Trailer (25+ MT)', 'Tempo Traveller'
  ];

  useEffect(() => {
    // Redirect if not authenticated or not a truck owner
    if (!authLoading && (!user || !profile)) {
      navigate('/login');
      return;
    }
    
    if (!authLoading && profile && profile.user_type !== 'truck_owner') {
      navigate('/farmer-dashboard');
      return;
    }
  }, [user, profile, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fromLocation || !formData.toLocation || !formData.capacity || !profile) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newRoute = {
        truck_owner_id: profile.id,
        vehicle_type: formData.vehicleType || 'Truck',
        capacity: parseFloat(formData.capacity),
        capacity_unit: 'kg',
        start_location: formData.fromLocation,
        end_location: formData.toLocation,
        available_date: formData.availableDate || new Date().toISOString().split('T')[0],
        available_time: null,
        price_per_km: parseFloat(formData.pricePerKm) || 25,
        status: 'available' as const
      };

      await createTruckRoute(newRoute);

      toast({
        title: "Route Posted Successfully!",
        description: "Your route has been posted and farmers will be notified."
      });

      setFormData({
        fromLocation: '',
        toLocation: '',
        availableDate: '',
        capacity: '',
        pricePerKm: '',
        vehicleType: ''
      });
      setShowRouteForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post route. Please try again.",
        variant: "destructive"
      });
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const acceptLoad = (load: FarmerLoad) => {
    toast({
      title: "Load Request Accepted!",
      description: `You've accepted a load request. Contact details will be shared.`
    });
    
    // In a real app, this would notify the farmer and create a booking
    console.log('Accepted load:', load);
  };

  const calculateDistance = (from: string, to: string) => {
    // Simplified distance calculation for demo
    const distances: { [key: string]: number } = {
      'Mumbai-Delhi': 1400,
      'Mumbai-Pune': 150,
      'Delhi-Jaipur': 280,
      'Pune-Nashik': 200,
      'Mumbai-Ahmedabad': 530,
      // Add more route distances as needed
    };
    
    const key = `${from.split(',')[0]}-${to.split(',')[0]}`;
    const reverseKey = `${to.split(',')[0]}-${from.split(',')[0]}`;
    
    return distances[key] || distances[reverseKey] || Math.floor(Math.random() * 800) + 200;
  };

  const isRouteCompatible = (route: TruckRoute, load: FarmerLoad) => {
    const routeCapacity = route.capacity;
    const loadWeight = load.quantity;
    
    // Check if truck has enough capacity and route is compatible
    return routeCapacity >= loadWeight && 
           (route.start_location.includes(load.pickup_location.split(',')[0]) || 
            route.end_location.includes(load.destination.split(',')[0]));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Get truck owner's routes and available loads
  const userRoutes = truckRoutes.filter(route => route.truck_owner_id === profile.id);
  const availableLoads = farmerLoads.filter(load => load.status === 'pending');

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">RuralLink</span>
            </div>
            <span className="text-muted-foreground">Truck Owner Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-foreground">Welcome, {profile.full_name}</span>
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Routes</h1>
            <p className="text-muted-foreground">Manage your vehicle routes and find loads</p>
          </div>
          <Button variant="truck" onClick={() => setShowRouteForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Post New Route
          </Button>
        </div>

        {/* Post Route Form */}
        {showRouteForm && (
          <Card className="mb-8 shadow-soft">
            <CardHeader>
              <CardTitle className="text-secondary">Post New Route</CardTitle>
              <CardDescription>
                Provide details about your available route and capacity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fromLocation">From Location *</Label>
                  <Select onValueChange={(value) => updateFormData('fromLocation', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select starting city" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianCities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toLocation">To Location *</Label>
                  <Select onValueChange={(value) => updateFormData('toLocation', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination city" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianCities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="vehicleType">Vehicle Type</Label>
                  <Select onValueChange={(value) => updateFormData('vehicleType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle type" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="capacity">Available Capacity (tons) *</Label>
                  <Input
                    id="capacity"
                    value={formData.capacity}
                    onChange={(e) => updateFormData('capacity', e.target.value)}
                    placeholder="e.g., 7.5"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availableDate">Available Date</Label>
                  <Input
                    id="availableDate"
                    type="date"
                    value={formData.availableDate}
                    onChange={(e) => updateFormData('availableDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pricePerKm">Price per KM (₹)</Label>
                  <Input
                    id="pricePerKm"
                    value={formData.pricePerKm}
                    onChange={(e) => updateFormData('pricePerKm', e.target.value)}
                    placeholder="e.g., 25"
                  />
                </div>

                <div className="flex space-x-4 md:col-span-2">
                  <Button type="submit" variant="truck">
                    Post Route
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setShowRouteForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* My Routes */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">My Routes</h2>
            <div className="space-y-4">
              {userRoutes.length === 0 ? (
                <Card className="text-center py-8">
                  <CardContent>
                    <Route className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No routes posted</h3>
                    <p className="text-muted-foreground mb-4">
                      Post your first route to start finding loads
                    </p>
                    <Button variant="truck" onClick={() => setShowRouteForm(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Post Route
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                userRoutes.map(route => (
                  <Card key={route.id} className="shadow-soft">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-secondary">{route.vehicle_type || 'Truck'}</CardTitle>
                        <CardDescription className="flex items-center space-x-4 mt-2">
                          <span className="flex items-center">
                            <Weight className="h-4 w-4 mr-1" />
                            {route.capacity} {route.capacity_unit}
                          </span>
                          <span className="flex items-center">
                            <IndianRupee className="h-4 w-4 mr-1" />
                            ₹{route.price_per_km}/km
                          </span>
                        </CardDescription>
                      </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                          route.status === 'available' ? 'bg-accent text-accent-foreground' : 'bg-secondary text-secondary-foreground'
                        }`}>
                          {route.status === 'available' ? 'Available' : 'Booked'}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>From: {route.start_location}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>To: {route.end_location}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Available: {new Date(route.available_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Available Loads */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Available Loads</h2>
            <div className="space-y-4">
              {availableLoads.length === 0 ? (
                <Card className="text-center py-8">
                  <CardContent>
                    <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No loads available</h3>
                    <p className="text-muted-foreground">
                      Check back later for new load requests from farmers
                    </p>
                  </CardContent>
                </Card>
              ) : (
                availableLoads.map(load => {
                  const distance = calculateDistance(load.pickup_location, load.destination);
                  const isCompatible = userRoutes.some(route => isRouteCompatible(route, load));
                  // Remove farmer profile lookup for now
                  
                  return (
                    <Card key={load.id} className={`shadow-soft ${isCompatible ? 'border-primary border-2' : ''}`}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-primary">{load.crop_type}</CardTitle>
                          <CardDescription className="flex items-center space-x-4 mt-2">
                            <span className="flex items-center">
                              <Weight className="h-4 w-4 mr-1" />
                              {load.quantity} {load.unit}
                            </span>
                            <span className="flex items-center">
                              <IndianRupee className="h-4 w-4 mr-1" />
                              ₹{load.estimated_price || 'Negotiable'}
                            </span>
                          </CardDescription>
                        </div>
                          {isCompatible && (
                            <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                              Compatible
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>From: {load.pickup_location}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>To: {load.destination}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Route className="h-4 w-4 mr-2" />
                          <span>Distance: ~{distance} km</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Pickup: {new Date(load.pickup_date).toLocaleDateString()}</span>
                        </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            Farmer Load Request
                          </div>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => acceptLoad(load)}
                          >
                            Accept Load
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TruckDashboard;