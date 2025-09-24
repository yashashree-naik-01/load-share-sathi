import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, Plus, Route, MapPin, Calendar, Weight, IndianRupee, LogOut, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TruckRoute {
  id: string;
  fromLocation: string;
  toLocation: string;
  availableDate: string;
  capacity: string;
  pricePerKm: string;
  vehicleType: string;
  status: 'available' | 'booked';
}

interface LoadRequest {
  id: string;
  goodsType: string;
  weight: string;
  pickupLocation: string;
  dropLocation: string;
  pickupDate: string;
  expectedPrice: string;
  farmerName: string;
  farmerPhone: string;
  farmerId: string;
}

const TruckDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [routes, setRoutes] = useState<TruckRoute[]>([]);
  const [availableLoads, setAvailableLoads] = useState<LoadRequest[]>([]);
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
    const storedUser = localStorage.getItem('rurallink_user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    if (userData.type !== 'truck') {
      navigate('/farmer-dashboard');
      return;
    }
    
    setUser(userData);
    
    // Load truck routes
    const storedRoutes = localStorage.getItem(`routes_${userData.id}`) || '[]';
    setRoutes(JSON.parse(storedRoutes));
    
    // Load available loads
    const globalLoads = JSON.parse(localStorage.getItem('global_loads') || '[]');
    setAvailableLoads(globalLoads);
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fromLocation || !formData.toLocation || !formData.capacity) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newRoute: TruckRoute = {
      id: Date.now().toString(),
      ...formData,
      status: 'available'
    };

    const updatedRoutes = [...routes, newRoute];
    setRoutes(updatedRoutes);
    localStorage.setItem(`routes_${user.id}`, JSON.stringify(updatedRoutes));

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
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('rurallink_user');
    navigate('/');
  };

  const acceptLoad = (load: LoadRequest) => {
    toast({
      title: "Load Request Accepted!",
      description: `You've accepted ${load.farmerName}'s load. Contact details will be shared.`
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

  const isRouteCompatible = (route: TruckRoute, load: LoadRequest) => {
    const routeCapacity = parseFloat(route.capacity);
    const loadWeight = parseFloat(load.weight);
    
    // Check if truck has enough capacity and route is compatible
    return routeCapacity >= loadWeight && 
           (route.fromLocation.includes(load.pickupLocation.split(',')[0]) || 
            route.toLocation.includes(load.dropLocation.split(',')[0]));
  };

  if (!user) return null;

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
            <span className="text-foreground">Welcome, {user.name}</span>
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
              {routes.length === 0 ? (
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
                routes.map(route => (
                  <Card key={route.id} className="shadow-soft">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-secondary">{route.vehicleType || 'Truck'}</CardTitle>
                          <CardDescription className="flex items-center space-x-4 mt-2">
                            <span className="flex items-center">
                              <Weight className="h-4 w-4 mr-1" />
                              {route.capacity} tons
                            </span>
                            <span className="flex items-center">
                              <IndianRupee className="h-4 w-4 mr-1" />
                              ₹{route.pricePerKm}/km
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
                          <span>From: {route.fromLocation}</span>
                        </div>
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>To: {route.toLocation}</span>
                        </div>
                        {route.availableDate && (
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Available: {new Date(route.availableDate).toLocaleDateString()}</span>
                          </div>
                        )}
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
                  const distance = calculateDistance(load.pickupLocation, load.dropLocation);
                  const isCompatible = routes.some(route => isRouteCompatible(route, load));
                  
                  return (
                    <Card key={load.id} className={`shadow-soft ${isCompatible ? 'border-primary border-2' : ''}`}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-primary">{load.goodsType}</CardTitle>
                            <CardDescription className="flex items-center space-x-4 mt-2">
                              <span className="flex items-center">
                                <Weight className="h-4 w-4 mr-1" />
                                {load.weight} tons
                              </span>
                              <span className="flex items-center">
                                <IndianRupee className="h-4 w-4 mr-1" />
                                ₹{load.expectedPrice || 'Negotiable'}
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
                            <span>From: {load.pickupLocation}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <MapPin className="h-4 w-4 mr-2" />
                            <span>To: {load.dropLocation}</span>
                          </div>
                          <div className="flex items-center text-muted-foreground">
                            <Route className="h-4 w-4 mr-2" />
                            <span>Distance: ~{distance} km</span>
                          </div>
                          {load.pickupDate && (
                            <div className="flex items-center text-muted-foreground">
                              <Calendar className="h-4 w-4 mr-2" />
                              <span>Pickup: {new Date(load.pickupDate).toLocaleDateString()}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-muted-foreground">
                            Farmer: {load.farmerName} | {load.farmerPhone}
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