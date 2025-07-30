import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "@/components/auth/login-form";
import SignupForm from "@/components/auth/signup-form";
import { Brain, Sparkles, Shield, Users, Activity, TrendingUp } from "lucide-react";

interface AuthPageProps {
  onAuth: (userData: any) => void;
}

export default function AuthPage({ onAuth }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced medical insights using Gemini AI"
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Track your health metrics continuously"
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Your medical data is secure and encrypted"
    },
    {
      icon: Users,
      title: "Expert Network",
      description: "Connect with medical professionals worldwide"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="floating-element top-20 left-20">
          <div className="floating-circle animate-float" style={{ animationDelay: '0s' }} />
        </div>
        <div className="floating-element top-40 right-32">
          <div className="floating-circle animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="floating-element bottom-32 left-1/3">
          <div className="floating-circle animate-float" style={{ animationDelay: '4s' }} />
        </div>
      </div>

      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative z-10">
        <div className="flex flex-col justify-center px-12 py-16">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Logo */}
            <div className="flex items-center space-x-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">InsightMD</h1>
                <p className="text-blue-300">AI-Powered Medical Platform</p>
              </div>
            </div>

            {/* Hero Text */}
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
                Transform Your
                <span className="text-gradient block">Medical Practice</span>
              </h2>
              <p className="text-xl text-gray-300 leading-relaxed">
                Harness the power of AI to analyze medical images, interpret blood tests, 
                and provide intelligent insights for better patient care.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-start space-x-4"
                >
                  <div className="w-12 h-12 bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-6 w-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-12 grid grid-cols-3 gap-6"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">99.2%</div>
                <div className="text-sm text-gray-400">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">10k+</div>
                <div className="text-sm text-gray-400">Analyses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">500+</div>
                <div className="text-sm text-gray-400">Doctors</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Brain className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">InsightMD</h1>
            <p className="text-blue-300">AI-Powered Medical Platform</p>
          </div>

          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <LoginForm 
                  onLogin={onAuth}
                  onSwitchToSignup={() => setIsLogin(false)}
                />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <SignupForm 
                  onSignup={onAuth}
                  onSwitchToLogin={() => setIsLogin(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}