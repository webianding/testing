import React from "react";

const Footer = () => {
  return (
    <footer className="bg-green-800 mt-8 text-white h-40 w-full flex justify-center items-center">
      <div className="text-center">
        <p className="text-sm">
          Contacto:{" "}
          <a href="mailto:contacto@recetalegal.cl" className="underline">
          info@recetalegal.cl
          </a>
        </p>
        <p className="text-sm">&copy;Receta Legal 2024</p>
      </div>
    </footer>
  );
};

export default Footer;
