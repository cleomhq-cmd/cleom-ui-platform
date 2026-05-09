import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

interface PagePlaceholderProps {
  title: string;
  description: string;
  /** Lo que falta migrar / conectar (mostrado en una lista). */
  todos?: string[];
  /** Origen en cleom-Merge para referencia rápida del migrador. */
  sourceFile?: string;
}

/**
 * Placeholder de página dentro del AppShell. Se usa para todas las rutas del
 * dashboard que aún no fueron migradas en detalle desde cleom-Merge — preserva
 * la navegación end-to-end y deja TODOs accionables visibles.
 */
export function PagePlaceholder({
  title,
  description,
  todos = [],
  sourceFile,
}: PagePlaceholderProps) {
  return (
    <div className="container py-8 md:py-12 max-w-3xl">
      <div className="space-y-6">
        <div className="flex items-start gap-3">
          <div className="rounded-full bg-primary/10 p-2 text-primary">
            <Sparkles className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h1 className="font-display text-2xl md:text-3xl font-semibold">
              {title}
            </h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>

        {(todos.length > 0 || sourceFile) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Pendiente de migrar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {todos.length > 0 && (
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  {todos.map((todo) => (
                    <li key={todo}>{todo}</li>
                  ))}
                </ul>
              )}
              {sourceFile && (
                <div className="pt-2 border-t border-border/50 text-xs text-muted-foreground">
                  <span className="font-medium">Origen:</span>{" "}
                  <code className="text-foreground">{sourceFile}</code>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
