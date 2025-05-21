
import React from "react";
import Logo from "@/components/Logo";
import LoginForm from "@/components/LoginForm";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - branding */}
      <div className="bg-secondary p-8 flex-1 flex flex-col justify-center items-center text-white">
        <div className="max-w-md mx-auto text-center">
          <Logo size="large" />
          <h2 className="text-3xl font-bold mt-10 mb-4">
            Plataforma de Gestão de estoque empresarial
          </h2>
          <p className="text-lg opacity-90">
            Administre as empresas clientes do serviço, intermedie trocas, registre logs de comunicação, etc.
          </p>
          <div className="mt-10">
            <div className="p-4 bg-white/10 rounded-lg backdrop-blur-sm mt-6">
              <p className="text-sm">
                "EcoStock transformou a maneira como nosso estoque é gerenciado e ajuda na organização das nossas trocas."
              </p>
              <p className="font-semibold mt-2">— Diretor de Operações, Empresa XYZ</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - login form */}
      <div className="p-8 flex-1 flex items-center justify-center">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
