import { useState } from "react";
import MetricItem1 from "../assets/Metric_item_1.png";
import MetricItem2 from "../assets/Metric_item_2.png";
import MetricItem3 from "../assets/Metric_item_3.png";
import InventoryMovement from "../assets/inventory_movement.png";
import Container from "../assets/Container.png";
import MostSoldProduct from "../assets/most_sold_product.png";
import TopMovingCategory from "../assets/top_moving_category.png";
import RangeSelector from "../components/RangeSelector";

export default function Overview() {
  const [selectedRange, setSelectedRange] = useState("1d");

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Welcome back, Olivia</h1>
        <div className="flex items-center gap-4">
          <RangeSelector selectedRange={selectedRange} onRangeChange={setSelectedRange} />
          <button className="inline-flex items-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus-circle"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
            <span>Add Metrics</span>
          </button>
        </div>
      </div>
      {/* Metrics Row */}
      <div className="flex flex-wrap gap-4 mb-6">
        <img src={MetricItem1} alt="Average Order Volume" className="w-[220px] h-[100px] rounded-xl shadow" />
        <img src={MetricItem2} alt="Transaction Count" className="w-[220px] h-[100px] rounded-xl shadow" />
        <img src={MetricItem3} alt="Products Sold" className="w-[220px] h-[100px] rounded-xl shadow" />
        <img src={MetricItem1} alt="Gross Profit Margin" className="w-[220px] h-[100px] rounded-xl shadow" />
        <img src={MetricItem2} alt="Gross Profit" className="w-[220px] h-[100px] rounded-xl shadow" />
        <img src={MetricItem3} alt="Total Net Revenue" className="w-[220px] h-[100px] rounded-xl shadow" />
      </div>

      {/* Monthly Sales Vs Inventory Analysis */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Monthly Sales Vs Inventory Analysis</h2>
        <img src={Container} alt="Monthly Sales Vs Inventory Analysis" className="w-full max-w-4xl mx-auto" />
      </div>

      {/* Inventory Movement Landscape */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-lg font-semibold mb-2">Inventory Movement Landscape</h2>
        <img src={InventoryMovement} alt="Inventory Movement Landscape" className="w-full max-w-4xl mx-auto" />
      </div>

      {/* Bottom Row: Top Moving Category & Most Sold Products */}
      <div className="flex flex-wrap gap-6">
        <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[320px]">
          <h2 className="text-lg font-semibold mb-2">Top Moving Category</h2>
          <img src={TopMovingCategory} alt="Top Moving Category" className="w-full max-w-xs mx-auto" />
        </div>
        <div className="bg-white rounded-xl shadow p-6 flex-1 min-w-[320px]">
          <h2 className="text-lg font-semibold mb-2">Most Sold Products</h2>
          <img src={MostSoldProduct} alt="Most Sold Products" className="w-full max-w-xs mx-auto" />
        </div>
      </div>
    </div>
  );
}
