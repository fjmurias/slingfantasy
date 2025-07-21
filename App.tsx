import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
// import { useAuth } from "@/hooks/useAuth"; // Removed for public demo
import NotFound from "@/pages/not-found";
// import Landing from "@/pages/landing"; // Removed for public demo
import Home from "@/pages/home";
import Draft from "@/pages/draft";
import EnhancedDraft from "@/pages/enhanced-draft";
import Standings from "@/pages/standings";
import Schedule from "@/pages/schedule";

function Router() {
  // Public demo version - no authentication required
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/draft" component={EnhancedDraft} />
      <Route path="/standings" component={Standings} />
      <Route path="/schedule" component={Schedule} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
