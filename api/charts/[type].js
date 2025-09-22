// Vercel serverless function for /api/charts/[type]
export default async function handler(req, res) {

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { type } = req.query;

  try {
    let chartData = [];

    switch (type) {
      case 'congestion':
        chartData = [
          { name: 'Low', value: 35, color: '#10B981' },
          { name: 'Medium', value: 45, color: '#F59E0B' },
          { name: 'High', value: 20, color: '#EF4444' }
        ];
        break;
      
      case 'hourly':
        chartData = Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          congestion: Math.random() * 0.8 + 0.1,
          accidents: Math.floor(Math.random() * 5)
        }));
        break;
      
      case 'daily':
        chartData = Array.from({ length: 7 }, (_, i) => ({
          day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
          avgCongestion: Math.random() * 0.8 + 0.2
        }));
        break;
      
      case 'accidents':
        chartData = Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          accidents: Math.floor(Math.random() * 50) + 10
        }));
        break;
      
      case 'fatalities':
        chartData = Array.from({ length: 12 }, (_, i) => ({
          month: i + 1,
          fatalities: Math.floor(Math.random() * 15)
        }));
        break;
      
      case 'vehicle':
        chartData = [
          { type: 'Cars', count: 1200 },
          { type: 'Trucks', count: 300 },
          { type: 'Motorcycles', count: 800 },
          { type: 'Buses', count: 150 }
        ];
        break;
      
      case 'heatmap':
        chartData = Array.from({ length: 24 }, (_, hour) =>
          Array.from({ length: 7 }, (_, day) => ({
            hour,
            day,
            intensity: Math.random() * 100
          }))
        ).flat();
        break;
      
      case 'ml':
        chartData = [
          { model: 'Linear Regression', rmse: 0.15, r2: 0.78 },
          { model: 'Decision Tree', rmse: 0.12, r2: 0.85 },
          { model: 'Random Forest', rmse: 0.08, r2: 0.92 }
        ];
        break;
      
      default:
        return res.status(400).json({ message: 'Invalid chart type' });
    }

    res.status(200).json(chartData);
  } catch (error) {
    console.error(`Error fetching ${type} chart data:`, error);
    res.status(500).json({ message: 'Failed to fetch chart data' });
  }
}