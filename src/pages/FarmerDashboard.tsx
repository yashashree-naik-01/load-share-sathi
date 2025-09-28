import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Truck, Plus, Package, MapPin, Calendar, Weight, IndianRupee, LogOut, Loader2, Search, Phone, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabase, type FarmerLoad } from "@/hooks/useSupabase";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { farmerLoads, bookings, loading, createFarmerLoad } = useSupabase();
  const { user, profile, signOut, loading: authLoading } = useAuth();
  const [showPostForm, setShowPostForm] = useState(false);
  const [formData, setFormData] = useState({
    goodsType: '',
    weight: '',
    pickupLocation: '',
    dropLocation: '',
    pickupDate: '',
    expectedPrice: '',
    description: ''
  });

  const goodsTypes = [
    'Rice', 'Wheat', 'Sugarcane', 'Cotton', 'Vegetables', 'Fruits', 
    'Pulses', 'Spices', 'Dairy Products', 'Fertilizers', 'Seeds', 'Other'
  ];

  const indianCities = [
    'Mumbai, Maharashtra', 'Delhi, Delhi', 'Pune, Maharashtra', 'Ahmedabad, Gujarat',
    'Nagpur, Maharashtra', 'Indore, Madhya Pradesh', 'Surat, Gujarat', 'Jaipur, Rajasthan',
    'Lucknow, Uttar Pradesh', 'Kanpur, Uttar Pradesh', 'Bhopal, Madhya Pradesh',
    'Coimbatore, Tamil Nadu', 'Nashik, Maharashtra', 'Agra, Uttar Pradesh'
  ];

  useEffect(() => {
    // Redirect if not authenticated or not a farmer
    if (!authLoading && (!user || !profile)) {
      navigate('/login');
      return;
    }
    
    if (!authLoading && profile && profile.user_type !== 'farmer') {
      navigate('/truck-dashboard');
      return;
    }
  }, [user, profile, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.goodsType || !formData.weight || !formData.pickupLocation || !formData.dropLocation || !profile) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      const newLoad = {
        farmer_id: profile.id,
        crop_type: formData.goodsType,
        quantity: parseFloat(formData.weight),
        unit: 'kg',
        pickup_location: formData.pickupLocation,
        destination: formData.dropLocation,
        pickup_date: formData.pickupDate || new Date().toISOString().split('T')[0],
        pickup_time: null,
        estimated_price: formData.expectedPrice ? parseFloat(formData.expectedPrice) : null,
        status: 'pending' as const
      };

      await createFarmerLoad(newLoad);

      toast({
        title: "Load Posted Successfully!",
        description: "Your load has been posted and trucks will be notified."
      });

      setFormData({
        goodsType: '',
        weight: '',
        pickupLocation: '',
        dropLocation: '',
        pickupDate: '',
        expectedPrice: '',
        description: ''
      });
      setShowPostForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post load. Please try again.",
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

  const viewMatches = async (loadId: string) => {
    try {
      // Call AI matching engine
      const { data, error } = await supabase.functions.invoke('ai-matching-engine', {
        body: { loadId }
      });
      
      if (error) throw error;
      
      navigate(`/matches/${loadId}`, { state: { aiMatches: data.matches } });
    } catch (error) {
      console.error('Error getting AI matches:', error);
      navigate(`/matches/${loadId}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Get farmer's loads and bookings
  const userLoads = farmerLoads.filter(load => load.farmer_id === profile.id);
  const userBookings = bookings.filter(booking => booking.farmer_id === profile.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold text-primary">SmartLoad</span>
            </div>
            <span className="text-muted-foreground">Farmer Dashboard</span>
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
            <h1 className="text-3xl font-bold text-foreground">My Loads</h1>
            <p className="text-muted-foreground">Manage your transportation requests</p>
          </div>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => navigate('/matches/ai-find')}>
              <Search className="h-4 w-4 mr-2" />
              Find AI Matches
            </Button>
            <Button variant="default" onClick={() => setShowPostForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Post New Load
            </Button>
          </div>
        </div>

        {/* Post Load Form */}
        {showPostForm && (
          <Card className="mb-8 shadow-soft">
            <CardHeader>
              <CardTitle className="text-primary">Post New Load</CardTitle>
              <CardDescription>
                Provide details about your goods that need transportation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="goodsType">Goods Type *</Label>
                  <Select onValueChange={(value) => updateFormData('goodsType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select goods type" />
                    </SelectTrigger>
                    <SelectContent>
                      {goodsTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (in tons) *</Label>
                  <Input
                    id="weight"
                    value={formData.weight}
                    onChange={(e) => updateFormData('weight', e.target.value)}
                    placeholder="e.g., 5.5"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickupLocation">Pickup Location *</Label>
                  <Select onValueChange={(value) => updateFormData('pickupLocation', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pickup city" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianCities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dropLocation">Drop Location *</Label>
                  <Select onValueChange={(value) => updateFormData('dropLocation', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select drop city" />
                    </SelectTrigger>
                    <SelectContent>
                      {indianCities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pickupDate">Pickup Date</Label>
                  <Input
                    id="pickupDate"
                    type="date"
                    value={formData.pickupDate}
                    onChange={(e) => updateFormData('pickupDate', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expectedPrice">Expected Price (₹)</Label>
                  <Input
                    id="expectedPrice"
                    value={formData.expectedPrice}
                    onChange={(e) => updateFormData('expectedPrice', e.target.value)}
                    placeholder="e.g., 15000"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Additional Details</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData('description', e.target.value)}
                    placeholder="Any special requirements or notes..."
                  />
                </div>

                <div className="flex space-x-4 md:col-span-2">
                  <Button type="submit" variant="farmer">
                    Post Load
                  </Button>
                  <Button type="button" variant="ghost" onClick={() => setShowPostForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Loads List */}
        <div className="grid gap-6">
          {userLoads.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No loads posted yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by posting your first load to find trucks
                </p>
                <Button variant="farmer" onClick={() => setShowPostForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Load
                </Button>
              </CardContent>
            </Card>
          ) : (
            userLoads.map(load => (
              <Card key={load.id} className="shadow-soft">
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
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                    load.status === 'pending' ? 'bg-accent text-accent-foreground' :
                    load.status === 'matched' ? 'bg-primary text-primary-foreground' :
                    'bg-secondary text-secondary-foreground'
                  }`}>
                    {load.status === 'pending' ? 'Posted' : 
                     load.status === 'matched' ? 'Matched' : 'Booked'}
                  </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>From: {load.pickup_location}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>To: {load.destination}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Pickup: {new Date(load.pickup_date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => viewMatches(load.id)}
                      disabled={load.status === 'booked' || load.status === 'completed'}
                    >
                      {load.status === 'booked' ? 'Booked' : load.status === 'completed' ? 'Completed' : 'View Matches'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Bookings Section */}
        {userBookings.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">My Bookings</h2>
            <div className="grid gap-6">
              {userBookings.map((booking) => (
                <Card key={booking.id} className="shadow-soft border-primary border-2">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-primary">Booking #{booking.id.slice(0, 8)}</CardTitle>
                        <CardDescription>
                          Status: <span className="capitalize font-medium">{booking.status}</span>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-foreground">₹{booking.total_price.toLocaleString()}</div>
                        <div className="text-sm text-muted-foreground">Total Cost</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Booked: {new Date(booking.booking_date).toLocaleDateString()}</span>
                      </div>
                      {booking.distance_km && (
                        <div className="flex items-center text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-2" />
                          <span>Distance: {booking.distance_km} km</span>
                        </div>
                      )}
                      {booking.completion_date && (
                        <div className="flex items-center text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Completed: {new Date(booking.completion_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Phone className="h-4 w-4 mr-2" />
                        Contact Driver
                      </Button>
                      <Button variant="ghost" size="sm">
                        <User className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmerDashboard;
