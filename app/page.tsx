import { redirect } from "next/navigation";

// La redirección bloquea el prerender por diseño: es la entrada de la app.
export const instant = false;

export default function Home() {
  redirect("/klassia-play");
}
