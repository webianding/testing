import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HowItWorks = () => {
  return (
    <div id="how-it-works">
      <p className="text-center text-xl font-bold my-6">¡Cómo Funciona!</p>
      <div className="md:flex gap-4   max-w-7xl mx-auto p-6 md:p-0">
        <div className="  flex md:flex-1  flex-col justify-center items-center ">
          <div className="w-full mx-auto p-8 bg-white rounded-lg shadow-lg">
            <ol className="list-decimal pl-8">
              <li>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 rounded-full flex justify-center items-center mr-4">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">
                      Registro/Inicio de Sesión de Usuario
                    </h2>
                    <p className="text-gray-600">
                      Los usuarios primero necesitarán registrarse o iniciar
                      sesión en sus cuentas en la plataforma Receta Legal.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 rounded-full flex justify-center items-center mr-4">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">
                      Generación de receta
                    </h2>
                    <p className="text-gray-600">
                      Después de iniciar sesión, los usuarios tendrán la opción
                      de generar sus prescripciones de cannabis medicinal a
                      través de un profesional médico calificado.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 rounded-full flex justify-center items-center mr-4">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">
                      Generación de Código QR
                    </h2>
                    <p className="text-gray-600">
                      Una vez que se genere la receta, Receta Legal
                      generará dinámicamente un código QR único asociado con esa
                      receta específica.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 rounded-full flex justify-center items-center mr-4">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">
                      Verificación de receta
                    </h2>
                    <p className="text-gray-600">
                      Cuando los usuarios necesiten acceder a su cannabis
                      medicinal, pueden presentar el código QR generado por
                      Receta Legal a la farmacia o autoridades pertinentes.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 rounded-full flex justify-center items-center mr-4">
                    <span className="text-white font-bold">5</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Proceso de Escaneo</h2>
                    <p className="text-gray-600">
                      Usando el escáner de código QR, el personal de la farmacia
                      o las autoridades escanearán el código QR presentado por
                      el usuario.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 rounded-full flex justify-center items-center mr-4">
                    <span className="text-white font-bold">6</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">
                      Confirmación de Verificación
                    </h2>
                    <p className="text-gray-600">
                      Tras una verificación exitosa, el personal de la farmacia
                      o las autoridades recibirán confirmación de que la
                      receta es válida y coincide con la información del
                      usuario almacenada en la base de datos de Receta Legal.
                    </p>
                  </div>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full flex justify-center items-center mr-4">
                    <span className="text-white font-bold">7</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">
                      Retroalimentación y Actualizaciones
                    </h2>
                    <p className="text-gray-600">
                      Receta Legal proporcionará retroalimentación al usuario,
                      confirmando que su receta ha sido verificada con
                      éxito. Además, la plataforma también puede ofrecer
                      actualizaciones sobre el estado de la receta del
                      usuario.
                    </p>
                  </div>
                </div>
              </li>
            </ol>
          </div>
        </div>
        <div className="md:flex-1 hidden  md:relative  md:mt-0 md:flex flex-col justify-around items-center">
          <Image
            width={500}
            height={500}
            alt="receta"
            src={"/prescripcion.jpg"}
          />
          <Image
            width={500}
            height={500}
            alt="receta"
            src={"/prescripcion2.jpg"}
          />
        </div>
        {/* <Link className="my-4" href={"/#"}>
            <Button>Información Legal</Button>
        </Link> */}
      </div>
    </div>
  );
};

export default HowItWorks;
