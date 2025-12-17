import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-16 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
        <div className="absolute -bottom-32 -right-10 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl px-6 py-12 grid md:grid-cols-2 gap-10 items-center">
        {/* Left: Hero copy */}
        <div>
          <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 text-xs font-semibold text-purple-700 shadow-sm mb-4">
            <span className="text-lg">🧠</span>
            Child Mental Health Support
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
            Gentle support for{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              growing minds
            </span>
          </h1>

          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
            A safe space for parents, teachers, and counsellors to track emotional wellbeing,
            spot early warning signs, and act together before small worries become big problems.
          </p>

          <div className="flex flex-wrap gap-4 mb-4">
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-purple-700 transition-transform duration-200 transform hover:scale-[1.02]"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-6 py-3 rounded-xl border border-purple-300 text-purple-700 font-semibold bg-white/60 backdrop-blur-sm hover:bg-white hover:border-purple-500 transition-colors duration-200"
            >
              Get Started
            </Link>
          </div>

          <p className="text-xs text-slate-500">
            Designed for{" "}
            <span className="font-semibold text-slate-700">
              parents, teachers & counsellors
            </span>{" "}
            working together to support each child.
          </p>
        </div>

        {/* Right: Illustration-style card */}
        <div className="relative">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-6 md:p-8 border border-white/40">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-xl">📊</span> A gentle snapshot of wellbeing
            </h2>

            <div className="space-y-4 text-sm">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-blue-50">
                <div>
                  <p className="font-medium text-slate-800">Emotional Trend</p>
                  <p className="text-xs text-slate-500">Steady, improving</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500 mb-1">Last 4 weeks</p>
                  <div className="flex gap-1">
                    <span className="w-2 h-6 rounded-full bg-blue-200"></span>
                    <span className="w-2 h-8 rounded-full bg-blue-300"></span>
                    <span className="w-2 h-10 rounded-full bg-blue-400"></span>
                    <span className="w-2 h-9 rounded-full bg-blue-500"></span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-purple-50">
                  <p className="text-xs text-slate-500 mb-1">Teacher check-ins</p>
                  <p className="text-xl font-bold text-purple-700">Weekly</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Short observations that highlight behaviour changes early.
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-50">
                  <p className="text-xs text-slate-500 mb-1">Parent reports</p>
                  <p className="text-xl font-bold text-emerald-700">Guided</p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Simple questions that translate into clear risk levels.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-2 p-3 rounded-2xl bg-slate-50">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-lg">🧑‍⚕️</span>
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-700">
                    Counsellor alerts only when needed
                  </p>
                  <p className="text-[11px] text-slate-500">
                    High-risk patterns trigger gentle alerts to your school counsellor.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


