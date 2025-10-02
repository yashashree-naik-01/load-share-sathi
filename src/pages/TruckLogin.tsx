import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Truck, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

const TruckLogin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { signIn, user, profile, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      toast({
        title: "Login Successful!",
        description: "Welcome back!"
      });
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Redirect based on user type after login
  useEffect(() => {
    if (user && profile && !authLoading) {
      if (profile.user_type === 'truck_owner') {
        navigate('/truck-dashboard');
      } else {
        toast({
          title: "Wrong Account Type",
          description: "Please use the grain merchant login page.",
          variant: "destructive"
        });
        navigate('/merchant-login');
      }
    }
  }, [user, profile, authLoading, navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-trust flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-glow border-trust/20">
        <CardHeader className="text-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 text-trust-foreground hover:bg-trust-foreground/10"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="w-16 h-16 bg-trust-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Truck className="w-8 h-8 text-trust-foreground" />
          </div>
          <CardTitle className="text-trust-foreground text-2xl">Truck Owner Login</CardTitle>
          <CardDescription className="text-trust-foreground/80">
            Login to your SmartLoad truck owner account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-background/95"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData('password', e.target.value)}
                placeholder="Enter your password"
                required
                className="bg-background/95"
              />
            </div>

            <Button type="submit" className="w-full bg-trust hover:bg-trust/90" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <span className="text-foreground/70">Don't have an account? </span>
            <Button variant="link" onClick={() => navigate('/register?type=truck')} className="text-trust">
              Register here
            </Button>
          </div>

          <div className="mt-2 text-center">
            <span className="text-foreground/70">Are you a grain merchant? </span>
            <Button variant="link" onClick={() => navigate('/merchant-login')} className="text-primary">
              Login here
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
};

export default TruckLogin;
