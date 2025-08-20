import Lottie from "lottie-react";
import loadingAnimation from "../loading.json";

const Loading = () => (
  <div  className="fixed inset-0 w-[100vw] flex flex-col justify-center items-center bg-[#00000067]">
    <Lottie animationData={loadingAnimation} loop={true} />
    <p className="text-xl text-gray-800">Loading...</p>
  </div>
);

export default Loading;
