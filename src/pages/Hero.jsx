import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="bg-gradient-to-r from-gray-800 to-gray-500 h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <h1 className="text-6xl text-white font-bold">Project Reservation</h1>
        <p className="text-2xl text-white mt-4">
          Save your time and reserve your project today
        </p>
        <div className="flex items-center space-x-4 mt-8">
          <Link to="/login" className="bg-white py-2 px-4 rounded-lg shadow-lg">
            Login
          </Link>
          <Link
            to="/register"
            className="bg-white py-2 px-4 rounded-lg shadow-lg"
          >
            Register
          </Link>
        </div>
      </div>
    </section>
  );
}
export default Hero;
