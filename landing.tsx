import { Trophy, Users, Calendar, Target, TrendingUp, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Trophy className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Omni League</h1>
            </div>
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Multi-Sport Fantasy 
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Revolution
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Draft across 18+ sports in one epic fantasy league. From NFL to Golf, Tennis to F1 - 
              compete across every major sport with strategic wild card picks and real-time scoring.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            <div className="bg-cool-100 text-cool-700 rounded-full px-4 py-2 text-sm font-medium">
              <i className="fas fa-football-ball mr-2"></i>
              NFL
            </div>
            <div className="bg-cool-100 text-cool-700 rounded-full px-4 py-2 text-sm font-medium">
              <i className="fas fa-basketball-ball mr-2"></i>
              NBA
            </div>
            <div className="bg-cool-100 text-cool-700 rounded-full px-4 py-2 text-sm font-medium">
              <i className="fas fa-golf-ball mr-2"></i>
              Golf
            </div>
            <div className="bg-neutral-100 text-neutral-700 rounded-full px-4 py-2 text-sm font-medium">
              <i className="fas fa-tennis-ball mr-2"></i>
              Tennis
            </div>
            <div className="bg-fruity-100 text-fruity-700 rounded-full px-4 py-2 text-sm font-medium">
              <i className="fas fa-futbol mr-2"></i>
              FIFA
            </div>
            <div className="bg-fruity-100 text-fruity-700 rounded-full px-4 py-2 text-sm font-medium">
              <i className="fas fa-flag-checkered mr-2"></i>
              F1
            </div>
            <div className="bg-neutral-100 text-neutral-700 rounded-full px-4 py-2 text-sm font-medium">
              <Calendar className="w-4 h-4 mr-2 inline" />
              13+ More
            </div>
          </div>

          <Button 
            size="lg" 
            onClick={() => window.location.href = '/api/login'}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Join the League
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              The Ultimate Fantasy Experience
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience fantasy sports like never before with our innovative multi-sport platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-cool-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-cool-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Multi-Sport Drafting</h4>
                <p className="text-gray-600">
                  Draft teams and players across 18+ sports in 18 strategic rounds. Make your picks count!
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="w-8 h-8 text-neutral-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Strategic Wild Cards</h4>
                <p className="text-gray-600">
                  Use wild card picks to target specific sports and maximize your scoring potential.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-fruity-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="w-8 h-8 text-fruity-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Real-Time Scoring</h4>
                <p className="text-gray-600">
                  Track points as events complete throughout the season with our dynamic leaderboard.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-cool-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-cool-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Category Scoring</h4>
                <p className="text-gray-600">
                  Sports are categorized as Cool, Neutral, or Fruity with different point structures.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calendar className="w-8 h-8 text-neutral-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Season-Long Competition</h4>
                <p className="text-gray-600">
                  Compete from now through March 2026 across all major sporting events.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-wildcard-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy className="w-8 h-8 text-wildcard-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-4">Championship Glory</h4>
                <p className="text-gray-600">
                  Compete for the ultimate prize - being crowned the Omni League champion.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-4xl font-bold text-white mb-6">
            Ready to Dominate Across All Sports?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join the most comprehensive fantasy sports league ever created. 
            Your championship journey starts now.
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/api/login'}
            className="bg-white text-blue-600 hover:bg-gray-50 text-lg px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Start Playing Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Trophy className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-gray-900">Omni Fantasy League</span>
            </div>
            <div className="flex space-x-6 text-sm text-gray-600">
              <a href="#" className="hover:text-gray-900">Rules & Scoring</a>
              <a href="#" className="hover:text-gray-900">League History</a>
              <a href="#" className="hover:text-gray-900">Support</a>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 text-center text-xs text-gray-500">
            <p>Multi-Sport Fantasy League Platform • Season 2026 • Made for Champions</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
