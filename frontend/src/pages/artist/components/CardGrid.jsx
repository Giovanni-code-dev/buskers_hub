import { Card, CardContent } from "@/components/ui/card"

const CardGrid = ({ items, type }) => {
  return (
    <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item._id}
          onClick={() => window.location.href = `/${type}/${item._id}`}
          className="cursor-pointer rounded-xl border shadow-sm hover:shadow-md transition-transform hover:scale-[1.02] bg-background text-foreground"
        >
          <CardContent className="p-5 space-y-2">
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {item.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default CardGrid
