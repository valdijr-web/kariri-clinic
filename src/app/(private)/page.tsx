import { ChartAreaInteractive } from "@/components/layout/chart-area-interactive";


import data from "./data.json"
import { SectionCards } from '@/components/layout/section-cards';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kariri Clinic - Dashboard",
  description: "Gestor de Clínicas",
};

export default function Page() {
  return (
     <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* <SectionCards />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div> */}
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <h2 className="text-lg font-medium text-gray-700">Bem-vindo ao Kariri Clinic Dashboard!</h2>
          <p className="text-gray-600">Aqui você pode acompanhar as principais métricas e informações sobre a sua clínica de forma rápida e fácil.</p>
          
        </div>
      </div>
    </div>
  )
}
