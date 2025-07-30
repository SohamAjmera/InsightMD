#!/bin/bash

# InsightMD Startup Script
# This script starts both the Node.js backend and Python 3D reconstruction service

echo "🚀 Starting InsightMD Medical AI Platform..."
echo "=========================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Function to cleanup background processes
cleanup() {
    echo "🛑 Shutting down services..."
    kill $NODE_PID $PYTHON_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start Python 3D reconstruction service in background
echo "🐍 Starting Python 3D Reconstruction Service..."
cd server/python-services
python3 medical_3d_service.py &
PYTHON_PID=$!
cd ../..

# Wait a moment for Python service to start
sleep 3

# Check if Python service is running
if curl -s http://localhost:8001/health > /dev/null; then
    echo "✅ Python 3D service is running on port 8001"
else
    echo "⚠️  Python 3D service may not be running properly"
fi

# Start Node.js backend
echo "🟢 Starting Node.js Backend..."
npm run dev &
NODE_PID=$!

# Wait for Node.js to start
sleep 5

# Check if Node.js service is running
if curl -s http://localhost:5000/api/dashboard/metrics > /dev/null; then
    echo "✅ Node.js backend is running on port 5000"
else
    echo "⚠️  Node.js backend may not be running properly"
fi

echo ""
echo "🎉 InsightMD is starting up!"
echo "📱 Frontend: http://localhost:5000"
echo "🔧 Backend API: http://localhost:5000/api"
echo "🐍 Python 3D Service: http://localhost:8001"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait 