import { NavLink } from "react-router-dom";
import { Code2 } from "lucide-react"; // small code icon

export default function CourseCard({ courseinfo }) {
  const discount = courseinfo.oldPrice
    ? Math.round(((courseinfo.oldPrice - courseinfo.price) / courseinfo.oldPrice) * 100)
    : null;

  return (
    <div className="relative max-w-sm rounded-2xl overflow-hidden bg-white p-5 flex flex-col justify-evenly gap-4 hover:shadow-2xl transition-all duration-300 border border-gray-200 drop-shadow-md">
      {/* Discount Badge */}
      {discount && (
        <span className="absolute top-3 right-3 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-md shadow-md">
          {discount}% OFF
        </span>
      )}

      {/* Course Badge */}
      <div>
        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-md shadow-sm">
          COURSE
        </span>
      </div>

      {/* Course Info */}
      <div className="flex flex-col items-center justify-between gap-3">
        <h3 className="text-xl font-bold text-gray-800 text-center">
          {courseinfo?.name}
        </h3>
        <img
          src={courseinfo.img}
          alt="course"
          loading="lazy"
          className="w-full h-auto rounded-lg shadow-sm hover:scale-105 transition-transform"
        />

        {/* Pricing */}
        {courseinfo?.price && (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              {courseinfo.oldPrice && (
                <p className="text-gray-400 text-sm line-through">
                  ₹{courseinfo.oldPrice.toLocaleString("en-IN")}
                </p>
              )}
              <p className="text-xl font-bold text-blue-600">
                ₹{courseinfo.price.toLocaleString("en-IN")}
              </p>
            </div>
            {courseinfo.duration && (
              <p className="text-gray-600 text-sm mt-1">
                ({courseinfo.duration})
              </p>
            )}
          </div>
        )}
      </div>

      {/* Tech Stack (Improved Design) */}
      {courseinfo.tech && (
        <div className="mt-3 bg-blue-50 rounded-xl p-3 border border-blue-100 shadow-inner">
          <div className="flex items-center gap-2 mb-2">
            <Code2 size={16} className="text-blue-600" />
            <p className="text-sm font-semibold text-blue-700">Technologies Covered</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-start">
            {courseinfo.tech.map((item, index) => (
              <span
                key={index}
                className="text-xs bg-white text-blue-700 border border-blue-200 px-2.5 py-1 rounded-lg font-medium shadow-sm hover:bg-blue-100 transition-all"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Button */}
      <div className="w-full flex items-center justify-center mt-3">
        <NavLink
          to="/Contact"
          className="w-full text-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-700 hover:to-blue-800 text-white text-sm font-semibold px-6 py-2 rounded-lg shadow-md transition-all"
        >
          Enroll Now
        </NavLink>
      </div>
    </div>
  );
}
