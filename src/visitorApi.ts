import axios, { AxiosResponse } from "axios";

const API_URL = "https://birthday-backend-esks.onrender.com"; // replace with deployed URL

// Backend response when tracking a visit
interface VisitorResponse {
  message: string;
  visitorId?: string;
}

// Visitor entry type returned by GET /entries
export interface VisitorEntry {
  _id: string;
  ip: string;
  userAgent: string;
  entryTime: string;
  createdAt: string;
  updatedAt: string;
}

// Collect basic client info
const getClientInfo = () => ({
  userAgent: navigator.userAgent,
  platform: navigator.platform,
  language: navigator.language,
  screenWidth: window.screen.width,
  screenHeight: window.screen.height,
  viewportWidth: window.innerWidth,
  viewportHeight: window.innerHeight,
  connectionType: (navigator as any).connection?.effectiveType || "unknown",
});

// Track a new visit (entry only)
export const trackVisit = async (): Promise<VisitorResponse | undefined> => {
  try {
    const res: AxiosResponse<VisitorResponse> = await axios.post(
      `${API_URL}/track-visit`,
      getClientInfo(), // send device info to backend
      { headers: { "Content-Type": "application/json" } }
    );
    return res.data;
  } catch (err) {
    console.error("Error tracking visit:", err);
  }
};

// Fetch all entries (admin view)
export const getAllEntries = async (): Promise<VisitorEntry[] | undefined> => {
  try {
    const res: AxiosResponse<VisitorEntry[]> = await axios.get(`${API_URL}/entries`);
    return res.data;
  } catch (err) {
    console.error("Error fetching entries:", err);
  }
};
