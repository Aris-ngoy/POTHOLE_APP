import os
from pymongo import MongoClient
import cv2  # Add this import for video processing
from tqdm import tqdm  # Add this import for progress bar
from flask_cors import CORS  # Add this import
from flask import Flask, request, jsonify, send_file
import torch  # Add this import
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from datetime import datetime  # Add this import for datetime
from gridfs import GridFSBucket
import io
from bson.objectid import ObjectId

# Load environment variables from .env file (optional but recommended)
load_dotenv()

app = Flask(__name__)
# CORS(app)
CORS(app, origins=["http://localhost:3000"])  # Add this line to enable CORS for all routes

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'avi'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Replace Firebase initialization with MongoDB
mongo_uri = os.getenv('MONGODB_URI')
client = MongoClient(mongo_uri)
db = client.get_database('potholes')  # Replace with your database name
fs = GridFSBucket(db, bucket_name='processed_files')

# Initialize YOLOv5 model
model = torch.hub.load('yolov5', 'custom', path='data/best.pt', source='local')

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def process_video(input_video, output_video):
    # Open the video
    cap = cv2.VideoCapture(input_video)
    
    # Get the codec and frame rate from the input video
    fourcc = int(cap.get(cv2.CAP_PROP_FOURCC))
    fps = cap.get(cv2.CAP_PROP_FPS)
    
    out = cv2.VideoWriter(output_video, fourcc, fps, (int(cap.get(3)), int(cap.get(4))))

    # Get total frame count for progress tracking
    total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

    # Use tqdm to create a progress bar
    for frame_number in tqdm(range(total_frames), desc="Processing frames"):
        ret, frame = cap.read()
        if not ret:
            break

        # Process every 5th frame
        if frame_number % 5 == 0:  # Only process every 5th frame
            # Perform inference with YOLOv5
            results = model(frame)

            # Extract detection metadata
            detections = []
            for *xyxy, conf, cls in results.xyxy[0]:  # YOLOv5 format
                detections.append({
                    'class': int(cls),  # Class label
                    'confidence': float(conf),  # Confidence score
                    'bbox': [float(x) for x in xyxy]  # Bounding box coordinates
                })

            # Render results on the frame
            frame = results.render()[0]  # YOLOv5 rendering

            # Write the frame to the output video
            out.write(frame)
        else:
            # If not processing, write the original frame to maintain video length
            out.write(frame)

    # Store metadata in potholes_data collection instead of detection_metadata
    if detections:
        db.potholes_data.insert_one({
            'filename': os.path.basename(output_video),
            'processedImage': str(output_video_id),
            'image': str(original_id),
            'detections': detections,
            'timestamp': datetime.now()
        })

    # Release resources
    cap.release()
    out.release()
    cv2.destroyAllWindows()

@app.route('/process', methods=['POST'])
def process_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        upload_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(upload_path)

        try:
            # Store original file in GridFS
            with open(upload_path, 'rb') as original_file:
                original_id = fs.upload_from_stream(
                    f"original/{filename}",
                    original_file,
                    metadata={'type': 'original'}
                )

            if filename.endswith(('mp4', 'avi')):
                processed_filename = f"processed_{filename.rsplit('.', 1)[0]}.mp4"
                processed_path = os.path.join(app.config['UPLOAD_FOLDER'], processed_filename)

                # Process the video
                process_video(upload_path, processed_path)

                # Upload processed video to GridFS
                with open(processed_path, 'rb') as processed_file:
                    processed_id = fs.upload_from_stream(
                        f"processed/{processed_filename}",
                        processed_file,
                        metadata={'type': 'processed'}
                    )

                # Store metadata separately in potholes_data collection
                db.potholes_data.insert_one({
                    'filename': processed_filename,
                    'processedImage': str(processed_id),
                    'image': str(original_id),
                    'type': 'video',
                    'source': 'web',
                    'timestamp': datetime.now()
                })

            else:
                # Process the image with YOLOv5
                results = model(upload_path)
                
                # Extract detection metadata
                detections = []
                for *xyxy, conf, cls in results.xyxy[0]:
                    detections.append({
                        'class': int(cls),
                        'confidence': float(conf),
                        'bbox': [float(x) for x in xyxy]
                    })

                # Save the processed image to a buffer
                processed_filename = f"processed_{filename.rsplit('.', 1)[0]}.jpg"
                im = results.render()[0]
                
                is_success, buffer = cv2.imencode(".jpg", im)
                if not is_success:
                    raise Exception("Failed to encode image")
                
                # Upload processed image to GridFS
                processed_id = fs.upload_from_stream(
                    f"processed/{processed_filename}",
                    io.BytesIO(buffer.tobytes()),
                    metadata={'type': 'processed'}
                )

                # Store metadata separately in potholes_data collection
                db.potholes_data.insert_one({
                    'filename': processed_filename,
                    'processedImage': str(processed_id),
                    'image': str(original_id),
                    'type': 'image',
                    'source': 'web',
                    'timestamp': datetime.now(),
                    'detections': detections
                })

            # Clean up local files
            os.remove(upload_path)
            if 'processed_path' in locals():
                os.remove(processed_path)

            return jsonify({'id': str(processed_id)}), 200

        except Exception as e:
            # Clean up in case of error
            if os.path.exists(upload_path):
                os.remove(upload_path)
            if 'processed_path' in locals() and os.path.exists(processed_path):
                os.remove(processed_path)
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Allowed file types are png, jpg, jpeg, gif, mp4, avi'}), 400

# Add a new route to retrieve files by ID
@app.route('/files/<file_id>', methods=['GET'])
def get_file(file_id):
    try:
        # Download file from GridFS
        grid_out = fs.open_download_stream(ObjectId(file_id))
        
        # Get file data and metadata
        file_data = grid_out.read()
        filename = grid_out.filename
        content_type = 'video/mp4' if filename.endswith('.mp4') else 'image/jpeg'
        
        # Return file as response
        return send_file(
            io.BytesIO(file_data),
            mimetype=content_type,
            as_attachment=True,
            download_name=filename.split('/')[-1]
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 404

if __name__ == '__main__':
    app.run(debug=True)
