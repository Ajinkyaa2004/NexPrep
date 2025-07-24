import { Button } from "../components/ui/button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-xl font-semibold">hello</p>
      <Button>hello</Button>
    </div>
  );
}
