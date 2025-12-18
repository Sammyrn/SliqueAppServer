import { format, formatDistance, subDays } from "date-fns";
import useOrderStore from "../context/useOrderStore";
import { useEffect, useState } from "react";
import Loading from "../components/loading";

const Dashboard = () => {
  const { orders, getOrdersItems, loading } = useOrderStore();
  const [summary, setSummary] = useState({
    totalCustomers: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });

  //get order items api call
  useEffect(() => {
    getOrdersItems();
  }, []);
  // Calculate summary data
  useEffect(() => {
    const totalCustomers = new Set(orders.map((order) => order.customerName))
      .size;
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce(
      (acc, order) => acc + order.price_at_purchase,
      0
    );
    setSummary({
      totalCustomers,
      totalOrders,
      totalRevenue,
    });
  }, []);

  // Display only the last 10 orders in the list
  const recentOrders = orders.length > 10 ? orders.slice(0, 10) : orders;

  return (
    <div className="container mx-auto px-2 md:px-6 py-4">
      {loading && <Loading />}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-2">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-600 font-semibold text-sm md:text-base">
            Home {">"} Dashboard
          </p>
        </div>
      </div>
      {/* Summary Cards */}
      <div className="flex flex-col sm:flex-row gap-4 mb-5">
        <div className="flex flex-1 flex-row sm:flex-col items-center sm:items-start p-4 gap-3 rounded-lg bg-gray-50 shadow">
          <img
            src="/userIcon.png"
            alt=""
            className="w-10 h-10 md:w-[45px] md:h-[45px]"
          />
          <div>
            <p className="label font-bold text-xs md:text-sm">
              Total Customers
            </p>
            <p className="text-lg md:text-xl font-semibold">
              {summary.totalCustomers.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-row sm:flex-col items-center sm:items-start p-4 gap-3 rounded-lg bg-gray-50 shadow">
          <img
            src="/bagIcon.png"
            alt=""
            className="w-10 h-10 md:w-[45px] md:h-[45px]"
          />
          <div>
            <p className="label font-bold text-xs md:text-sm">Total Orders</p>
            <p className="text-lg md:text-xl font-semibold">
              {summary.totalOrders.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex flex-1 flex-row sm:flex-col items-center sm:items-start p-4 gap-3 rounded-lg bg-gray-50 shadow">
          <img
            src="/chartIcon.png"
            alt=""
            className="w-10 h-10 md:w-[45px] md:h-[45px]"
          />
          <div>
            <p className="label font-bold text-xs md:text-sm">Total Revenue</p>
            <p className="text-lg md:text-xl font-semibold">
              {"₦" + summary.totalRevenue.toLocaleString() || "0"}
            </p>
          </div>
        </div>
      </div>
      {/* Recent Orders Table/Card */}
      <div className="bg-gray-50 rounded-2xl w-full min-h-[60vh] p-3 md:p-5 mt-4">
        <h2 className="text-xl md:text-2xl font-bold pb-3 border-b border-b-gray-200 mb-3">
          Recent Orders
        </h2>
        {/* Desktop Table */}
        <div className="hidden md:block">
          <table className="w-full rounded-4xl ">
            <thead>
              <tr className="text-gray-700">
                <th className="py-3 px-2 text-left border-b-2 border-b-gray-300">
                  Product
                </th>
                <th className="py-3 px-2 text-left border-b-2 border-b-gray-300">
                  Order Id
                </th>
                <th className="py-3 px-2 text-left border-b-2 border-b-gray-300">
                  Date
                </th>
                <th className="py-3 px-2 text-left border-b-2 border-b-gray-300">
                  Customer Name
                </th>
                <th className="py-3 px-2 text-left border-b-2 border-b-gray-300">
                  Status
                </th>
                <th className="py-3 px-2 text-left border-b-2 border-b-gray-300">
                  Amount
                </th>
                <th className="py-3 px-2 text-left border-b-2 border-b-gray-300">
                  Quantity
                </th>
                <th className="py-3 px-2 text-left border-b-2 border-b-gray-300">
                  Customer Phone
                </th>
                <th className="py-3 px-2 text-left border-b-2 border-b-gray-300">
                  Shipping State
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((item, idx) => (
                <tr
                  key={`${item.id} - ${idx}`}
                  className="bg-gray-50 hover:bg-gray-100 transition"
                >
                  <td className="py-2 px-2 border-b font-semibold border-b-gray-200">
                    {item.name}
                  </td>
                  <td className="py-2 px-2 border-b font-semibold border-b-gray-200">
                    {item.id}
                  </td>
                  <td className="py-2 px-2 border-b font-semibold border-b-gray-200">
                    {idx === 0
                      ? formatDistance(
                          subDays(item.created_at, 3),
                          new Date(),
                          {
                            addSuffix: true,
                          }
                        )
                      : format(item.created_at, "MMM do, yyyy")}
                  </td>
                  <td className="py-2 px-2 border-b font-semibold border-b-gray-200">
                    {item.fullname}
                  </td>
                  <td className="py-2 px-2 border-b font-semibold border-b-gray-200">
                    <span
                      className={`inline-block h-2 w-2 rounded-full mr-2 ${
                        item.payment_status === "Paid"
                          ? "bg-green-500"
                          : item.payment_status === "Pending"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                    ></span>
                    <span className="font-semibold text-xs label">
                      {item.payment_status}
                    </span>
                  </td>
                  <td className="py-2 px-2 border-b font-semibold border-b-gray-200">
                    ₦{item.price_at_purchase.toLocaleString()}
                  </td>
                  <td className="py-2 px-2 border-b font-semibold border-b-gray-200">
                    {item.quantity || "NaN"}
                  </td>
                  <td className="py-2 px-2 border-b font-semibold border-b-gray-200">
                    {item.phone || "NaN"}
                  </td>
                  <td className="py-2 px-2 border-b font-semibold border-b-gray-200">
                    {item.shipping_address || "NaN"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Mobile Card Layout */}
        <div className="md:hidden flex flex-col gap-4">
          {recentOrders.map((item, idx) => (
            <div
              key={`${item.id} - ${idx}`}
              className="bg-white rounded-lg shadow p-4 flex flex-col gap-2"
            >
              <div className="flex justify-between items-center">
                <span className="font-bold text-base">{item.name}</span>
                <span className="text-xs text-gray-500">#{item.id}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span>
                  {idx === 0
                    ? formatDistance(subDays(item.created_at, 3), new Date(), {
                        addSuffix: true,
                      })
                    : format(item.created_at, "MMM do, yyyy")}
                </span>
                <span>{item.fullname}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="flex items-center gap-1">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      item.payment_status === "Paid"
                        ? "bg-green-500"
                        : item.payment_status === "Pending"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  ></span>
                  <span className="font-semibold text-xs label">
                    {item.payment_status}
                  </span>
                </span>
                <span className="font-bold text-sm">
                  {item.quantity || "NaN"}
                </span>
                <span className="font-bold text-sm">
                  ₦{item.price_at_purchase.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-600">
                <span className="font-bold text-sm">{item.phone || "NaN"}</span>
                <span className="font-bold text-sm">
                  {item.shipping_address || "NaN"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
