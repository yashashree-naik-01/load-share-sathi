import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, Users, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userType = searchParams.get('type') || '';
  const { toast } = useToast();
  const { signUp, user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [selectedType, setSelectedType] = useState(userType);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    // Farmer specific
    farmLocation: '',
    // Truck specific
    vehicleType: '',
    capacity: '',
    licenseNumber: ''
  });

  const indianStates = [
    'Maharashtra', 'Gujarat', 'Rajasthan', 'Punjab', 'Haryana', 'Uttar Pradesh',
    'Madhya Pradesh', 'Karnataka', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana',
    'Kerala', 'Odisha', 'West Bengal', 'Bihar', 'Jharkhand', 'Chhattisgarh'
  ];

  const vehicleTypes = [
    'Mini Truck (Tata Ace)', 'Small Truck (7-8 MT)', 'Medium Truck (10-12 MT)',
    'Large Truck (15-20 MT)', 'Trailer (25+ MT)', 'Tempo Traveller'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.password || !formData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const userData = {
        name: formData.name,
        phone: formData.phone,
        type: selectedType,
        farmLocation: formData.farmLocation,
        vehicleType: formData.vehicleType,
        capacity: formData.capacity,
        licenseNumber: formData.licenseNumber
      };

      const { error } = await signUp(formData.email, formData.password, userData);

      if (error) {
        toast({
          title: "Registration Failed",
          description: error.message,
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Registration Successful!",
        description: `Welcome to RuralLink, ${formData.name}! Please check your email to confirm your account.`
      });

      // Navigate to appropriate dashboard
      navigate(selectedType === 'farmer' ? '/farmer-dashboard' : '/truck-dashboard');
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Redirect if already logged in
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  if (!selectedType) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-8">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold text-foreground mb-4">Join RuralLink</h1>
            <p className="text-muted-foreground">Choose your account type to get started</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="cursor-pointer hover:shadow-soft transition-all border-2 hover:border-primary"
              onClick={() => setSelectedType('farmer')}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-primary">I'm a Farmer</CardTitle>
                <CardDescription>
                  I have goods that need transportation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Post your produce for transport</li>
                  <li>• Get competitive pricing</li>
                  <li>• Track your shipments</li>
                  <li>• Connect with reliable trucks</li>
                </ul>
              </CardContent>
            </Card>

            <Card 
              className="cursor-pointer hover:shadow-soft transition-all border-2 hover:border-secondary"
              onClick={() => setSelectedType('truck')}
            >
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-secondary">I Own a Truck</CardTitle>
                <CardDescription>
                  I want to find loads for my vehicle
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Find loads on your routes</li>
                  <li>• Reduce empty trips</li>
                  <li>• Maximize your earnings</li>
                  <li>• Build customer relationships</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-soft">
        <CardHeader className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedType('')}
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
            selectedType === 'farmer' ? 'bg-primary' : 'bg-secondary'
          }`}>
            {selectedType === 'farmer' ? 
              <Users className="w-8 h-8 text-primary-foreground" /> : 
              <Truck className="w-8 h-8 text-secondary-foreground" />
            }
          </div>
          <CardTitle className={selectedType === 'farmer' ? 'text-primary' : 'text-secondary'}>
            {selectedType === 'farmer' ? 'Farmer Registration' : 'Truck Owner Registration'}
          </CardTitle>
          <CardDescription>
            Create your account to start {selectedType === 'farmer' ? 'finding transport' : 'finding loads'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData('name', e.target.value)}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                placeholder="Create a password"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => updateFormData('phone', e.target.value)}
                placeholder="+91 98765 43210"
                required
              />
            </div>

            {/* Type-specific fields */}
            {selectedType === 'farmer' && (
              <div className="space-y-2">
                <Label htmlFor="farmLocation">Farm Location</Label>
                <Select onValueChange={(value) => updateFormData('farmLocation', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your state" />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map(state => (
                      <SelectItem key={state} value={state}>{state}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {selectedType === 'truck' && (
              <>
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
                  <Label htmlFor="capacity">Capacity (in MT)</Label>
                  <Input
                    id="capacity"
                    value={formData.capacity}
                    onChange={(e) => updateFormData('capacity', e.target.value)}
                    placeholder="e.g., 7.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Driving License Number</Label>
                  <Input
                    id="licenseNumber"
                    value={formData.licenseNumber}
                    onChange={(e) => updateFormData('licenseNumber', e.target.value)}
                    placeholder="Enter license number"
                  />
                </div>
              </>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              variant={selectedType === 'farmer' ? 'default' : 'default'}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <span className="text-muted-foreground">Already have an account? </span>
            <Button variant="link" onClick={() => navigate('/login')}>
              Login here
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;