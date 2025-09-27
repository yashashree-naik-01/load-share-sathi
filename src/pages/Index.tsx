import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Users, MapPin, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Truck className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">SmartLoad</span>
          </div>
          <div className="flex space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>Login</Button>
            <Button variant="hero" onClick={() => navigate('/register')}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
          Smart Logistics. Zero Empty Miles.	
            <br />
            <span className="text-accent"></span>
          </h1>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-3xl mx-auto">
            AI-powered platform that matches farmers' transport needs with truck owners, 
            reducing empty trips and making logistics more efficient and affordable.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="farmer"
              onClick={() => navigate('/register?type=farmer')}
              className="text-lg px-8 py-4"
            >
              I'm a Farmer <ArrowRight className="ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="truck"
              onClick={() => navigate('/register?type=truck')}
              className="text-lg px-8 py-4"
            >
              I Own a Truck <ArrowRight className="ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                The Problem We're Solving
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-destructive rounded-full mt-1 flex items-center justify-center">
                    <span className="text-destructive-foreground text-sm">!</span>
                  </div>
                  <p className="text-muted-foreground">
                    Trucks return empty after deliveries, wasting fuel and money
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-destructive rounded-full mt-1 flex items-center justify-center">
                    <span className="text-destructive-foreground text-sm">!</span>
                  </div>
                  <p className="text-muted-foreground">
                    Farmers struggle to find affordable transport for their goods
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-destructive rounded-full mt-1 flex items-center justify-center">
                    <span className="text-destructive-foreground text-sm">!</span>
                  </div>
                  <p className="text-muted-foreground">
                    Inefficient logistics increase costs for community
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Our AI-Powered Solution
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1" />
                  <p className="text-muted-foreground">
                    Smart matching engine connects farmers with available trucks
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1" />
                  <p className="text-muted-foreground">
                    Optimize routes and capacity to reduce empty trips
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1" />
                  <p className="text-muted-foreground">
                    Cost-effective transport solutions for communities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-4xl font-bold text-center text-foreground mb-12">
            How SmartLoad Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-soft">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-primary">For Farmers</CardTitle>
                <CardDescription>
                  Post your goods that need transportation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li>• Specify goods type and weight</li>
                  <li>• Set pickup location and timing</li>
                  <li>• Get matched with suitable trucks</li>
                  <li>• Confirm bookings easily</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center shadow-soft">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-secondary">For Truck Owners</CardTitle>
                <CardDescription>
                  Maximize your trips and reduce empty runs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li>• Post vehicle details and routes</li>
                  <li>• Set capacity and pricing</li>
                  <li>• Receive load requests</li>
                  <li>• Optimize your earnings</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center shadow-soft">
              <CardHeader>
                <div className="w-16 h-16 bg-trust rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-trust-foreground" />
                </div>
                <CardTitle className="text-trust">AI Matching</CardTitle>
                <CardDescription>
                  Smart algorithms for optimal matches
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li>• Distance optimization</li>
                  <li>• Capacity matching</li>
                  <li>• Cost calculation</li>
                  <li>• Real-time updates</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-trust">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-trust-foreground mb-6">
            Ready to Transform Logistics?
          </h2>
          <p className="text-xl text-trust-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers and truck owners already saving money and reducing waste.
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/register')}
            className="text-lg px-8 py-4"
          >
            Start Your Journey Today
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Truck className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary">SmartLoad</span>
              </div>
              <p className="text-muted-foreground">
                Connecting India through smart transport solutions.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">For Farmers</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Post Loads</li>
                <li>Find Trucks</li>
                <li>Track Shipments</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">For Truck Owners</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Find Loads</li>
                <li>Manage Routes</li>
                <li>Maximize Earnings</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 SmartLoad. Made with ❤️ for India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;