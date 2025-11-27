-- Create guests table
CREATE TABLE public.hospedes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  documento TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create rooms table
CREATE TABLE public.quartos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT NOT NULL UNIQUE,
  tipo TEXT NOT NULL,
  preco_diaria DECIMAL(10,2) NOT NULL,
  capacidade INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'disponivel',
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reservations table
CREATE TABLE public.reservas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hospede_id UUID NOT NULL REFERENCES public.hospedes(id) ON DELETE CASCADE,
  quarto_id UUID NOT NULL REFERENCES public.quartos(id) ON DELETE CASCADE,
  data_checkin DATE NOT NULL,
  data_checkout DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmada',
  valor_total DECIMAL(10,2) NOT NULL,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payments table
CREATE TABLE public.pagamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reserva_id UUID NOT NULL REFERENCES public.reservas(id) ON DELETE CASCADE,
  valor DECIMAL(10,2) NOT NULL,
  metodo TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  data_pagamento TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.hospedes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quartos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos ENABLE ROW LEVEL SECURITY;

-- Create policies for hospedes (allow all operations for authenticated users)
CREATE POLICY "Allow all operations for authenticated users on hospedes"
ON public.hospedes FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create policies for quartos (allow all operations for authenticated users)
CREATE POLICY "Allow all operations for authenticated users on quartos"
ON public.quartos FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create policies for reservas (allow all operations for authenticated users)
CREATE POLICY "Allow all operations for authenticated users on reservas"
ON public.reservas FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Create policies for pagamentos (allow all operations for authenticated users)
CREATE POLICY "Allow all operations for authenticated users on pagamentos"
ON public.pagamentos FOR ALL
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- Insert sample rooms
INSERT INTO public.quartos (numero, tipo, preco_diaria, capacidade, status, descricao) VALUES
('101', 'Standard', 250.00, 2, 'disponivel', 'Quarto confortável com cama de casal'),
('102', 'Standard', 250.00, 2, 'ocupado', 'Quarto confortável com cama de casal'),
('201', 'Deluxe', 450.00, 3, 'disponivel', 'Quarto espaçoso com vista para o mar'),
('202', 'Deluxe', 450.00, 3, 'manutencao', 'Quarto espaçoso com varanda'),
('301', 'Suite', 800.00, 4, 'disponivel', 'Suíte luxuosa com jacuzzi'),
('302', 'Suite', 800.00, 4, 'disponivel', 'Suíte presidencial com sala de estar');