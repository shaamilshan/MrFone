import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import OrderTableRow from "../Components/OrderTableRow";
import { getOrders } from "../../../redux/actions/admin/ordersAction";
import SalesChart from "../Components/DashboardComponents/SalesChart";
import ProfitChart from "../Components/DashboardComponents/ProfitChart";
import UserChart from "../Components/DashboardComponents/UserChart";
import RevenueChart from "../Components/DashboardComponents/RevenueChart";
import MostSoldChart from "../Components/DashboardComponents/MostSoldChart";
import Modal from "../../../components/Modal";
import UpdateOrder from "./Order/UpdateOrder";
import { Calendar, ChevronDown } from "lucide-react";
import OutsideTouchCloseComponent from "../../../components/OutsideTouchCloseComponent";
import { debounce } from "time-loom";
import { useSearchParams } from "react-router-dom";

const AdminHome = () => {
  const { orders, loading, error } = useSelector((state) => state.orders);

  const dispatch = useDispatch();
  const [numberOfDates, setNumberOfDates] = useState(7);

  const [dropDown, setDropDown] = useState(false);
  const toggleDropDown = debounce(() => {
    setDropDown(!dropDown);
  }, 100);

  useEffect(() => {
    dispatch(getOrders({}));
  }, []);

  // Update Orders
  const [selectedOrderToUpdate, setSelectedOrderToUpdate] = useState({});
  const [updateModal, setUpdateModal] = useState(false);
  const toggleUpdateModal = (data) => {
    setUpdateModal(!updateModal);
    setSelectedOrderToUpdate(data);
  };

  return (
    <>
      {updateModal && (
        <Modal
          tab={
            <UpdateOrder
              toggleModal={toggleUpdateModal}
              data={selectedOrderToUpdate}
            />
          }
        />
      )}
      <div className="p-6 lg:p-8 w-full h-full overflow-y-auto bg-gray-50">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-black mb-2">Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back to your admin panel</p>
          </div>
          
          {/* Date Filter */}
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm text-gray-700"
              onClick={toggleDropDown}
            >
              <Calendar size={18} className="text-gray-600" />
              <span>Last {numberOfDates} days</span>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${dropDown ? 'rotate-180' : ''}`} />
            </button>
            
            {dropDown && (
              <OutsideTouchCloseComponent
                toggleVisibility={toggleDropDown}
                style="absolute top-12 right-0 font-normal w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
              >
                {[7, 30, 180, 365].map((days) => (
                  <button
                    key={days}
                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 border-b border-gray-100 last:border-b-0 transition-colors"
                    onClick={() => {
                      setNumberOfDates(days);
                      toggleDropDown();
                    }}
                  >
                    Last {days} Days
                  </button>
                ))}
              </OutsideTouchCloseComponent>
            )}
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <SalesChart numberOfDates={numberOfDates} />
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <ProfitChart numberOfDates={numberOfDates} />
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <UserChart numberOfDates={numberOfDates} />
          </div>
        </div>

        {/* Revenue and Most Sold */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <RevenueChart numberOfDates={numberOfDates} />
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-black mb-4">Most Sold Items</h2>
            <MostSoldChart numberOfDates={numberOfDates} />
          </div>
        </div>

        {/* Latest Orders Table */}
        {orders && orders.length > 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-black">Latest Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-max">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">No</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Order Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Delivery</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map((item, index) => (
                    <OrderTableRow
                      index={index + 1}
                      item={item}
                      toggleUpdateModal={toggleUpdateModal}
                      classes="px-6 py-4 border-b border-gray-100 text-sm text-gray-700 hover:bg-gray-50 transition-colors last:border-b-0"
                      key={index}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 flex flex-col items-center justify-center">
            <p className="text-gray-500 text-center text-lg">{error ? error : "No orders placed yet"}</p>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminHome;
