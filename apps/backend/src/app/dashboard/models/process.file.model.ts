export interface ProcessedFile {
    detections:   [];
    filename:     string;
    processedImage: string;
    type:         string;
    image:        string;
    source:       string;
    timestamp:    string;
    position:    GeolocationData
    NO_ID_FIELD:  string;
}

export interface Detection {
    bbox:       Array<number[]>;
    class:      number;
    confidence: number;
}

export type GeolocationData = {
    accuracy: number
    altitude: number
    altitude_accuracy: number
    heading: number
    heading_accuracy: number
    is_mocked: boolean
    latitude: number
    longitude: number
    speed: number
    speed_accuracy: number
    timestamp: number
  }
