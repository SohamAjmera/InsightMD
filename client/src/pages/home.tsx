import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Brain, 
  Upload, 
  Heart, 
  Shield, 
  Users, 
  FileText, 
  Camera,
  Microscope,
  Activity,
  ArrowRight,
  CheckCircle,
  Star,
  Mail,
  Phone,
  MapPin,
  AlertTriangle,
  Sparkles,
  Zap,
  Eye,
  Lock,
  Globe,
  Play,
  Award,
  TrendingUp,
  Clock,
  Target
} from "lucide-react";
import { Link } from "wouter";
import MedicalChatbot from "@/components/ai-chatbot/medical-chatbot";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleGetStarted = () => {
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = '/medical-upload';
    }, 500);
  };

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced machine learning algorithms analyze medical images and reports with 99.2% accuracy",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: Camera,
      title: "Multi-Modal Support",
      description: "Upload X-rays, CT scans, MRI images, and blood test reports for comprehensive analysis",
      color: "from-green-500 to-blue-500"
    },
    {
      icon: Activity,
      title: "3D Visualization",
      description: "Convert 2D medical scans into interactive 3D models for better anatomical understanding",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Users,
      title: "Specialist Connection",
      description: "Connect with relevant medical specialists based on AI insights for second opinions",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "Your medical data is encrypted and secure, with full HIPAA compliance",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: FileText,
      title: "Detailed Reports",
      description: "Generate comprehensive medical reports with actionable insights and recommendations",
      color: "from-teal-500 to-green-500"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Radiologist",
      content: "InsightMD has revolutionized how I analyze medical images. The AI insights are remarkably accurate and save me hours of analysis time.",
      rating: 5,
      avatar: "👩‍⚕️",
      specialty: "Radiology"
    },
    {
      name: "Dr. Michael Chen",
      role: "General Practitioner",
      content: "The 3D visualization feature helps me explain complex conditions to patients more effectively. It's a game-changer for patient education.",
      rating: 5,
      avatar: "👨‍⚕️",
      specialty: "General Practice"
    },
    {
      name: "Dr. Emily Rodriguez",
      role: "Emergency Medicine",
      content: "Quick and reliable analysis that helps me make faster, more informed decisions in critical situations. The accuracy is impressive.",
      rating: 5,
      avatar: "👩‍⚕️",
      specialty: "Emergency Medicine"
    }
  ];

  const stats = [
    { value: "99.2%", label: "Accuracy Rate", icon: Target, color: "from-green-500 to-blue-500" },
    { value: "10k+", label: "Scans Analyzed", icon: TrendingUp, color: "from-blue-500 to-purple-500" },
    { value: "500+", label: "Medical Partners", icon: Users, color: "from-purple-500 to-pink-500" },
    { value: "<2min", label: "Average Response", icon: Clock, color: "from-orange-500 to-red-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-green-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-xl border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                InsightMD
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
                  Dashboard
                </Button>
              </Link>
              <Link href="/medical-upload">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto text-center max-w-5xl">
          <Badge className="mb-6 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200/50 px-4 py-2 rounded-full">
            <Sparkles className="h-4 w-4 mr-2" />
            Powered by Gemini AI
          </Badge>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent leading-tight">
            AI-Powered Medical
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Intelligence
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
            Transform your medical practice with advanced AI analysis. Upload medical images and reports 
            to receive instant insights, 3D visualizations, and comprehensive health summaries powered by cutting-edge AI.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
              onClick={handleGetStarted}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Loading...
                </div>
              ) : (
                <>
                  <Upload className="mr-3 h-6 w-6" />
                  Upload Medical Data
                </>
              )}
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-4 rounded-2xl border-2 border-gray-200 hover:border-gray-300 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-200"
            >
              <Play className="mr-3 h-6 w-6" />
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mr-3`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 border border-green-200/50 px-4 py-2 rounded-full">
              <Award className="h-4 w-4 mr-2" />
              Trusted by Medical Professionals
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Advanced Medical AI Platform
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with medical expertise to provide 
              comprehensive analysis and insights that healthcare professionals can trust.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl overflow-hidden group">
                <CardHeader className="pb-4">
                  <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold text-gray-900">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Simple three-step process to get AI-powered medical insights
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-2xl font-bold">1</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Upload</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload your medical images (X-rays, CT scans, MRI) or blood test reports securely through our encrypted platform
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-2xl font-bold">2</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Analyze</h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI analyzes the data and generates comprehensive medical insights with detailed findings and recommendations
              </p>
            </div>
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-200">
                <span className="text-white text-2xl font-bold">3</span>
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-gray-900">Insights</h3>
              <p className="text-gray-600 leading-relaxed">
                Receive detailed reports, 3D visualizations, and actionable recommendations for better patient care
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-6 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Trusted by Medical Professionals
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join thousands of healthcare professionals using AI to improve patient care and outcomes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-white/70 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4">{testimonial.avatar}</div>
                    <div>
                      <div className="flex items-center mb-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <p className="font-semibold text-gray-900">{testimonial.name}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {testimonial.specialty}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Medical Practice?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto">
            Join thousands of healthcare professionals using AI to improve patient care and make better clinical decisions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 transform hover:scale-105"
              onClick={handleGetStarted}
            >
              Get Started Now
              <ArrowRight className="ml-3 h-6 w-6" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-white border-white/30 hover:bg-white/10 text-lg px-8 py-4 rounded-2xl"
            >
              <Play className="mr-3 h-6 w-6" />
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-6">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">InsightMD</h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                AI-powered medical insights platform for healthcare professionals.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">Platform</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/medical-upload" className="hover:text-white transition-colors">Upload Data</Link></li>
                <li><Link href="/ai-insights" className="hover:text-white transition-colors">AI Insights</Link></li>
                <li><Link href="/advanced-ai" className="hover:text-white transition-colors">3D Visualization</Link></li>
                <li><Link href="/telehealth" className="hover:text-white transition-colors">Telehealth</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">Support</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-6 text-lg">Contact</h4>
              <div className="space-y-3 text-gray-400">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5" />
                  <span>support@insightmd.com</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5" />
                  <span>San Francisco, CA</span>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 InsightMD. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Medical Disclaimer */}
      <Alert className="fixed bottom-6 right-6 max-w-md bg-white/90 backdrop-blur-xl border border-gray-200/50 shadow-2xl rounded-2xl">
        <AlertTriangle className="h-5 w-5 text-orange-500" />
        <AlertDescription className="text-sm">
          <strong>Medical Disclaimer:</strong> This platform provides AI-powered analysis for educational 
          and research purposes only. Always consult qualified healthcare professionals for medical 
          diagnosis and treatment decisions.
        </AlertDescription>
      </Alert>

      {/* AI Chatbot */}
      <MedicalChatbot />
    </div>
  );
} 