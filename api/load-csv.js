// Vercel serverless function for /api/load-csv
export default async function handler(req, res) {

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Simulate CSV loading and processing
    const response = {
      message: 'CSV data loaded successfully from sample dataset',
      csvFile: 'sample_traffic_data.csv',
      recordsLoaded: 40,
      indicators: {
        totalAccidents: 96,
        totalFatalities: 39,
        avgCongestion: 0.487
      },
      mlPerformance: {
        'Linear Regression': { RMSE: 0.15, R2: 0.78 },
        'Decision Tree': { RMSE: 0.12, R2: 0.85 },
        'Random Forest': { RMSE: 0.08, R2: 0.92 }
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error loading CSV:', error);
    res.status(500).json({ message: 'Failed to load CSV data' });
  }
}