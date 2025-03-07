// components/admin-view/income-chart.jsx
import { fetchIncomeData } from '@/store/admin/income-slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


const IncomeChart = () => {
  const dispatch = useDispatch();
  const { incomeData, loading } = useSelector((state) => state.income);

  useEffect(() => {
    dispatch(fetchIncomeData());
  }, [dispatch]);

  // Add empty state
  if (loading) return <div className="p-4">Loading income data...</div>;
  if (!incomeData?.length) return <div className="p-4">No income data available</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md h-96">
      <h2 className="text-xl font-semibold mb-4">Monthly Income</h2>
      <ResponsiveContainer width="100%" height="100%">
        {/* Chart implementation */}
      </ResponsiveContainer>
    </div>
  );
};
export default IncomeChart;