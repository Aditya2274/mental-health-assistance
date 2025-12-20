import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 via-purple-50 to-pink-50 relative overflow-hidden">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="w-full px-6 py-6 md:px-12 md:py-8">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🧠</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ThoughtCare
                </h1>
                <p className="text-xs text-gray-500">Mental Health Support</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-medium text-purple-700 hover:text-purple-800 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-7xl mx-auto w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left: Hero Content */}
              <div className="space-y-8 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-purple-200 shadow-sm">
                  <span className="text-xl">🧠</span>
                  <span className="text-sm font-semibold text-purple-700">Child Mental Health Support</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 leading-tight">
                  Gentle support for{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient">
                    growing minds
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-xl">
                  A safe space for parents, teachers, and counsellors to track emotional wellbeing,
                  spot early warning signs, and act together before small worries become big problems.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    to="/login"
                    className="group px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg shadow-xl hover:shadow-2xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                  >
                    <span>Login</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="px-8 py-4 rounded-xl border-2 border-purple-300 text-purple-700 font-semibold text-lg bg-white/80 backdrop-blur-sm hover:bg-white hover:border-purple-500 hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Get Started
                  </Link>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-lg">👨‍👩‍👧</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">Parents</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-lg">👩‍🏫</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">Teachers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                      <span className="text-lg">🧑‍⚕️</span>
                    </div>
                    <span className="text-sm font-medium text-slate-700">Counsellors</span>
                  </div>
                </div>
              </div>

              {/* Right: Feature Cards */}
              <div className="relative space-y-6 animate-slide-in">
                {/* Main Feature Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50 transform hover:scale-[1.02] transition-transform duration-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">📊</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">Wellbeing Dashboard</h2>
                  </div>

                  <div className="space-y-5">
                    {/* Emotional Trend */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-semibold text-slate-800">Emotional Trend</p>
                          <p className="text-sm text-slate-500">Steady, improving</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500 mb-2">Last 4 weeks</p>
                          <div className="flex gap-1.5 items-end">
                            <span className="w-3 h-8 rounded-full bg-blue-300 animate-bar-1"></span>
                            <span className="w-3 h-10 rounded-full bg-blue-400 animate-bar-2"></span>
                            <span className="w-3 h-12 rounded-full bg-blue-500 animate-bar-3"></span>
                            <span className="w-3 h-11 rounded-full bg-purple-500 animate-bar-4"></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Feature Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 hover:shadow-lg transition-shadow">
                        <div className="w-10 h-10 bg-purple-200 rounded-lg flex items-center justify-center mb-3">
                          <span className="text-xl">📝</span>
                        </div>
                        <p className="text-xs font-medium text-slate-500 mb-1">Teacher Check-ins</p>
                        <p className="text-2xl font-bold text-purple-700 mb-2">Weekly</p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Short observations that highlight behaviour changes early.
                        </p>
                      </div>

                      <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 hover:shadow-lg transition-shadow">
                        <div className="w-10 h-10 bg-emerald-200 rounded-lg flex items-center justify-center mb-3">
                          <span className="text-xl">📋</span>
                        </div>
                        <p className="text-xs font-medium text-slate-500 mb-1">Parent Reports</p>
                        <p className="text-2xl font-bold text-emerald-700 mb-2">Guided</p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          Simple questions that translate into clear risk levels.
                        </p>
                      </div>
                    </div>

                    {/* Counsellor Alert */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 flex items-center gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                        <span className="text-2xl">🧑‍⚕️</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-800 mb-1">
                          Smart Alerts
                        </p>
                        <p className="text-sm text-slate-600">
                          High-risk patterns trigger gentle alerts to your school counsellor.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="flex items-center justify-center gap-8 pt-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-800">100%</p>
                    <p className="text-xs text-slate-500">Secure</p>
                  </div>
                  <div className="w-px h-8 bg-slate-300"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-800">24/7</p>
                    <p className="text-xs text-slate-500">Support</p>
                  </div>
                  <div className="w-px h-8 bg-slate-300"></div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-800">Easy</p>
                    <p className="text-xs text-slate-500">To Use</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full px-6 py-6 border-t border-purple-100">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm text-slate-500">
              Designed for{" "}
              <span className="font-semibold text-slate-700">
                parents, teachers & counsellors
              </span>{" "}
              working together to support each child.
            </p>
          </div>
        </footer>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-in {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes bar-1 {
          0%, 100% { height: 2rem; }
          50% { height: 2.5rem; }
        }
        @keyframes bar-2 {
          0%, 100% { height: 2.5rem; }
          50% { height: 3rem; }
        }
        @keyframes bar-3 {
          0%, 100% { height: 3rem; }
          50% { height: 3.5rem; }
        }
        @keyframes bar-4 {
          0%, 100% { height: 2.75rem; }
          50% { height: 3.25rem; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-slide-in {
          animation: slide-in 0.8s ease-out 0.2s both;
        }
        .animate-bar-1 {
          animation: bar-1 2s ease-in-out infinite;
        }
        .animate-bar-2 {
          animation: bar-2 2s ease-in-out infinite 0.2s;
        }
        .animate-bar-3 {
          animation: bar-3 2s ease-in-out infinite 0.4s;
        }
        .animate-bar-4 {
          animation: bar-4 2s ease-in-out infinite 0.6s;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}


