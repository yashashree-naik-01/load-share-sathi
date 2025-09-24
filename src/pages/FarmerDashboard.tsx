import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Truck, Plus, Package, MapPin, Calendar, Weight, IndianRupee, LogOut } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Load {
  id: string;
  goodsType: string;
  weight: string;
  pickupLocation: string;
  dropLocation: string;
  pickupDate: string;
  expectedPrice: string;
  description: string;
  status: 'posted' | 'matched' | 'booked';
}

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [loads, setLoads] = useState<Load[]>([]);
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
    const storedUser = localStorage.getItem('rurallink_user');
    if (!storedUser) {
      navigate('/login');
      return;
    }
    
    const userData = JSON.parse(storedUser);
    if (userData.type !== 'farmer') {
      navigate('/truck-dashboard');
      return;
    }
    
    setUser(userData);
    
    // Load farmer's loads
    const storedLoads = localStorage.getItem(`loads_${userData.id}`) || '[]';
    setLoads(JSON.parse(storedLoads));
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.goodsType || !formData.weight || !formData.pickupLocation || !formData.dropLocation) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    const newLoad: Load = {
      id: Date.now().toString(),
      ...formData,
      status: 'posted'
    };

    const updatedLoads = [...loads, newLoad];
    setLoads(updatedLoads);
    localStorage.setItem(`loads_${user.id}`, JSON.stringify(updatedLoads));
    
    // Also add to global loads for matching
    const globalLoads = JSON.parse(localStorage.getItem('global_loads') || '[]');
    globalLoads.push({ ...newLoad, farmerId: user.id, farmerName: user.name, farmerPhone: user.phone });
    localStorage.setItem('global_loads', JSON.stringify(globalLoads));

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
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('rurallink_user');
    navigate('/');
  };

  const viewMatches = (loadId: string) => {
    navigate(`/matches/${loadId}`);
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
            <span className="text-muted-foreground">Farmer Dashboard</span>
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
            <h1 className="text-3xl font-bold text-foreground">My Loads</h1>
            <p className="text-muted-foreground">Manage your transportation requests</p>
          </div>
          <Button variant="farmer" onClick={() => setShowPostForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Post New Load
          </Button>
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
          {loads.length === 0 ? (
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
            loads.map(load => (
              <Card key={load.id} className="shadow-soft">
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
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      load.status === 'posted' ? 'bg-accent text-accent-foreground' :
                      load.status === 'matched' ? 'bg-primary text-primary-foreground' :
                      'bg-secondary text-secondary-foreground'
                    }`}>
                      {load.status === 'posted' ? 'Posted' : 
                       load.status === 'matched' ? 'Matched' : 'Booked'}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>From: {load.pickupLocation}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>To: {load.dropLocation}</span>
                    </div>
                    {load.pickupDate && (
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Pickup: {new Date(load.pickupDate).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {load.description && (
                    <p className="text-muted-foreground mb-4">{load.description}</p>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => viewMatches(load.id)}
                    >
                      View Matches
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;