# InsightMD - AI-Powered Medical Assistant Platform

InsightMD is a comprehensive web-based AI-powered medical assistant platform that accepts medical reports and scans (PDFs and images), and returns health summaries, AI insights, and simulated 3D visualizations.

## 🚀 Features

### Core Functionality
- **AI-Powered Medical Analysis**: Advanced machine learning algorithms analyze medical images and reports with high accuracy
- **Multi-Modal Support**: Upload X-rays, CT scans, MRI images, and blood test reports for comprehensive analysis
- **3D Visualization**: Convert 2D medical scans into interactive 3D models for better anatomical understanding
- **Specialist Connection**: Connect with relevant medical specialists based on AI insights for second opinions
- **Privacy First**: Your medical data is encrypted and secure, with full HIPAA compliance
- **Detailed Reports**: Generate comprehensive medical reports with actionable insights and recommendations

### Technical Features
- **Gemini AI Integration**: Powered by Google's Gemini Pro Vision API for image and text understanding
- **MONAI 3D Reconstruction**: Advanced medical imaging processing using MONAI framework
- **Real-time Processing**: Fast and efficient analysis with progress indicators
- **Interactive 3D Models**: Rotate, zoom, and explore 3D reconstructions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Radix UI** components
- **Three.js** for 3D visualization
- **React Query** for data fetching
- **Wouter** for routing

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **Drizzle ORM** for database management
- **Google Gemini AI** for medical analysis

### 3D Reconstruction Service
- **Python FastAPI** for 3D processing
- **MONAI** for medical imaging
- **NumPy** for numerical computations
- **PIL** for image processing

## 📋 Prerequisites

Before running InsightMD, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **Python 3.8+** with pip
- **Git** for version control

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd InsightMD
```

### 2. Install Dependencies
```bash
# Install Node.js dependencies
npm install

# Install Python dependencies
cd server/python-services
pip install -r requirements.txt
cd ../..
```

### 3. Set Up Environment Variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PYTHON_SERVICE_URL=http://localhost:8001
PORT=5000
```

### 4. Start the Application
```bash
# Use the startup script (recommended)
./start.sh

# Or start services manually:
# Terminal 1 - Python 3D service
cd server/python-services
python3 medical_3d_service.py

# Terminal 2 - Node.js backend
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:5000
- **Backend API**: http://localhost:5000/api
- **Python 3D Service**: http://localhost:8001

## 📖 Usage Guide

### Home Page
The landing page provides:
- Platform overview and features
- Call-to-action buttons for getting started
- Testimonials from medical professionals
- Contact information and support links

### Medical Upload
1. **Navigate** to the Medical Upload page
2. **Select** image type (X-ray, CT, MRI, Blood Test)
3. **Upload** your medical files
4. **Review** AI-generated analysis results
5. **Explore** 3D visualizations (if applicable)

### 3D Visualization
1. **Upload** multiple 2D slices for 3D reconstruction
2. **Select** scan type and body region
3. **Process** the reconstruction
4. **Interact** with the 3D model using mouse controls
5. **Download** the 3D model for further analysis

### AI Insights
- View comprehensive medical analysis
- Review risk assessments and recommendations
- Access detailed findings and interpretations
- Generate downloadable reports

## 🔧 API Endpoints

### Medical Analysis
- `POST /api/ai-insights/analyze-image` - Analyze medical images
- `POST /api/ai-insights/analyze-blood-test` - Analyze blood test results
- `POST /api/ai-insights/3d-reconstruction` - 3D reconstruction from slices

### Dashboard
- `GET /api/dashboard/metrics` - Get dashboard metrics
- `GET /api/patients` - Get patient list
- `GET /api/appointments` - Get appointments

### Python 3D Service
- `GET /health` - Service health check
- `POST /reconstruct-3d` - 3D volume reconstruction
- `POST /analyze-scan` - Single scan analysis

## 🏗️ Project Structure

```
InsightMD/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/              # UI components
│   │   │   ├── 3d-visualization/    # 3D visualization components
│   │   │   ├── dashboard/           # Dashboard components
│   │   │   ├── layout/              # Layout components
│   │   │   └── ui/                  # Base UI components
│   │   ├── pages/                   # Page components
│   │   ├── hooks/                   # Custom React hooks
│   │   └── lib/                     # Utility libraries
│   └── index.html
├── server/                          # Node.js backend
│   ├── python-services/             # Python 3D reconstruction service
│   │   ├── medical_3d_service.py    # FastAPI service
│   │   ├── requirements.txt         # Python dependencies
│   │   └── start_service.py         # Service startup script
│   ├── services/                    # Backend services
│   │   └── gemini.ts               # Gemini AI integration
│   ├── routes.ts                    # API routes
│   └── index.ts                     # Server entry point
├── shared/                          # Shared schemas
├── start.sh                         # Application startup script
└── README.md                        # This file
```

## 🔒 Security & Privacy

### Data Protection
- All medical data is encrypted in transit and at rest
- HIPAA-compliant data handling practices
- Secure file upload with size and type validation
- Temporary file storage with automatic cleanup

### API Security
- Input validation and sanitization
- Rate limiting on API endpoints
- CORS configuration for secure cross-origin requests
- Error handling without sensitive data exposure

## 🧪 Testing

### Frontend Testing
```bash
# Run frontend tests
npm test

# Run with coverage
npm run test:coverage
```

### Backend Testing
```bash
# Test API endpoints
npm run test:api

# Test Python service
cd server/python-services
python -m pytest
```

## 🚀 Deployment

### Production Build
```bash
# Build frontend
npm run build

# Start production server
npm start
```

### Docker Deployment
```bash
# Build Docker image
docker build -t insightmd .

# Run container
docker run -p 5000:5000 -p 8001:8001 insightmd
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Medical Disclaimer

**Important**: This platform provides AI-powered analysis for educational and research purposes only. Always consult qualified healthcare professionals for medical diagnosis and treatment decisions. The AI analysis should not replace professional medical advice.

## 🆘 Support

- **Email**: support@insightmd.com
- **Phone**: +1 (555) 123-4567
- **Documentation**: [docs.insightmd.com](https://docs.insightmd.com)
- **Issues**: [GitHub Issues](https://github.com/insightmd/issues)

## 🙏 Acknowledgments

- Google Gemini AI for advanced medical analysis capabilities
- MONAI community for medical imaging tools
- Medical professionals who provided feedback and testing
- Open source community for the amazing tools and libraries

---

**Built with ❤️ for the medical community** 