import React from "react";
import { FaStar, FaQuoteLeft, FaUserGraduate } from "react-icons/fa6";
import { FaRegStar } from "react-icons/fa";

const ReviewCard = ({ text, name, image, rating = 5, role }) => {
  return (
    <div
      className="
      group
      relative
      overflow-hidden
      max-w-sm
      w-full
      rounded-3xl
      bg-white/80
      backdrop-blur-xl
      border
      border-orange-200
      p-7
      shadow-xl
      hover:shadow-orange-300/40
      hover:shadow-2xl
      transition-all
      duration-500
      hover:-translate-y-3
      hover:scale-[1.03]
      "
    >
      {/* Animated Background Glow */}
      <div
        className="
        absolute
        -top-24
        -right-24
        w-56
        h-56
        rounded-full
        bg-orange-300/20
        blur-3xl
        group-hover:scale-150
        transition-all
        duration-700
        "
      />

      {/* Shine Effect */}
      <div
        className="
        absolute
        top-0
        -left-full
        w-1/2
        h-full
        bg-gradient-to-r
        from-transparent
        via-white/50
        to-transparent
        skew-x-12
        group-hover:left-[150%]
        duration-1000
        transition-all
        "
      />

      {/* Quote Icon */}
      <div
        className="
        w-14
        h-14
        rounded-2xl
        bg-gradient-to-br
        from-orange-500
        via-orange-400
        to-[#03394b]
        flex
        items-center
        justify-center
        text-white
        text-xl
        shadow-lg
        mb-5
        group-hover:rotate-12
        group-hover:scale-110
        transition-all
        duration-500
        "
      >
        <FaQuoteLeft />
      </div>

      {/* Rating */}
      <div className="flex gap-1 text-xl mb-5">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <span
              key={i}
              className={`transition-all duration-300 ${i < rating
                ? "text-yellow-400 group-hover:scale-125"
                : "text-gray-300"
                }`}
              style={{
                transitionDelay: `${i * 70}ms`,
              }}
            >
              {i < rating ? <FaStar /> : <FaRegStar />}
            </span>
          ))}
      </div>

      {/* Review */}
      <p
        className="
        text-gray-700
        leading-7
        text-[15px]
        mb-7
        font-medium
        group-hover:text-gray-900
        transition-all
        "
      >
        "{text}"
      </p>

      {/* Bottom */}
      <div className="flex items-center gap-4">
        {image ? (
          <img
            src={image}
            alt={name}
            className="
            w-16
            h-16
            rounded-full
            object-cover
            border-4
            border-orange-300
            shadow-lg
            group-hover:rotate-6
            group-hover:scale-110
            transition-all
            duration-500
            "
          />
        ) : (
          <div
            className="
            w-16
            h-16
            rounded-full
            bg-gradient-to-br
            from-orange-500
            via-orange-400
            to-[#03394b]
            flex
            items-center
            justify-center
            shadow-xl
            text-white
            text-3xl
            group-hover:rotate-12
            group-hover:scale-110
            transition-all
            duration-500
            "
          >
            <FaUserGraduate />
          </div>
        )}

        <div>
          <h3
            className="
            font-extrabold
            text-lg
            text-[#03394b]
            tracking-wide
            group-hover:text-orange-600
            transition-all
            "
          >
            {name}
          </h3>

          <p className="text-sm text-gray-500 font-medium">{role}</p>
        </div>
      </div>

      {/* Bottom Gradient Line */}
      <div
        className="
        absolute
        bottom-0
        left-0
        h-1
        w-0
        bg-gradient-to-r
        from-orange-500
        via-yellow-400
        to-[#03394b]
        group-hover:w-full
        transition-all
        duration-700
        "
      />
    </div>
  );
};

export default ReviewCard;