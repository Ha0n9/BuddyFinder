// import { Link } from 'react-router-dom';
// import { useAuthStore } from '../store/authStore';

// function HomePage() {
//   const { isAuthenticated } = useAuthStore();

//   return (
//     <div className="container mx-auto p-4 text-center">
//       <h1 className="text-4xl font-bold mb-4">Welcome to BuddyFind</h1>
//       <p className="text-lg mb-6">Find your perfect gym buddy or fitness companion!</p>
//       {isAuthenticated ? (
//         <div className="space-x-4">
//           <Link to="/search" className="text-blue-500 hover:underline">Find Buddies</Link>
//           <Link to="/activities" className="text-blue-500 hover:underline">View Activities</Link>
//         </div>
//       ) : (
//         <div className="space-x-4">
//           <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
//           <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
//         </div>
//       )}
//     </div>
//   );
// }

// export default HomePage;


// HomePage.jsx
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Heart, Users, Dumbbell, MessageCircle, Star, ArrowRight, MapPin, Clock } from 'lucide-react';

function HomePage() {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-8 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white bg-opacity-15 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-8 w-8 h-8 bg-white bg-opacity-20 rounded-full animate-bounce delay-500"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="px-6 pt-12 pb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white bg-opacity-20 p-3 rounded-full backdrop-blur-sm">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-4">
            BuddyFinder
          </h1>
          <p className="text-lg text-white text-center opacity-90 max-w-md mx-auto">
            Find your perfect gym buddy and fitness companion
          </p>
        </div>

        {/* Main Content */}
        {isAuthenticated ? (
          <AuthenticatedContent user={user} />
        ) : (
          <UnauthenticatedContent />
        )}

        {/* Features Section */}
        <div className="px-6 py-12">
          <h2 className="text-2xl font-bold text-white text-center mb-8">
            Why Choose BuddyFinder?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <FeatureCard 
              icon={<Users className="w-8 h-8" />}
              title="Find Your Match"
              description="Connect with like-minded fitness enthusiasts in your area"
            />
            <FeatureCard 
              icon={<Dumbbell className="w-8 h-8" />}
              title="Train Together"
              description="Join activities or create your own workout sessions"
            />
            <FeatureCard 
              icon={<MessageCircle className="w-8 h-8" />}
              title="Stay Connected"
              description="Chat and coordinate with your gym buddies"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthenticatedContent({ user }) {
  return (
    <div className="px-6 py-8">
      {/* Welcome Back Section */}
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6 mb-8 max-w-md mx-auto">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-pink-300 to-orange-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl font-bold text-white">
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">
            Welcome back, {user?.name || 'User'}!
          </h2>
          <p className="text-white opacity-80 text-sm">
            Ready to find your workout partner?
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
        <QuickActionCard 
          to="/search"
          icon={<Heart className="w-6 h-6" />}
          title="Find Buddies"
          subtitle="Start swiping"
          gradient="from-pink-500 to-red-500"
        />
        <QuickActionCard 
          to="/activities"
          icon={<Dumbbell className="w-6 h-6" />}
          title="Activities"
          subtitle="Join workouts"
          gradient="from-purple-500 to-indigo-500"
        />
        <QuickActionCard 
          to="/chat"
          icon={<MessageCircle className="w-6 h-6" />}
          title="Messages"
          subtitle="Chat now"
          gradient="from-green-500 to-teal-500"
        />
        <QuickActionCard 
          to="/profile"
          icon={<Users className="w-6 h-6" />}
          title="Profile"
          subtitle="Edit info"
          gradient="from-orange-500 to-yellow-500"
        />
      </div>

      {/* Stats Section */}
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6 max-w-md mx-auto">
        <h3 className="text-lg font-bold text-white mb-4 text-center">Your Stats</h3>
        <div className="grid grid-cols-3 gap-4">
          <StatItem number="12" label="Matches" />
          <StatItem number="8" label="Workouts" />
          <StatItem number="24" label="Messages" />
        </div>
      </div>
    </div>
  );
}

function UnauthenticatedContent() {
  return (
    <div className="px-6 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-8">
          <div className="relative">
            {/* Mock profile cards */}
            <div className="relative z-20 bg-white rounded-2xl shadow-2xl p-4 w-64 h-80 transform rotate-2">
              <div className="h-48 bg-gradient-to-br from-pink-300 to-orange-300 rounded-xl mb-3 flex items-center justify-center">
                <Users className="w-16 h-16 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Sarah, 25</h3>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>2km away</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <Dumbbell className="w-4 h-4 mr-1" />
                <span>Yoga, Running</span>
              </div>
            </div>
            
            <div className="absolute top-4 left-4 z-10 bg-white rounded-2xl shadow-2xl p-4 w-64 h-80 transform -rotate-6 opacity-60">
              <div className="h-48 bg-gradient-to-br from-purple-300 to-blue-300 rounded-xl mb-3 flex items-center justify-center">
                <Dumbbell className="w-16 h-16 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-1">Mike, 28</h3>
              <div className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>5km away</span>
              </div>
            </div>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-4">
          Start Your Fitness Journey
        </h2>
        <p className="text-white opacity-90 mb-8 max-w-sm mx-auto">
          Join thousands of fitness enthusiasts who found their perfect workout partners
        </p>

        {/* CTA Buttons */}
        <div className="space-y-4 max-w-sm mx-auto">
          <Link 
            to="/register"
            className="block w-full bg-white text-pink-500 font-bold py-4 px-8 rounded-full hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
          >
            Create Account
          </Link>
          
          <Link 
            to="/login"
            className="flex items-center justify-center w-full bg-white bg-opacity-20 backdrop-blur-sm text-white font-bold py-4 px-8 rounded-full border-2 border-white border-opacity-30 hover:bg-opacity-30 transition-all duration-200"
          >
            Log In
            <ArrowRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 text-center">
      <div className="w-16 h-16 bg-white bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-4">
        <div className="text-white">
          {icon}
        </div>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
      <p className="text-white opacity-80 text-sm">{description}</p>
    </div>
  );
}

function QuickActionCard({ to, icon, title, subtitle, gradient }) {
  return (
    <Link to={to}>
      <div className={`bg-gradient-to-r ${gradient} rounded-2xl p-4 text-white hover:shadow-xl transform hover:scale-105 transition-all duration-200`}>
        <div className="flex items-center mb-2">
          {icon}
          <div className="ml-3">
            <h3 className="font-bold text-sm">{title}</h3>
            <p className="text-xs opacity-80">{subtitle}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

function StatItem({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-2xl font-bold text-white">{number}</div>
      <div className="text-white opacity-70 text-xs">{label}</div>
    </div>
  );
}

export default HomePage;