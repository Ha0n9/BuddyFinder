// HomePage.jsx – Nike Energy Theme
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Users,
  Dumbbell,
  MessageCircle,
  ArrowRight,
  Activity,
  TrendingUp,
  Zap,
} from 'lucide-react';

function HomePage() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#141414] via-[#1C1C1C] to-[#0B0B0B] py-20">
        {/* Decorative Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-24 left-20 w-72 h-72 bg-[#FF5F00]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#F4E000]/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 text-center px-6">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-[#FF5F00]/10 p-4 rounded-2xl backdrop-blur-sm border border-[#FF5F00]/30">
              <Activity className="w-12 h-12 text-[#FF5F00]" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-4 text-white">
            BuddyFinder
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Connect with fitness enthusiasts, find your perfect workout partner,
            and achieve your goals together.
          </p>
        </div>

        {/* Conditional Sections */}
        {isAuthenticated ? (
          <AuthenticatedContent user={user} />
        ) : (
          <UnauthenticatedContent />
        )}
      </section>
    </div>
  );
}

/* ---------------- AUTHENTICATED CONTENT ---------------- */
function AuthenticatedContent({ user }) {
  return (
    <div className="px-6 pb-20 mt-10">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Card */}
        <div className="bg-[#1A1A1A] rounded-3xl p-8 shadow-lg mb-8 border border-[#2A2A2A]">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#FF5F00] to-[#F4E000] rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-[0_0_20px_rgba(255,95,0,0.5)]">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome back, {user?.name || 'User'}!
              </h2>
              <p className="text-gray-400">Ready to crush your goals today?</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <QuickActionCard
            to="/search"
            icon={<Zap className="w-7 h-7" />}
            title="Find Buddies"
            subtitle="Start matching"
            gradient="from-[#FF5F00] to-[#FF8C00]"
          />
          <QuickActionCard
            to="/activities"
            icon={<Dumbbell className="w-7 h-7" />}
            title="Activities"
            subtitle="Join workouts"
            gradient="from-[#FF8C00] to-[#F4E000]"
          />
          <QuickActionCard
            to="/chat"
            icon={<MessageCircle className="w-7 h-7" />}
            title="Messages"
            subtitle="Chat now"
            gradient="from-[#F4E000] to-[#FF5F00]"
          />
          <QuickActionCard
            to="/profile"
            icon={<Users className="w-7 h-7" />}
            title="Profile"
            subtitle="Edit info"
            gradient="from-[#FF5F00] to-[#F4E000]"
          />
        </div>

        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <DashboardStatCard
            icon={<Zap className="w-6 h-6" />}
            number="12"
            label="Active Matches"
            change="+2 this week"
          />
          <DashboardStatCard
            icon={<Activity className="w-6 h-6" />}
            number="8"
            label="Workouts Completed"
            change="+3 this week"
          />
          <DashboardStatCard
            icon={<MessageCircle className="w-6 h-6" />}
            number="24"
            label="Messages"
            change="5 unread"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- UNAUTHENTICATED CONTENT ---------------- */
function UnauthenticatedContent() {
  return (
    <div className="px-6 pb-20 mt-10">
      <div className="max-w-4xl mx-auto text-center">
        {/* Preview Card */}
        <div className="mb-12 relative flex justify-center h-96">
          <div className="relative z-20 bg-[#1A1A1A] rounded-3xl shadow-2xl p-6 w-80 border border-[#2A2A2A] hover:scale-105 transition-transform duration-300">
            <div className="h-56 bg-gradient-to-br from-[#FF5F00]/20 to-[#F4E000]/20 rounded-2xl mb-4 flex items-center justify-center">
              <Users className="w-20 h-20 text-[#FF5F00]" />
            </div>
            <div className="text-left space-y-2">
              <h3 className="font-bold text-xl">Sarah, 25</h3>
              <p className="text-gray-400 text-sm">
                Vancouver • Yoga • Running • HIIT
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          Start Your Fitness Journey Today
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          Join thousands of fitness enthusiasts who have found their perfect workout partners and achieved their goals together.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <Link
            to="/register"
            className="flex-1 bg-[#FF5F00] hover:bg-[#E94E00] text-white font-bold py-4 px-8 rounded-xl shadow-[0_0_20px_rgba(255,95,0,0.5)] hover:shadow-[0_0_25px_rgba(255,95,0,0.7)] transform hover:scale-105 transition-all duration-200"
          >
            Create Free Account
          </Link>

          <Link
            to="/login"
            className="flex-1 flex items-center justify-center bg-transparent hover:bg-[#FF5F00]/10 text-[#FF5F00] font-bold py-4 px-8 rounded-xl border-2 border-[#FF5F00] hover:shadow-lg transition-all duration-200"
          >
            Log In
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>

        <p className="text-sm text-gray-500 mt-4">
          No credit card required • Free forever
        </p>

        {/* Why Choose BuddyFinder */}
        <section className="mt-24 px-6 py-20 bg-[#141414] border-t border-[#2A2A2A] rounded-3xl shadow-inner">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Why Choose BuddyFinder?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto mb-12">
              The best platform to find, connect, and train with like-minded fitness enthusiasts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                icon={<Users className="w-10 h-10" />}
                title="Smart Matching"
                description="Our AI connects you with compatible workout partners based on fitness level, goals, and location."
              />
              <FeatureCard
                icon={<Dumbbell className="w-10 h-10" />}
                title="Activity Coordination"
                description="Join or organize workout sessions, track progress, and stay motivated with your community."
              />
              <FeatureCard
                icon={<MessageCircle className="w-10 h-10" />}
                title="Real-time Chat"
                description="Coordinate instantly with messaging and build lasting fitness friendships."
              />
            </div>

            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <StatCard number="10K+" label="Active Users" />
              <StatCard number="50K+" label="Workouts" />
              <StatCard number="25K+" label="Matches" />
              <StatCard number="4.9★" label="Rating" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */
function QuickActionCard({ to, icon, title, subtitle, gradient }) {
  return (
    <Link to={to}>
      <div
        className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white hover:shadow-[0_0_25px_rgba(255,95,0,0.4)] transform hover:scale-105 transition-all duration-300`}
      >
        <div className="mb-3">{icon}</div>
        <h3 className="font-bold text-base mb-1">{title}</h3>
        <p className="text-sm opacity-90">{subtitle}</p>
      </div>
    </Link>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#2A2A2A] hover:border-[#FF5F00]/40 hover:shadow-[0_0_20px_rgba(255,95,0,0.3)] transition-all duration-300">
      <div className="w-16 h-16 bg-[#FF5F00]/10 border border-[#FF5F00]/30 rounded-xl flex items-center justify-center mb-6 text-[#FF5F00]">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-white">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  );
}

function DashboardStatCard({ icon, number, label, change }) {
  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-6 border border-[#2A2A2A] hover:border-[#FF5F00]/40 hover:shadow-[0_0_20px_rgba(255,95,0,0.3)] transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-[#FF5F00]/10 text-[#FF5F00] rounded-xl flex items-center justify-center">
          {icon}
        </div>
        <TrendingUp className="w-5 h-5 text-[#FF5F00]" />
      </div>
      <div className="text-3xl font-bold mb-1">{number}</div>
      <div className="text-sm text-gray-400 mb-2">{label}</div>
      <div className="text-xs text-[#FF5F00] font-medium">{change}</div>
    </div>
  );
}

function StatCard({ number, label }) {
  return (
    <div>
      <div className="text-4xl md:text-5xl font-bold text-[#FF5F00] mb-2">{number}</div>
      <div className="text-sm md:text-base text-gray-400">{label}</div>
    </div>
  );
}

export default HomePage;
