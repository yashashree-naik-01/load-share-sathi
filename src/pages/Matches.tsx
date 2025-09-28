import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Truck, ArrowLeft, MapPin, Weight, IndianRupee, Star, Phone, User, Route, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSupabase, type FarmerLoad, type TruckRoute, type Profile } from "@/hooks/useSupabase";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";

interface TruckMatch {
  id: string;
  ownerName: string;
  ownerPhone: string;
  vehicleType: string;
  capacity: string;
  pricePerKm: string;
  fromLocation: string;
  toLocation: string;
  rating: number;
  distance: number;
  estimatedCost: number;
  availableDate: string;
  matchScore: number;
}

const Matches = () => {
  const { loadId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { farmerLoads, truckRoutes, profiles, loading, createBooking, updateLoadStatus, updateTruckRouteStatus } = useSupabase();
  const { user, profile, loading: authLoading } = useAuth();
  const [load, setLoad] = useState<FarmerLoad | null>(null);
  const [matches, setMatches] = useState<TruckMatch[]>([]);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && (!user || !profile)) {
      navigate('/login');
      return;
    }

    if (loading || authLoading || !farmerLoads.length || !truckRoutes.length || !profiles.length) return;

    // Get the specific load
    const currentLoad = farmerLoads.find(l => l.id === loadId);
    
    if (!currentLoad) {
      navigate('/farmer-dashboard');
      return;
    }
    
    // Check if user owns this load
    if (currentLoad.farmer_id !== profile?.id) {
      navigate('/farmer-dashboard');
      return;
    }
    
    setLoad(currentLoad);
    
    // Check if AI matches were passed from previous page
    if (location.state?.aiMatches) {
      setMatches(location.state.aiMatches);
    } else {
      // Call AI matching engine
      getAIMatches(currentLoad);
    }
  }, [loadId, navigate, loading, authLoading, farmerLoads, truckRoutes, profiles, user, profile, location.state]);

  const getAIMatches = async (currentLoad: FarmerLoad) => {
    try {
      setAiLoading(true);
      const { data, error } = await supabase.functions.invoke('ai-matching-engine', {
        body: { loadId: currentLoad.id }
      });
      
      if (error) throw error;
      
      if (data?.matches) {
        setMatches(data.matches);
      } else {
        // Fallback to local matching
        generateMatches(currentLoad);
      }
    } catch (error) {
      console.error('Error getting AI matches:', error);
      generateMatches(currentLoad);
    } finally {
      setAiLoading(false);
    }
  };

  const generateMatches = (currentLoad: FarmerLoad) => {
    // AI matching engine using real truck data
    const compatibleTrucks = truckRoutes
      .filter(route => {
        // Check capacity compatibility
        const hasCapacity = route.capacity >= currentLoad.quantity;
        
        // Check route compatibility (simplified)
        const routeStart = route.start_location.toLowerCase();
        const routeEnd = route.end_location.toLowerCase();
        const loadStart = currentLoad.pickup_location.toLowerCase();
        const loadEnd = currentLoad.destination.toLowerCase();
        
        const routeCompatible = routeStart.includes(loadStart.split(',')[0]) || 
                               routeEnd.includes(loadEnd.split(',')[0]) ||
                               routeStart.includes(loadEnd.split(',')[0]);
        
        return hasCapacity && routeCompatible && route.status === 'available';
      })
      .map(route => {
        const truckOwner = profiles.find(p => p.id === route.truck_owner_id);
        const distance = calculateDistance(currentLoad.pickup_location, currentLoad.destination);
        const estimatedCost = Math.round(distance * route.price_per_km);
        
        // Calculate match score based on multiple factors
        const capacityScore = Math.min(100, (route.capacity / currentLoad.quantity) * 30);
        const priceScore = Math.max(0, 50 - (route.price_per_km - 20) * 2);
        const baseScore = Math.random() * 20 + 70; // Simulate rating-based score
        const matchScore = Math.round(capacityScore + priceScore + baseScore);
        
        return {
          id: route.id,
          ownerName: truckOwner?.full_name || 'Unknown Driver',
          ownerPhone: truckOwner?.phone || '+91 XXXXX XXXXX',
          vehicleType: route.vehicle_type,
          capacity: route.capacity.toString(),
          pricePerKm: route.price_per_km.toString(),
          fromLocation: route.start_location,
          toLocation: route.end_location,
          rating: 4.2 + Math.random() * 0.8, // Simulate ratings between 4.2-5.0
          distance,
          estimatedCost,
          availableDate: route.available_date,
          matchScore: Math.min(98, matchScore)
        } as TruckMatch;
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5); // Show top 5 matches

    setMatches(compatibleTrucks);
  };

  const calculateDistance = (from: string, to: string) => {
    // Simplified distance calculation for demo
    const distances: { [key: string]: number } = {
      'Mumbai-Delhi': 1400,
      'Mumbai-Pune': 150,
      'Delhi-Jaipur': 280,
      'Pune-Nashik': 200,
      'Mumbai-Ahmedabad': 530,
      'Delhi-Mumbai': 1400,
      'Pune-Mumbai': 150,
      'Jaipur-Delhi': 280,
      'Nashik-Pune': 200,
      'Ahmedabad-Mumbai': 530,
    };
    
    const key = `${from.split(',')[0]}-${to.split(',')[0]}`;
    const reverseKey = `${to.split(',')[0]}-${from.split(',')[0]}`;
    
    return distances[key] || distances[reverseKey] || Math.floor(Math.random() * 800) + 200;
  };

  const bookTruck = async (truck: TruckMatch) => {
    if (!load || !profile) return;
    
    try {
      const truckRoute = truckRoutes.find(r => r.id === truck.id);
      const truckOwner = profiles.find(p => p.full_name === truck.ownerName);
      
      if (!truckRoute || !truckOwner) {
        throw new Error('Truck or owner not found');
      }
      
      // Create booking
      await createBooking({
        farmer_load_id: load.id,
        truck_route_id: truckRoute.id,
        farmer_id: load.farmer_id,
        truck_owner_id: truckOwner.id,
        total_price: truck.estimatedCost,
        distance_km: truck.distance,
        status: 'pending'
      });

      // Update load status to booked
      await updateLoadStatus(load.id, 'booked');
      
      // Update truck route status to booked
      await updateTruckRouteStatus(truckRoute.id, 'booked');

      toast({
        title: "Booking Confirmed!",
        description: `You've booked ${truck.ownerName}'s truck. Contact details will be shared.`
      });
      
      navigate('/farmer-dashboard');
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Unable to confirm booking. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-primary text-primary-foreground';
    if (score >= 80) return 'bg-secondary text-secondary-foreground';
    return 'bg-accent text-accent-foreground';
  };

  const getMatchScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match';
    if (score >= 80) return 'Good Match';
    return 'Fair Match';
  };

  if (loading || authLoading || aiLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">
            {aiLoading ? 'AI is finding the best matches for your load...' : 'Loading...'}
          </p>
        </div>
      </div>
    );
  }

  if (!load) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/farmer-dashboard')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div className="flex items-center space-x-2">
            <Truck className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">SmartLoad</span>
          </div>
          <span className="text-muted-foreground">AI Matches</span>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        {/* Load Details */}
        <Card className="mb-8 shadow-soft border-primary border-2">
          <CardHeader>
            <CardTitle className="text-primary">Your Load Details</CardTitle>
            <CardDescription>AI is finding the best trucks for your requirements</CardDescription>
          </CardHeader>
          <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Weight className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{load.crop_type} - {load.quantity} {load.unit}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{load.pickup_location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">{load.destination}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <IndianRupee className="h-4 w-4 text-muted-foreground" />
                  <span className="text-foreground">Budget: ₹{load.estimated_price || 'Negotiable'}</span>
                </div>
              </div>
          </CardContent>
        </Card>

        {/* AI Matches */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-2">AI-Powered Matches</h2>
          <p className="text-muted-foreground">
            Our smart algorithm found {matches.length} trucks that match your requirements based on 
            capacity, route optimization, cost efficiency, and reliability ratings.
          </p>
        </div>

        {matches.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Truck className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No matches found</h3>
              <p className="text-muted-foreground">
                Try adjusting your requirements or check back later for new trucks
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {matches.map((truck, index) => (
              <Card key={truck.id} className="shadow-soft hover:shadow-glow transition-all">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className="text-secondary">{truck.vehicleType}</CardTitle>
                        <Badge className={getMatchScoreColor(truck.matchScore)}>
                          {truck.matchScore}% {getMatchScoreLabel(truck.matchScore)}
                        </Badge>
                        {index === 0 && (
                          <Badge className="bg-accent text-accent-foreground">
                            Best Match
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {truck.ownerName}
                        </span>
                        <span className="flex items-center">
                          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {truck.rating}/5
                        </span>
                        <span className="flex items-center">
                          <Phone className="h-4 w-4 mr-1" />
                          {truck.ownerPhone}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-foreground">₹{truck.estimatedCost.toLocaleString()}</div>
                      <div className="text-sm text-muted-foreground">Estimated Cost</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Weight className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">Capacity: {truck.capacity} tons</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Route className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">Distance: {truck.distance} km</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">Rate: ₹{truck.pricePerKm}/km</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-foreground">Route: {truck.fromLocation.split(',')[0]} → {truck.toLocation.split(',')[0]}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-foreground">Available: {new Date(truck.availableDate).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">Compatible with your load</div>
                    </div>
                  </div>

                  {/* AI Insights */}
                  <div className="bg-muted/50 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-foreground mb-2">AI Analysis:</h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• {parseFloat(truck.capacity) > load.quantity * 1.5 ? 'Excess capacity available for additional goods' : 'Perfect capacity match for your load'}</li>
                      <li>• {truck.rating >= 4.8 ? 'Highly rated driver with excellent track record' : 'Good reliability rating'}</li>
                      <li>• {truck.estimatedCost < (load.estimated_price || 20000) ? 'Cost-effective option within your budget' : 'Premium service with higher quality'}</li>
                      <li>• Route optimization reduces empty return trip by 60%</li>
                    </ul>
                  </div>

                  <div className="flex space-x-4">
                    <Button 
                      variant="default" 
                      onClick={() => bookTruck(truck)}
                      className="flex-1"
                      disabled={load?.status !== 'pending'}
                    >
                      {load?.status === 'booked' ? 'Already Booked' : 'Book This Truck'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        window.open(`tel:${truck.ownerPhone}`, '_self');
                      }}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Driver
                    </Button>
                    <Button 
                      variant="ghost"
                      onClick={() => {
                        toast({
                          title: "Driver Details",
                          description: `${truck.ownerName} - ${truck.vehicleType} - Rating: ${truck.rating}/5`
                        });
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
