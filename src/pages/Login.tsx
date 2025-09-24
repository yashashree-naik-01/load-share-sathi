import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get stored user data (in real app, this would be API call)
    const storedUser = localStorage.getItem('rurallink_user');
    
    if (!storedUser) {
      toast({
        title: "Account not found",
        description: "Please register first or check your credentials.",
        variant: "destructive"
      });
      return;
    }

    const userData = JSON.parse(storedUser);
    
    if (userData.email === formData.email && userData.password === formData.password) {
      toast({
        title: "Login Successful!",
        description: `Welcome back, ${userData.name}!`
      });
      
      // Navigate to appropriate dashboard
      navigate(userData.type === 'farmer' ? '/farmer-dashboard' : '/truck-dashboard');
    } else {
      toast({
        title: "Invalid Credentials",
        description: "Please check your email and password.",
        variant: "destructive"
      });
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-soft">
        <CardHeader className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-primary">Welcome Back</CardTitle>
          <CardDescription>
            Login to your RuralLink account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <Button type="submit" className="w-full" variant="default">
              Login
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <span className="text-muted-foreground">Don't have an account? </span>
            <Button variant="link" onClick={() => navigate('/register')}>
              Register here
            </Button>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>Farmer: farmer@demo.com / password123</p>
              <p>Truck Owner: truck@demo.com / password123</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;