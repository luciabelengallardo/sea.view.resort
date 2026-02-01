import { Card, CardContent } from '../ui/Card';

/**
 * Lista de características de la habitación.
 *
 * Solo renderiza la lista de características.
 *
 * @component
 * @param {Object} props - Propiedades del componente.
 * @param {string[]} props.features - Características a mostrar.
 * @returns {JSX.Element|null}
 */
export default function Features({ features = [] }) {
    if (!features || features.length === 0) return null;
    return (
        <Card className="mb-8">
            <CardContent className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">Características de la habitación</h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="w-2 h-2 bg-resort-olive rounded-full flex-shrink-0" />
                            <span className="text-resort-slate">{feature}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}


