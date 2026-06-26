import React from "react";
import { MdCastForEducation } from "react-icons/md";
import { SiOpenaccess } from "react-icons/si";
import { FaSackDollar } from "react-icons/fa6";
import { BiSupport } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";

function Logos() {
    const features = [
        {
            icon: <MdCastForEducation />,
            title: "20K+ Online Courses",
        },
        {
            icon: <SiOpenaccess />,
            title: "Lifetime Access",
        },
        {
            icon: <FaSackDollar />,
            title: "Value For Money",
        },
        {
            icon: <BiSupport />,
            title: "Lifetime Support",
        },
        {
            icon: <FaUsers />,
            title: "Community Support",
        },
    ];

    return (
        <section className="w-full py-12 px-4 md:px-10">
            <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-6">
                {features.map((item, index) => (
                    <div
                        key={index}
                        className="group flex items-center gap-4
            px-7 py-5
            rounded-3xl
            bg-white/80
            backdrop-blur-xl
            border border-orange-200
            shadow-lg
            hover:shadow-2xl
            hover:shadow-orange-300/40
            hover:-translate-y-2
            hover:scale-105
            transition-all
            duration-500
            cursor-pointer"
                    >
                        {/* Icon */}
                        <div
                            className="
              w-16 h-16
              rounded-2xl
              bg-gradient-to-br
              from-orange-500
              via-orange-400
              to-[#03394b]
              flex
              items-center
              justify-center
              text-white
              text-3xl
              shadow-lg
              group-hover:rotate-12
              group-hover:scale-110
              transition-all
              duration-500
              "
                        >
                            {item.icon}
                        </div>

                        {/* Text */}
                        <div>
                            <h3
                                className="
                text-lg
                md:text-xl
                font-extrabold
                tracking-wide
                text-[#03394b]
                group-hover:text-orange-600
                transition-all
                duration-300
                "
                            >
                                {item.title}
                            </h3>

                            <div
                                className="
                h-[3px]
                w-0
                bg-gradient-to-r
                from-orange-500
                to-[#03394b]
                rounded-full
                group-hover:w-full
                transition-all
                duration-500
              "
                            />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Logos;