export interface ProcessedFile {
    detections:   Detection[];
    filename:     string;
    original_url: string;
    type:         string;
    url:          string;
    NO_ID_FIELD:  string;
}

export interface Detection {
    bbox:       Array<number[]>;
    class:      number;
    confidence: number;
}
