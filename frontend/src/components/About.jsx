import React from "react";
import { FaPhoneAlt, FaCar } from "react-icons/fa";

const About = () => {
  return (
    <section className="about-wrapper bg-blue-50 py-10">
      <div className="about-linecontainer">
        <div className="about-line"></div>
      </div>
      <div className="flex flex-col md:flex-row justify-between items-center p-8">
      <div className="flex justify-center mb-8">
        <img 
          src="https://www.shutterstock.com/image-photo/man-handing-car-smart-key-600nw-2466586367.jpg" 
          alt="Vehicle Rental" 
          className="rounded-xl dark:transition dark:grayscale hover:grayscale-0 hover:shadow-2xl"  
        />
      </div>
        <div className="about-right flex flex-col justify-center md:w-1/2">
        <div className="about-left flex items-center mb-6 md:mb-0">
          <FaCar className="text-6xl text-[#846330] mr-4" />
          <h1 className="font-semibold text-[#846330] text-2xl md:text-3xl">
            About carzz Vehicle Rental
          </h1>
        </div>
          <p className="text-[#846330] text-lg mb-4">
            At carzz Vehicle Rental, we provide a variety of vehicles for all
            your transportation needs. Whether it's for business trips, family
            vacations, or special events, we strive to ensure a seamless and
            enjoyable rental experience. Established in 2010, we have built a
            reputation for excellent service and customer satisfaction, offering
            a fleet of well-maintained vehicles at competitive rates. Our
            dedicated team is here to assist you every step of the way, ensuring
            that your journey is safe, comfortable, and memorable.
          </p>
          <div className="about-bottom flex md:flex-row justify-between mt-4">
            <div className="experience text-center">
              <h1 className="p-2 text-5xl text-[#846330]">12+</h1>
              <p className="text-lg text-gray-700">
                Years of Experience
              </p>
            </div>
            <div className="contact flex items-center">
              <FaPhoneAlt className="text-2xl p-4 text-[#846330]" />
              <p className="text-lg text-gray-700">
                Call Us <br />
                <b className="font-medium">+91 00000 00000</b>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;