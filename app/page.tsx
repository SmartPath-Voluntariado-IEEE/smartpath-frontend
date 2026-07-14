"use client"

import { useEffect } from "react";
import { api } from "@/services/api";

export default function Home() {

  useEffect(() => {

    api.get("/health")
      .then(res => console.log(res.data))

  }, []);

  return (
    <main>

      <h1>Smartpath</h1>

    </main>
  )

}