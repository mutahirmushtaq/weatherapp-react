import { useState, useEffect, useRef } from "react";
import { FiSearch } from "react-icons/fi";
import { motion } from "framer-motion";
import clear from "../assets/clear.png";
import humidity from "../assets/humidity.png";
import wind from "../assets/wind.png";
import axios from "axios";
import cloud from "../assets/cloud.png";
import drizzle from "../assets/drizzle.png";
import rain from "../assets/rain.png";
import snow from "../assets/snow.png";
import toast, { Toaster } from "react-hot-toast";

const Weather = () => {
  const [inputCity, setInputCity] = useState("Lahore");
  const [city, setCity] = useState("Lahore");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const constraintsRef = useRef(null);
  const allIcons = {
    "01d": clear,
    "01n": clear,
    "02d": cloud,
    "02n": cloud,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,
    "09d": drizzle,
    "09n": drizzle,
  };
  const API_KEY = "0807337234b6023e8b93a63d20773de7";
  
  const fetchWeatherData = async () => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      );
      setWeatherData(response.data);
      setError("");
    } catch (error) {
      setError("City not found!");
      setWeatherData(null);
      toast("City not found !", { icon: "❌" });
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCity(inputCity);
  };

  const handleInputChange = (e) => {
    setInputCity(e.target.value);
  };

  const commonMotionProps = {
    whileHover: { scale: 1.1 },
    whileTap: { scale: 1.1 },
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10,
    },
    initial: { scale: 0 },
    animate: { scale: 1, transition: { duration: 0.8 } },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      drag
      dragConstraints={constraintsRef}
      ref={constraintsRef}
      className="place-self-center bg-white/5 bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-90 border border-gray-200/20 text-white shadow-zinc-800 lg:drop-shadow-2xl tracking-wide p-[25px] rounded-3xl shadow-2xl flex items-center flex-col "
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.form onSubmit={handleSubmit} className="flex items-center gap-2">
        <motion.input
          type="text"
          placeholder="Search"
          onChange={handleInputChange}
          value={inputCity}
          className="h-[50px] placeholder:bold capitalize border-none outline-none rounded-3xl text-zinc-800 bg-white pl-[25px] font-[18px]"
          variants={itemVariants}
        />
        <motion.button
          type="submit"
          className="cursor-pointer bg-white text-black flex items-center justify-center h-[51px] w-[51px] rounded-full p-3"
          variants={itemVariants}
        >
          <FiSearch className="text-black scale-[1.5] hover:scale-[1.75] transition-all duration-300" />
        </motion.button>
      </motion.form>
      <Toaster />
      {weatherData && (
        <motion.div className="flex flex-col items-center" initial="hidden" animate="visible" variants={containerVariants}>
          <motion.img
            src={allIcons[weatherData.weather[0].icon] || cloud}
            {...commonMotionProps}
            transition={{
              ...commonMotionProps.transition,
              ease: "easeOutElastic",
              delay: 0.2,
            }}
            animate={{
              ...commonMotionProps.animate,
              transition: { duration: 0.4 },
            }}
            className="w-[150px]  select-none mb-[15px] mt-[30px] mx-0"
            alt="weather icon"
          />
          <motion.p
            {...commonMotionProps}
            className="text-[60px] px-16 text-center leading-tight text-white"
          >
            {Math.floor(weatherData.main.temp)}°C
          </motion.p>
          <motion.p
            {...commonMotionProps}
            className="text-[40px] text-center px-20 text-white"
          >
            {weatherData.name}
          </motion.p>
          <motion.p
            {...commonMotionProps}
            className="text-[23px] text-center px-14 py-1 capitalize text-white"
          >
            {weatherData.weather[0].description}
          </motion.p>
          <motion.p
            {...commonMotionProps}
            className="text-[24px] px-14 py-[2px] text-white "
          >
            Feels Like: {Math.floor(weatherData.main.feels_like)}°C
          </motion.p>
          <div className="text-white w-[100%] gap- mt-[22px] flex justify-between">
            <motion.div className="flex items-start gap-[12px] font-[22px]" variants={itemVariants}>
              <img src={humidity} alt="humidity icon" className="w-[40px] h-9 mt-[7px]" />
              <div className="flex-col mb-1 flex">
                <p>{weatherData.main.humidity}%</p>
                <span className="block text-[16px]">Humidity</span>
              </div>
            </motion.div>
            <motion.div className="flex gap-3" variants={itemVariants}>
              <img
                src={wind}
                alt="wind icon"
                className="top-0 w-[40px] ml-5 h-10 mt-[5.5px]"
              />
              <div className="flex-col grid">
                <p>{weatherData.wind.speed} Km/h</p>
                <span className="block text-[16px]">Wind Speed</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Weather;
