// Vercel serverless function for /api/traffic-data
export default async function handler(req, res) {

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Mock data for demonstration
    const trafficData = [
      {
        id: '1',
        date: new Date(),
        hour: 8,
        location: 'Visakhapatnam Junction',
        queue: 0.75,
        stopDensity: 0.65,
        accidents: 2,
        fatalities: 0,
        congestionScore: 0.7,
        congestionLevel: 'Medium',
        locationEncoded: 1
      }
    ];

    res.status(200).json(trafficData);
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    res.status(500).json({ message: 'Failed to fetch traffic data' });
  }
}