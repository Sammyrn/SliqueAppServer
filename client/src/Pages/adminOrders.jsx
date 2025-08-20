import ReactPaginate from "react-paginate";
import useOrderStore from "../context/useOrderStore";
import { useState } from "react";
import { format, formatDistance, subDays } from "date-fns";

const AdminOrders = () => {
  const { orders } = useOrderStore();
  const [itemsOffset, setItemsOffset] = useState(0);

  const itemsPerPage = 8; // Number of items per page

  const endOffset = itemsOffset + itemsPerPage;
  const pageCount = Math.ceil(orders.length / itemsPerPage);
  const currentItems = orders.slice(itemsOffset, endOffset);
  // Invoke when user click to request another page.
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % orders.length;
    //console.log(event, newOffset, orders.length);

    setItemsOffset(newOffset);
  };

  return (
    <div className="container mx-auto px-2 md:px-6 py-4">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-2">
        <div>
          <h1 className="text-xl md:text-3xl font-bold">Order List</h1>
          <p className="text-xs md:text-lg text-gray-600 font-semibold">
            Home {">"} Order Lists
          </p>
        </div>
      </div>
      <div className="bg-gray-50 rounded-2xl w-full min-h-[70vh] p-3 md:p-5 mt-4">
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
                  Phone
                </th>
                <th className="py-3 px-2 text-left border-b-2 border-b-gray-300">
                  Shipping State
                </th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, idx) => (
                <tr
                  key={`${item.id}-${idx}`}
                  className="bg-gray-50 hover:bg-gray-100 transition"
                >
                  <td className="py-2 px-2  border-b font-semibold border-b-gray-200">
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
                    {item.quantity || "NAN"}
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
          {currentItems.map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
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
                  {item.quantity + ' pieces' || "NAN"}
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
      <ReactPaginate
        breakLabel="..."
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="< previous"
        renderOnZeroPageCount={null}
        className="flex flex-row items-center justify-center space-x-2 mt-5"
        pageClassName="bg-pink-200 hover:bg-pink-500 p-2 rounded-md cursor-pointer"
        previousClassName="bg-pink-200 hover:bg-pink-500 p-2 rounded-md cursor-pointer"
        nextClassName="bg-pink-200 hover:bg-pink-500 p-2 rounded-md cursor-pointer"
        breakClassName="bg-pink-200 hover:bg-pink-500 p-2 rounded-md cursor-pointer"
        activeClassName="bg-pink-500 text-white py-2 px-5 rounded-md cursor-pointer"
        disabledClassName="bg-gray-300 text-gray-500 p-2 rounded-md cursor-not-allowed"
        forcePage={itemsOffset / itemsPerPage}
      />
    </div>
  );
};

export default AdminOrders;
