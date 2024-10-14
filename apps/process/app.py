import os
from flask import Flask, request, jsonify
from ultralytics import YOLO
import firebase_admin
from firebase_admin import credentials, storage
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
import cv2  # Add this import for video processing
from tqdm import tqdm  # Add this import for progress bar

# Load environment variables from .env file (optional but recommended)
load_dotenv()

app = Flask(__name__)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'mp4', 'avi'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure upload directory exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize Firebase
firebase_credentials_path = os.getenv('FIREBASE_CREDENTIALS_PATH')  # Path to Firebase JSON
firebase_storage_bucket = os.getenv('FIREBASE_STORAGE_BUCKET').replace('gs://', '')  # Remove 'gs://' prefix

cred = credentials.Certificate(firebase_credentials_path)
firebase_admin.initialize_app(cred, {
    'storageBucket': firebase_storage_bucket
})
bucket = storage.bucket()

# Initialize YOLOv8 model
model = YOLO('data/best.pt')  # You can choose different YOLOv8 models

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
            # Perform inference with YOLOv8
            results = model(frame)

            # Render results on the frame
            annotated_frame = results[0].plot()

            # Resize the annotated frame to ensure it fits the output video dimensions
            annotated_frame = cv2.resize(annotated_frame, (int(cap.get(3)), int(cap.get(4))), interpolation=cv2.INTER_LINEAR)

            # Write the frame to the output video
            out.write(annotated_frame)
        else:
            # If not processing, write the original frame to maintain video length
            out.write(frame)

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
            # Check if the file is a video
            if filename.endswith(('mp4', 'avi')):  # Check for video file extensions
                processed_filename = f"processed_{filename.rsplit('.', 1)[0]}.mp4"  # Change to .mp4 or appropriate format
                processed_path = os.path.join(app.config['UPLOAD_FOLDER'], processed_filename)

                # Process the video
                process_video(upload_path, processed_path)

            else:
                # Process the file with YOLOv8 for images
                results = model(upload_path)

                # Define processed filename with the same extension as the original
                processed_filename = f"processed_{filename.rsplit('.', 1)[0]}.jpg"  # Change to .jpg or appropriate format
                processed_path = os.path.join(app.config['UPLOAD_FOLDER'], processed_filename)

                # Save processed file
                results[0].save(processed_path)  # Ensure results[0] is in a compatible format

            # Upload to Firebase Storage
            blob = bucket.blob(f"processed/{processed_filename}")
            blob.upload_from_filename(processed_path)
            blob.make_public()

            # Get public URL
            public_url = blob.public_url

            # Clean up local files
            os.remove(upload_path)
            os.remove(processed_path)

            return jsonify({'url': public_url}), 200

        except Exception as e:
            # Clean up in case of error
            if os.path.exists(upload_path):
                os.remove(upload_path)
            if os.path.exists(processed_path):
                os.remove(processed_path)
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Allowed file types are png, jpg, jpeg, gif, mp4, avi'}), 400

if __name__ == '__main__':
    app.run(debug=True)
