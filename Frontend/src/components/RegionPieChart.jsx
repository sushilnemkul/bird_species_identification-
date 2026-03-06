import PropTypes from 'prop-types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { getRegionsFromHotspots, REGIONS } from '../utils/geoData';

const COLORS = {
  [REGIONS.MOUNTAIN]: '#0ea5e9', // Sky Blue
  [REGIONS.HILLY]: '#22c55e',    // Green
  [REGIONS.TERAI]: '#f59e0b',    // Amber
  [REGIONS.URBAN]: '#64748b'     // Slate Gray
};

const RegionPieChart = ({ hotspotsString }) => {
  const data = getRegionsFromHotspots(hotspotsString);

  if (!data || data.length === 0) {
    return (
        <div className="flex items-center justify-center p-6 bg-gray-50 rounded-xl border border-gray-100 h-64 text-gray-400">
            No regional distribution data available.
        </div>
    );
  }

  return (
    <div className="h-64 h-full w-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#999'} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [`${value} Known Hotspot(s)`, `${name} Region`]}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

RegionPieChart.propTypes = {
  hotspotsString: PropTypes.string
};

export default RegionPieChart;
