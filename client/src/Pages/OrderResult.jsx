import { useParams } from "react-router-dom";

const OrderResult = () => {
  const { status } = useParams();

  if (!status)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <a href="/" className="text-blue-500 hover:underline">
          Return to Home
        </a>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1
        className={`text-3xl font-bold mb-4  ${
          status === "success"
            ? "text-green-600"
            : status === "refunded"
            ? "text-blue-600"
            : "text-red-600"
        }`}
      >
        {status === "success"
          ? "Order Successful!"
          : status === "refunded"
          ? "Order Refunded!"
          : "Order Failed!"}
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        {status === "success"
          ? "Thank you for your purchase!"
          : status === "refunded"
          ? "Thank you for your understanding"
          : "Thank you, please try again"}
      </p>
      <a href="/" className="text-blue-500 hover:underline">
        Return to Home
      </a>
    </div>
  );
};

export default OrderResult;
