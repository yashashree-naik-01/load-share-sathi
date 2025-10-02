import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Users, MapPin, Zap, ArrowRight, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const Index = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Truck className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-primary">SmartLoad</span>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Button variant="ghost" onClick={() => navigate('/merchant-login')}>{t('nav.merchantLogin')}</Button>
            <Button variant="ghost" onClick={() => navigate('/truck-login')}>{t('nav.truckLogin')}</Button>
            <Button variant="hero" onClick={() => navigate('/register')}>{t('nav.getStarted')}</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-hero">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-primary-foreground mb-6">
            {t('hero.title')}
            <br />
            <span className="text-accent"></span>
          </h1>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="farmer"
              onClick={() => navigate('/register?type=farmer')}
              className="text-lg px-8 py-4"
            >
              {t('hero.merchantBtn')} <ArrowRight className="ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="truck"
              onClick={() => navigate('/register?type=truck')}
              className="text-lg px-8 py-4"
            >
              {t('hero.truckBtn')} <ArrowRight className="ml-2" />
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
                {t('problem.title')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-destructive rounded-full mt-1 flex items-center justify-center">
                    <span className="text-destructive-foreground text-sm">!</span>
                  </div>
                  <p className="text-muted-foreground">
                    {t('problem.p1')}
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-destructive rounded-full mt-1 flex items-center justify-center">
                    <span className="text-destructive-foreground text-sm">!</span>
                  </div>
                  <p className="text-muted-foreground">
                    {t('problem.p2')}
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-destructive rounded-full mt-1 flex items-center justify-center">
                    <span className="text-destructive-foreground text-sm">!</span>
                  </div>
                  <p className="text-muted-foreground">
                    {t('problem.p3')}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {t('solution.title')}
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1" />
                  <p className="text-muted-foreground">
                    {t('solution.s1')}
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1" />
                  <p className="text-muted-foreground">
                    {t('solution.s2')}
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1" />
                  <p className="text-muted-foreground">
                    {t('solution.s3')}
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
            {t('features.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center shadow-soft">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <CardTitle className="text-primary">{t('features.merchant.title')}</CardTitle>
                <CardDescription>
                  {t('features.merchant.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li>• {t('features.merchant.l1')}</li>
                  <li>• {t('features.merchant.l2')}</li>
                  <li>• {t('features.merchant.l3')}</li>
                  <li>• {t('features.merchant.l4')}</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center shadow-soft">
              <CardHeader>
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="w-8 h-8 text-secondary-foreground" />
                </div>
                <CardTitle className="text-secondary">{t('features.truck.title')}</CardTitle>
                <CardDescription>
                  {t('features.truck.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li>• {t('features.truck.l1')}</li>
                  <li>• {t('features.truck.l2')}</li>
                  <li>• {t('features.truck.l3')}</li>
                  <li>• {t('features.truck.l4')}</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="text-center shadow-soft">
              <CardHeader>
                <div className="w-16 h-16 bg-trust rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-trust-foreground" />
                </div>
                <CardTitle className="text-trust">{t('features.ai.title')}</CardTitle>
                <CardDescription>
                  {t('features.ai.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-left space-y-2 text-muted-foreground">
                  <li>• {t('features.ai.l1')}</li>
                  <li>• {t('features.ai.l2')}</li>
                  <li>• {t('features.ai.l3')}</li>
                  <li>• {t('features.ai.l4')}</li>
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
            {t('cta.title')}
          </h2>
          <p className="text-xl text-trust-foreground/80 mb-8 max-w-2xl mx-auto">
            {t('cta.subtitle')}
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            onClick={() => navigate('/register')}
            className="text-lg px-8 py-4"
          >
            {t('cta.button')}
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
                {t('footer.tagline')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t('footer.merchant.title')}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>{t('footer.merchant.postLoads')}</li>
                <li>{t('footer.merchant.findTrucks')}</li>
                <li>{t('footer.merchant.track')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t('footer.truck.title')}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>{t('footer.truck.findLoads')}</li>
                <li>{t('footer.truck.routes')}</li>
                <li>{t('footer.truck.maximize')}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t('footer.support.title')}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>{t('footer.support.help')}</li>
                <li>{t('footer.support.contact')}</li>
                <li>{t('footer.support.terms')}</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>{t('footer.copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;