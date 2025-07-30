#!/usr/bin/env python3
"""
Startup script for Medical 3D Reconstruction Service
"""

import subprocess
import sys
import os
from pathlib import Path

def install_requirements():
    """Install required packages"""
    print("Installing Python requirements...")
    requirements_file = Path(__file__).parent / "requirements.txt"
    
    try:
        subprocess.check_call([
            sys.executable, "-m", "pip", "install", "-r", str(requirements_file)
        ])
        print("Requirements installed successfully!")
    except subprocess.CalledProcessError as e:
        print(f"Error installing requirements: {e}")
        return False
    
    return True

def start_service():
    """Start the FastAPI service"""
    print("Starting Medical 3D Reconstruction Service...")
    
    service_file = Path(__file__).parent / "medical_3d_service.py"
    
    try:
        subprocess.run([
            sys.executable, str(service_file)
        ])
    except KeyboardInterrupt:
        print("\nService stopped by user")
    except Exception as e:
        print(f"Error starting service: {e}")

if __name__ == "__main__":
    print("Medical 3D Reconstruction Service Startup")
    print("=" * 50)
    
    # Install requirements if needed
    if install_requirements():
        # Start the service
        start_service()
    else:
        print("Failed to install requirements. Exiting.")
        sys.exit(1) 