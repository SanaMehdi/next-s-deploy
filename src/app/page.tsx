import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Page() {
  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-semibold">shadcn is live ✅</h1>

      <div className="space-x-3">
        <Button>Click me</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
      </div>

      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Card title</CardTitle>
        </CardHeader>
        <CardContent>
          This is a shadcn/ui Card component.
        </CardContent>
      </Card>
    </main>
  )
}
