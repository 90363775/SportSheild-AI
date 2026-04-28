const BACKEND_URL = 'http://localhost:8000/api';

export interface AnalysisResponse {
  filename: string;
  similarity: number;
  risk: string;
  reason: string;
  ai_explanation: string;
  matched_asset: string | null;
  log_id: number;
}

export interface SuspiciousResponse {
  message: string;
  id: number;
  phash: string;
}

export const BackendService = {
  async analyzeMedia(file: File): Promise<AnalysisResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BACKEND_URL}/media/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Backend analyzeMedia error:', error);
      throw new Error('Backend unreachable. Please ensure the AI engine is running.');
    }
  },

  async registerBaseline(file: File): Promise<SuspiciousResponse> {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${BACKEND_URL}/media/suspicious`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Backend registerBaseline error:', error);
      throw new Error('Backend unreachable. Please ensure the AI engine is running.');
    }
  }
};
