export interface ProcessedFile {
    detections:   [];
    filename:     string;
    processedImage: string;
    type:         string;
    image:        string;
    source:       string;
    timestamp:    string;
    NO_ID_FIELD:  string;
}

export interface Detection {
    bbox:       Array<number[]>;
    class:      number;
    confidence: number;
}
