import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit } from "lucide-react";
import { useState } from "react";
import { Pagamento, usePagamentos } from "@/hooks/usePagamentos";

type EditPagamentosDialogProps = {
    pagamento: Pagamento;
};
export const EditPagamentosDialog = ({ pagamento }: EditPagamentosDialogProps) => {
    const { updatePagamento } = usePagamentos();
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        reserva_id: pagamento.reserva_id,
        valor: pagamento.valor.toString(),
        metodo: pagamento.metodo,
        status: pagamento.status,
        data_pagamento: pagamento.data_pagamento,
    });
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updatePagamento.mutateAsync({
            id: pagamento.id,
            reserva_id: formData.reserva_id,
            valor: parseFloat(formData.valor),
            metodo: formData.metodo,
            status: formData.status,
            data_pagamento: formData.data_pagamento,
        });
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="icon" variant="outline">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Editar Pagamento</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="valor">Valor</Label>
                        <Input
                            id="valor"
                            type="number"
                            value={formData.valor}
                            onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="metodo">Método de Pagamento</Label>
                        <Input
                            id="metodo"
                            value={formData.metodo}
                            onChange={(e) => setFormData({ ...formData, metodo: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="data_pagamento">Data do Pagamento</Label>
                        <Input
                            id="data_pagamento"
                            type="date"
                            value={formData.data_pagamento}
                            onChange={(e) => setFormData({ ...formData, data_pagamento: e.target.value })}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => setFormData({ ...formData, status: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pendente">Pendente</SelectItem>
                                <SelectItem value="pago">Pago</SelectItem>
                                <SelectItem value="cancelado">Cancelado</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <Button type="submit" className="mt-4">
                        Salvar Alterações
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};