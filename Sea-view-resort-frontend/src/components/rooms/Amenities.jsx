import { Card, CardContent } from "../ui/Card";

export default function Amenities({ items = [] }) {
  if (!items || items.length === 0) return null;
  return (
    <Card>
      <CardContent className="p-8">
        <h3 className="text-2xl font-semibold text-gray-900 mb-6">
          Amenidades
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {items.map((amenity, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
            >
              <amenity.icon className="h-8 w-8 text-resort-olive group-hover:text-resort-olive/80 transition-colors" />
              <span className="text-sm font-medium text-gray-900">
                {amenity.label}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
