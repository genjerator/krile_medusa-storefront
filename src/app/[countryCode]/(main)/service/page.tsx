import { Metadata } from "next"
import ServiceList from "./service-list"

export const metadata: Metadata = {
  title: "Service",
  description: "Service",
}

export default function ServicePage() {
  return (
    <div className="content-container py-16 max-w-2xl">
      <h1 className="text-3xl font-semibold text-ui-fg-base mb-8">Service</h1>
      <p>
        Das Planeta Service Angebot bietet ein erstklassiges After-Sales-Portfolio aus Produkten und Dienstleistungen, maßgeschneidert für Ihre Anforderungen. 
        </p>
        <p>Es umfasst Präventivwartungsverträge, Remote Assistance, Live Support, Vor-Ort-Service, Optimierungsinspektionen, Original-Ersatzteile, Modernisierungen, unseren Helpdesk, Expressreparaturen und weitere Serviceleistungen.
      </p>
      <p>&nbsp;</p>
      <ServiceList />
    </div>
  )
}
