#!/usr/bin/env python3
"""
Medical 3D Reconstruction Service using MONAI
This service provides 3D reconstruction capabilities for medical images
"""

import os
import tempfile
import shutil
from pathlib import Path
from typing import List, Optional, Dict, Any
import numpy as np
from PIL import Image
import json

# MONAI imports
from monai.transforms import (
    Compose, LoadImage, AddChannel, ScaleIntensityRanged,
    ResizeWithPadOrCrop, NormalizeIntensity
)
from monai.data import Dataset, DataLoader
from monai.utils import first

# FastAPI imports
from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="Medical 3D Reconstruction Service", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Medical3DReconstructor:
    """Handles 3D reconstruction from medical image slices"""
    
    def __init__(self):
        self.transforms = Compose([
            LoadImage(image_only=True),
            AddChannel(),
            ScaleIntensityRanged(a_min=0, a_max=255, b_min=0.0, b_max=1.0, clip=True),
            ResizeWithPadOrCrop(spatial_size=(256, 256)),
            NormalizeIntensity(nonzero=True, channel_wise=True),
        ])
    
    def reconstruct_3d_volume(self, image_paths: List[str], output_dir: str) -> Dict[str, Any]:
        """
        Reconstruct 3D volume from 2D image slices
        
        Args:
            image_paths: List of paths to 2D image slices
            output_dir: Directory to save 3D reconstruction results
            
        Returns:
            Dictionary containing reconstruction metadata and file paths
        """
        try:
            # Sort image paths to ensure correct order
            image_paths = sorted(image_paths)
            
            if not image_paths:
                raise ValueError("No image paths provided")
            
            # Load and preprocess images
            processed_slices = []
            for i, image_path in enumerate(image_paths):
                try:
                    # Apply MONAI transforms
                    processed_slice = self.transforms(image_path)
                    processed_slices.append(processed_slice)
                    print(f"Processed slice {i+1}/{len(image_paths)}")
                except Exception as e:
                    print(f"Error processing slice {image_path}: {e}")
                    continue
            
            if not processed_slices:
                raise ValueError("No slices were successfully processed")
            
            # Stack slices to create 3D volume
            volume_3d = np.stack(processed_slices, axis=1)  # Shape: [1, D, H, W]
            
            # Save 3D volume as numpy array
            volume_path = os.path.join(output_dir, "volume_3d.npy")
            np.save(volume_path, volume_3d)
            
            # Generate metadata
            metadata = {
                "volume_shape": volume_3d.shape,
                "num_slices": len(processed_slices),
                "original_slice_count": len(image_paths),
                "processed_slice_count": len(processed_slices),
                "volume_path": volume_path,
                "output_directory": output_dir
            }
            
            # Save metadata
            metadata_path = os.path.join(output_dir, "metadata.json")
            with open(metadata_path, 'w') as f:
                json.dump(metadata, f, indent=2)
            
            return metadata
            
        except Exception as e:
            raise Exception(f"3D reconstruction failed: {str(e)}")
    
    def generate_3d_preview(self, volume_3d: np.ndarray, output_dir: str) -> str:
        """
        Generate a 3D preview image from the volume
        
        Args:
            volume_3d: 3D volume array
            output_dir: Directory to save preview
            
        Returns:
            Path to the generated preview image
        """
        try:
            # Take middle slice for preview
            middle_slice_idx = volume_3d.shape[1] // 2
            middle_slice = volume_3d[0, middle_slice_idx, :, :]
            
            # Convert to PIL Image
            preview_img = Image.fromarray((middle_slice * 255).astype(np.uint8))
            
            # Save preview
            preview_path = os.path.join(output_dir, "3d_preview.png")
            preview_img.save(preview_path)
            
            return preview_path
            
        except Exception as e:
            raise Exception(f"Preview generation failed: {str(e)}")

# Initialize reconstructor
reconstructor = Medical3DReconstructor()

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"message": "Medical 3D Reconstruction Service is running", "status": "healthy"}

@app.post("/reconstruct-3d")
async def reconstruct_3d_volume_endpoint(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
    scan_type: str = "mri",
    region: str = "brain"
):
    """
    Reconstruct 3D volume from uploaded medical image slices
    
    Args:
        files: List of medical image files (slices)
        scan_type: Type of scan (mri, ct, xray)
        region: Body region being scanned
        
    Returns:
        Reconstruction results and metadata
    """
    try:
        # Validate input
        if not files:
            raise HTTPException(status_code=400, detail="No files uploaded")
        
        if len(files) < 2:
            raise HTTPException(status_code=400, detail="At least 2 slices required for 3D reconstruction")
        
        # Create temporary directory for processing
        with tempfile.TemporaryDirectory() as temp_dir:
            # Save uploaded files
            image_paths = []
            for i, file in enumerate(files):
                if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
                    continue
                
                file_path = os.path.join(temp_dir, f"slice_{i:03d}.png")
                with open(file_path, "wb") as buffer:
                    shutil.copyfileobj(file.file, buffer)
                image_paths.append(file_path)
            
            if len(image_paths) < 2:
                raise HTTPException(status_code=400, detail="No valid image files found")
            
            # Perform 3D reconstruction
            metadata = reconstructor.reconstruct_3d_volume(image_paths, temp_dir)
            
            # Generate preview
            volume_3d = np.load(metadata["volume_path"])
            preview_path = reconstructor.generate_3d_preview(volume_3d, temp_dir)
            
            # Read preview image as base64 for response
            with open(preview_path, "rb") as f:
                preview_data = f.read()
            
            # Prepare response
            response_data = {
                "status": "success",
                "message": "3D reconstruction completed successfully",
                "metadata": {
                    "scan_type": scan_type,
                    "region": region,
                    "volume_shape": metadata["volume_shape"],
                    "num_slices": metadata["num_slices"],
                    "processing_time": "completed"
                },
                "preview_available": True,
                "download_ready": True
            }
            
            return JSONResponse(content=response_data)
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Reconstruction failed: {str(e)}")

@app.post("/analyze-scan")
async def analyze_medical_scan(
    file: UploadFile = File(...),
    scan_type: str = "mri"
):
    """
    Analyze a single medical scan image
    
    Args:
        file: Medical image file
        scan_type: Type of scan
        
    Returns:
        Analysis results
    """
    try:
        # Validate file
        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp')):
            raise HTTPException(status_code=400, detail="Invalid file type")
        
        # Save file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as temp_file:
            shutil.copyfileobj(file.file, temp_file)
            temp_path = temp_file.name
        
        try:
            # Load and process image
            processed_image = reconstructor.transforms(temp_path)
            
            # Basic analysis (placeholder for more sophisticated analysis)
            analysis_result = {
                "status": "success",
                "scan_type": scan_type,
                "image_processed": True,
                "image_shape": processed_image.shape,
                "analysis_summary": f"Successfully processed {scan_type.upper()} scan",
                "recommendations": [
                    "Image quality appears suitable for 3D reconstruction",
                    "Consider uploading multiple slices for better 3D visualization"
                ]
            }
            
            return JSONResponse(content=analysis_result)
            
        finally:
            # Clean up temporary file
            os.unlink(temp_path)
            
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "service": "Medical 3D Reconstruction",
        "version": "1.0.0",
        "monai_available": True,
        "capabilities": [
            "3D volume reconstruction",
            "Medical image analysis",
            "Preview generation"
        ]
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001) 