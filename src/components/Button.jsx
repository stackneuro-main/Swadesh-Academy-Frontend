import { NavLink } from "react-router-dom";

export default function Button({ name, styleType, link }) {
  const baseStyles = "px-5 py-2 rounded-full shadow-md border-3 inline-block";
  const dynamicStyle =
    styleType === "primary"
      ? "bg-primary text-white hover:bg-white hover:text-primary"
      : "bg-white text-primary hover:bg-primary hover:text-white";

  return (
    
    <NavLink to={link} className={`${baseStyles} ${dynamicStyle}  text-center`}>
      {name}
    </NavLink>
  );
}
