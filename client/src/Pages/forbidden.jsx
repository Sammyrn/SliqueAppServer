import { Link } from "react-router-dom";

const ForbiddenScreen = () => (
  <div className="flex w-[100vw] h-[100vh] justify-center items-center py-5">
    <img
      className="absolute w-[100%] h-[100%]  top-0 left-0 object-cover"
      src="/forbidden.png"
      alt="Forbidden"
    />
    <div className="flex w-[500px] h-[500px] p-5 flex-col bg-white rounded justify-center items-center z-10 text-center space-y-5">
      <img src="/404.png" alt="404" />
      <p className="font-semibold text-lg" >Looks like you've got lost...</p>
      <Link to="/" className="bg-pink-500 text-white font-bold p-3 rounded">
        Go back to Home
      </Link>
    </div>
  </div>
)

export default ForbiddenScreen;
