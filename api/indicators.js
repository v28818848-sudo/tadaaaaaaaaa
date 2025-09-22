// Vercel serverless function for /api/indicators
export default async function handler(req, res) {

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Mock data for now - in production, you would connect to your data source
    const indicators = {
      totalAccidents: 96,
      totalFatalities: 39,
      avgCongestion: 0.487
    };

    res.status(200).json(indicators);
  } catch (error) {
    console.error('Error fetching indicators:', error);
    res.status(500).json({ message: 'Failed to fetch indicators' });
  }
}