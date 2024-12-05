

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div>
      <h1>Hello World</h1>

      <button className="bg-blue-500 text-white p-2 rounded-md">Click me 버튼</button>
      <br />
      <Button>Click me</Button>
      <br />
      <Button variant={'destructive'}>Button-destructive</Button>
      <Button variant={'default1'} size={'lg'}>Button-default1</Button>
      <Button variant={'secondary'} size={'sm'}>Button-secondary-sm</Button>
    </div>
  );
}
