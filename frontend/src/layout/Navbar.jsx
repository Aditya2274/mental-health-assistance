import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  return (
    <div className="h-16 bg-white shadow flex justify-between items-center px-6">

      <h2 className="text-xl font-semibold">Dashboard</h2>

      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src="https://i.pravatar.cc/150?img=3" />
          <AvatarFallback>AD</AvatarFallback>
        </Avatar>
      </div>

    </div>
  );
}
