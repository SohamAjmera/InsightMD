import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Brain, 
  Upload, 
  Activity, 
  Shield, 
  Users, 
  FileText,
  ArrowRight,
  Sparkles,
  Zap,
  Eye,
  Heart,
  TrendingUp,
  Star,
  CheckCircle,
  Play
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced medical insights using cutting-edge Gemini AI technology for accurate diagnosis and recommendations.",
      gradient: "from-blue-500 to-purple-500"
    },
    {
      icon: Upload,
      title: "Medical Image Upload",
      description: "Upload X-rays, MRI, CT scans, and blood test PDFs for instant AI analysis and 3D visualization.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Activity,
      title: "Real-time Monitoring",
      description: "Track health metrics continuously with intelligent alerts and personalized recommendations.",
      gradient: "from-green-500 to-blue-500"
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security with end-to-end encryption ensuring your medical data stays private.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: Users,
      title: "Expert Network",
      description: "Connect with medical professionals worldwide for second opinions and consultations.",
      gradient: "from-teal-500 to-green-500"
    },
    {
      icon: FileText,
      title: "Comprehensive Reports",
      description: "Generate detailed medical reports with AI insights, charts, and actionable recommendations.",
      gradient: "from-indigo-500 to-purple-500"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Radiologist",
      content: "InsightMD has revolutionized how I analyze medical images. The AI accuracy is remarkable.",
      rating: 5,
      avatar: "👩‍⚕️"
    },
    {
      name: "Dr. Michael Chen",
      role: "Cardiologist",
      content: "The blood test analysis feature saves me hours of work. Incredibly accurate and detailed.",
      rating: 5,
      avatar: "👨‍⚕️"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Emergency Medicine",
      content: "Fast, reliable analysis that helps me make better decisions in critical situations.",
      rating: 5,
      avatar: "👩‍⚕️"
    }
  ];

  const stats = [
    { value: "99.2%", label: "AI Accuracy", icon: Target },
    { value: "10k+", label: "Analyses", icon: TrendingUp },
    { value: "500+", label: "Doctors", icon: Users },
    { value: "<2min", label: "Response Time", icon: Zap }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
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

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="nav-dark sticky top-0 z-50"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">InsightMD</h1>
            </div>
            <div className="flex items-center space-x-6">
              <a href="#features" className="nav-link">Features</a>
              <a href="#testimonials" className="nav-link">Testimonials</a>
              <a href="#pricing" className="nav-link">Pricing</a>
              <Button onClick={onGetStarted} className="btn-primary">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto text-center max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 px-4 py-2 rounded-full">
              <Sparkles className="h-4 w-4 mr-2" />
              Powered by Gemini AI
            </Badge>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="text-white">AI-Powered</span>
              <br />
              <span className="text-gradient">Medical Intelligence</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your medical practice with advanced AI analysis. Upload medical images and reports 
              to receive instant insights, 3D visualizations, and comprehensive health summaries.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  onClick={onGetStarted}
                  className="btn-primary text-lg px-8 py-4"
                >
                  <Upload className="mr-3 h-6 w-6" />
                  Start Free Analysis
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="btn-secondary text-lg px-8 py-4"
                >
                  <Play className="mr-3 h-6 w-6" />
                  Watch Demo
                </Button>
              </motion.div>
            </div>

            {/* Stats */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
            >
              {stats.map((stat, index) => (
                <motion.div key={index} variants={itemVariants} className="text-center">
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-gray-400">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge className="mb-4 bg-gradient-to-r from-green-500/20 to-blue-500/20 text-green-300 border border-green-500/30 px-4 py-2 rounded-full">
              <Zap className="h-4 w-4 mr-2" />
              Advanced Features
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Comprehensive Medical AI Platform
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with medical expertise to provide 
              comprehensive analysis and insights that healthcare professionals can trust.
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="medical-card card-hover h-full">
                  <CardContent className="p-8">
                    <div className={`w-14 h-14 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-300">
              Simple three-step process to get AI-powered medical insights
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                step: "1",
                title: "Upload",
                description: "Upload your medical images (X-rays, CT scans, MRI) or blood test reports securely through our encrypted platform",
                icon: Upload
              },
              {
                step: "2", 
                title: "Analyze",
                description: "Our AI analyzes the data and generates comprehensive medical insights with detailed findings and recommendations",
                icon: Brain
              },
              {
                step: "3",
                title: "Insights",
                description: "Receive detailed reports, 3D visualizations, and actionable recommendations for better patient care",
                icon: Eye
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <span className="text-white text-2xl font-bold">{item.step}</span>
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Trusted by Medical Professionals
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Join thousands of healthcare professionals using AI to improve patient care and outcomes
            </p>
          </motion.div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="medical-card card-hover h-full">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="text-4xl mr-4">{testimonial.avatar}</div>
                      <div>
                        <div className="flex items-center mb-2">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                          ))}
                        </div>
                        <p className="font-semibold text-white">{testimonial.name}</p>
                        <p className="text-sm text-gray-400">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed italic">"{testimonial.content}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Medical Practice?
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              Join thousands of healthcare professionals using AI to improve patient care and make better clinical decisions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  onClick={onGetStarted}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Get Started Now
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="btn-secondary text-lg px-8 py-4"
                >
                  <Play className="mr-3 h-6 w-6" />
                  Watch Demo
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900/80 backdrop-blur-xl border-t border-gray-700/50 py-16 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white">InsightMD</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                AI-powered medical insights platform for healthcare professionals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg text-white">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Upload Data</a></li>
                <li><a href="#" className="hover:text-white transition-colors">AI Insights</a></li>
                <li><a href="#" className="hover:text-white transition-colors">3D Visualization</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reports</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg text-white">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg text-white">Contact</h4>
              <div className="space-y-3 text-gray-400">
                <div>support@insightmd.com</div>
                <div>+1 (555) 123-4567</div>
                <div>San Francisco, CA</div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700/50 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InsightMD. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}