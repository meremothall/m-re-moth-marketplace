CREATE TABLE public.bus_agencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo_url text,
  phone text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.bus_agencies TO anon, authenticated;
GRANT ALL ON public.bus_agencies TO service_role;
ALTER TABLE public.bus_agencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active agencies" ON public.bus_agencies FOR SELECT USING (true);

CREATE TABLE public.agency_branches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL REFERENCES public.bus_agencies(id) ON DELETE CASCADE,
  city text NOT NULL,
  quarter text,
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX agency_branches_city_idx ON public.agency_branches (city);
GRANT SELECT ON public.agency_branches TO anon, authenticated;
GRANT ALL ON public.agency_branches TO service_role;
ALTER TABLE public.agency_branches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view branches" ON public.agency_branches FOR SELECT USING (true);

CREATE TYPE public.shipment_status AS ENUM (
  'pending_at_seller','received_by_agency','in_transit','arrived_at_destination','claimed_by_buyer','confirmed_by_buyer'
);

CREATE TABLE public.shipments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid,
  buyer_id uuid NOT NULL,
  seller_id uuid,
  agency_id uuid REFERENCES public.bus_agencies(id) ON DELETE SET NULL,
  branch_from uuid REFERENCES public.agency_branches(id) ON DELETE SET NULL,
  branch_to uuid REFERENCES public.agency_branches(id) ON DELETE SET NULL,
  item_title text,
  amount numeric(12,2) NOT NULL DEFAULT 0,
  status public.shipment_status NOT NULL DEFAULT 'pending_at_seller',
  vehicle_plate text,
  driver_phone text,
  receipt_code varchar(6) NOT NULL UNIQUE,
  escrow_held boolean NOT NULL DEFAULT true,
  claimed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX shipments_buyer_idx ON public.shipments (buyer_id);
CREATE INDEX shipments_seller_idx ON public.shipments (seller_id);
CREATE INDEX shipments_status_idx ON public.shipments (status);
GRANT SELECT, INSERT, UPDATE ON public.shipments TO authenticated;
GRANT ALL ON public.shipments TO service_role;
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parties can view their shipments" ON public.shipments FOR SELECT TO authenticated
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);
CREATE POLICY "Buyers can create their shipments" ON public.shipments FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = buyer_id);
CREATE POLICY "Buyers can update their shipments" ON public.shipments FOR UPDATE TO authenticated
  USING (auth.uid() = buyer_id) WITH CHECK (auth.uid() = buyer_id);

CREATE TABLE public.wallets (
  user_id uuid PRIMARY KEY,
  balance numeric(14,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'XAF',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.wallets TO authenticated;
GRANT ALL ON public.wallets TO service_role;
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own wallet" ON public.wallets FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE TYPE public.wallet_tx_type AS ENUM ('topup','payment','refund','commission','payout');
CREATE TYPE public.wallet_tx_status AS ENUM ('success','pending','failed');

CREATE TABLE public.wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  type public.wallet_tx_type NOT NULL,
  amount numeric(14,2) NOT NULL,
  status public.wallet_tx_status NOT NULL DEFAULT 'pending',
  cinetpay_transaction_id text UNIQUE,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX wallet_tx_user_idx ON public.wallet_transactions (user_id, created_at DESC);
GRANT SELECT ON public.wallet_transactions TO authenticated;
GRANT ALL ON public.wallet_transactions TO service_role;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.wallet_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);