
import React from "react";

const Logo = ({ size = "default" }: { size?: "small" | "default" | "large" }) => {
  let className = "font-bold text-primary";

  switch (size) {
    case "small":
      className += " text-xl";
      break;
    case "large":
      className += " text-4xl";
      break;
    default:
      className += " text-2xl";
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center text-white font-bold">
        ES
      </div>
      <span className={className}>EcoStock</span>
    </div>
  );
};

export default Logo;
