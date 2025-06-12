import { Card, CardContent } from "@/components/ui/card"

const CardGrid = ({ items, type }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item._id}
          onClick={() => window.location.href = `/${type}/${item._id}`}
          className="cursor-pointer hover:shadow-lg transition"
        >
          <CardContent className="p-4">
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-muted-foreground">
              {item.description?.slice(0, 80)}...
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default CardGrid
