import { useEffect, useState } from "react";
import useAuthStore from "../context/useAuth";
import { useMatch, useNavigate } from "react-router-dom";

const AuthModal = () => {
  const [authForm, setAuthForm] = useState(true);
  const { setOpenModal } = useAuthStore();

  //LOGIN VARIABLES
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, register, loading, error, setError, isAuthenticated } =
    useAuthStore();

  //REGISTER VARIABLES
  const [regEmail, setRegEmail] = useState("");
  const [regName, setRegName] = useState("");
  const [regPassword, setregPassword] = useState("");
  const navigate = useNavigate();
  const match = useMatch("/auth");

  useEffect(() => {
    if (isAuthenticated && match !== null) {
      closeModal();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("LOGGING IN");
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }
    try {
      await login(email, password);

      if (match !== null) {
        navigate(-1);
      }
    } catch (e) {
      console.log("AUTH ERR:", e);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log("REGISTERING");
    if (!regEmail || !regPassword || !regName) {
      return alert("Please fill in all fields");
    }
    try {
      const result = await register(regEmail, regPassword, regName);

      if (result === "success") {
        setAuthForm(true);
      }
      if (match !== null) {
        navigate(-1);
      }
    } catch (e) {
      console.log("AUTH ERR:", e);
    }
  };

  // Close modal function
  const closeModal = () => {
    setOpenModal(false);
    setError("");
    setEmail("");
    setPassword("");
    setRegEmail("");
    setRegName("");
    setregPassword("");

    if (match !== null) {
      navigate(-1);
    }
  };

  return (
    <div className="bg-green-700">
      {authForm ? (
        //LOGIN FORM
        <div>
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded shadow-lg w-96 z-50">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-xl font-bold mb-4 title">Login</h2>
                <button
                  onClick={() => closeModal()}
                  className="cursor-pointer p-2 font-semibold text-xl"
                >
                  <h2>x</h2>
                </button>
              </div>
              <form>
                {error.length !== 0 && (
                  <div className="p-2 my-2 bg-red-100 rounded">
                    <p className="text-red-500">{error}</p>
                  </div>
                )}
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-2 label"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    className="w-full p-2 border border-gray-300 rounded"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-2 label"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    placeholder="Enter your Password"
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-pink-200 font-semibold py-2 rounded hover:bg-pink-500 cursor-pointer"
                  onClick={handleLogin}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Login"}
                </button>
              </form>
              <p className="py-3">
                Don't have an account?{" "}
                <button
                  onClick={() => setAuthForm(false)}
                  className="text-pink-600 font-bold cursor-pointer"
                >
                  Register
                </button>
              </p>
            </div>
          </div>
        </div>
      ) : (
        //REGISTER FORM
        <div className="">
          <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-10">
            <div className="bg-white p-6 rounded shadow-lg w-96 z-50">
              <div className="flex flex-row justify-between items-center">
                <h2 className="text-xl font-bold mb-4 title">Register</h2>
                <button
                  onClick={() => closeModal()}
                  className="cursor-pointer p-2 font-semibold text-xl"
                >
                  <h2>x</h2>
                </button>
              </div>
              <form>
                {error.length !== 0 && (
                  <div className="p-2 my-2 bg-red-100 rounded">
                    <p className="text-red-500">{error}</p>
                  </div>
                )}
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-2 label"
                    htmlFor="password"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    placeholder="Enter your Name"
                    className="w-full p-2 border border-gray-300 rounded"
                    onChange={(e) => setRegName(e.target.value)}
                    value={regName}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-2 label"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your Email"
                    className="w-full p-2 border border-gray-300 rounded"
                    onChange={(e) => setRegEmail(e.target.value)}
                    value={regEmail}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label
                    className="block text-sm font-medium mb-2 label"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your Password"
                    className="w-full p-2 border border-gray-300 rounded"
                    onChange={(e) => setregPassword(e.target.value)}
                    value={regPassword}
                    required
                  />
                </div>

                <button
                  type="submit"
                  onClick={handleRegister}
                  disabled={loading}
                  className="w-full bg-pink-200 font-semibold py-2 rounded hover:bg-pink-500 cursor-pointer"
                >
                  {loading ? "Loading.." : "Register"}
                </button>
              </form>
              <p className="py-3">
                Already have an account?{" "}
                <button
                  onClick={() => setAuthForm(true)}
                  className="text-pink-600 font-bold cursor-pointer"
                >
                  Login
                </button>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthModal;
