import Image from "next/image";
import HowItWorks from "./Components/HowItWorks";
import Link from "next/link";
import QR from "../public/qr.png";
import { Button } from "@/components/ui/button";
import { AccordionDemo } from "./Components/AccordionComponent";

export default function Home() {
  return (
    <>
      <div className=" bg-[url('/5.png')]  bg-center bg-cover md:h-[90vh] relative ">
        <div className="bg-black bg-opacity-60  w-full h-full">
          <div className="  text-white flex md:flex-row flex-col gap-4 justify-center h-full max-w-7xl mx-auto p-6 ">
            <div className="md:flex-1 flex justify-center items-center ">
              <div className="container mx-auto py-8">
                <h1 className="text-4xl font-bold  mb-4">
                  ¡Bienvenido a Receta Legal!
                </h1>
                <p className="text-lg  mb-8">
                  Únete a nosotros en la revolución de la forma en que los
                  usuarios de cannabis medicinal acceden de manera segura a sus
                  prescripciones. Receta Legal presenta un innovador sistema de
                  código QR, asegurando la verificación de las prescripciones
                  médicas con la máxima seguridad y eficiencia.
                </p>
                <div className="flex justify-center md:justify-normal items-center gap-4">
                  <p className="">
                    <Link href="#how-it-works" className="">
                      <Button>Cómo Funciona</Button>
                    </Link>
                  </p>
                  <p className="">
                    <Link href="/register" className="">
                      <Button className="bg-[#358f46] hover:bg-[#20482a]">
                        Unirse
                      </Button>
                    </Link>
                  </p>
                </div>
              </div>
            </div>
            {/* <div className="md:flex-1 flex justify-center items-center mt-2 md:mt-0  ">
            <Image
              className="rounded-lg"
              src={"/Logo_RLegal_white.png"}
              alt="qr-image"
              width={250}
              height={250}
            />
          </div> */}
          </div>
        </div>
      </div>
   
      <HowItWorks />
      <div className="max-w-7xl mx-auto p-6">
        <h1 className="text-lg font-bold text-center">FAQs</h1>

      <AccordionDemo />
      </div>
    </>
  );
}
