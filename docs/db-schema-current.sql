--
-- PostgreSQL database dump
--

\restrict 107c3dYePim5h6bGs1ecBoQmt4DJ0Mrj5YdzU0orPqDfaEddPas9FNIqJD4j4Xf

-- Dumped from database version 17.10
-- Dumped by pg_dump version 18.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: set_updated_at(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.set_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.set_updated_at() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    action character varying(100) NOT NULL,
    entity_type character varying(100) NOT NULL,
    entity_id uuid NOT NULL,
    business_id uuid NOT NULL,
    staff_id uuid NOT NULL,
    metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: businesses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.businesses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.businesses OWNER TO postgres;

--
-- Name: goods_received_note_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.goods_received_note_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    goods_received_note_id uuid NOT NULL,
    product_id uuid NOT NULL,
    uom_id uuid NOT NULL,
    received_quantity numeric(14,3) NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT goods_received_note_items_received_quantity_check CHECK ((received_quantity > (0)::numeric))
);


ALTER TABLE public.goods_received_note_items OWNER TO postgres;

--
-- Name: goods_received_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.goods_received_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    purchase_order_id uuid NOT NULL,
    storage_location_id uuid NOT NULL,
    grn_number character varying(100) NOT NULL,
    received_date date NOT NULL,
    notes text,
    total_received_quantity numeric(14,3) DEFAULT 0 NOT NULL,
    status character varying(20) DEFAULT 'DRAFT'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    CONSTRAINT goods_received_notes_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'POSTED'::character varying, 'CANCELLED'::character varying])::text[]))),
    CONSTRAINT goods_received_notes_total_received_quantity_check CHECK ((total_received_quantity >= (0)::numeric))
);


ALTER TABLE public.goods_received_notes OWNER TO postgres;

--
-- Name: inventory_adjustment_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_adjustment_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    inventory_adjustment_id uuid NOT NULL,
    inventory_batch_id uuid,
    product_id uuid NOT NULL,
    uom_id uuid NOT NULL,
    storage_location_id uuid NOT NULL,
    adjustment_type character varying(10) NOT NULL,
    quantity numeric(14,3) NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT inventory_adjustment_items_adjustment_type_check CHECK (((adjustment_type)::text = ANY ((ARRAY['IN'::character varying, 'OUT'::character varying])::text[]))),
    CONSTRAINT inventory_adjustment_items_quantity_check CHECK ((quantity > (0)::numeric))
);


ALTER TABLE public.inventory_adjustment_items OWNER TO postgres;

--
-- Name: inventory_adjustments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_adjustments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    adjustment_number character varying(100) NOT NULL,
    adjustment_date date NOT NULL,
    reason character varying(150) NOT NULL,
    notes text,
    total_adjusted_quantity numeric(14,3) DEFAULT 0 NOT NULL,
    status character varying(20) DEFAULT 'DRAFT'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    CONSTRAINT inventory_adjustments_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'POSTED'::character varying, 'CANCELLED'::character varying])::text[]))),
    CONSTRAINT inventory_adjustments_total_adjusted_quantity_check CHECK ((total_adjusted_quantity >= (0)::numeric))
);


ALTER TABLE public.inventory_adjustments OWNER TO postgres;

--
-- Name: inventory_batches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_batches (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    goods_received_note_id uuid NOT NULL,
    goods_received_note_item_id uuid NOT NULL,
    product_id uuid NOT NULL,
    uom_id uuid NOT NULL,
    storage_location_id uuid NOT NULL,
    batch_number character varying(100),
    expiry_date date,
    received_quantity numeric(14,3) NOT NULL,
    available_quantity numeric(14,3) NOT NULL,
    notes text,
    status character varying(20) DEFAULT 'AVAILABLE'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    CONSTRAINT inventory_batches_available_quantity_check CHECK ((available_quantity >= (0)::numeric)),
    CONSTRAINT inventory_batches_available_vs_received_check CHECK ((available_quantity <= received_quantity)),
    CONSTRAINT inventory_batches_received_quantity_check CHECK ((received_quantity > (0)::numeric)),
    CONSTRAINT inventory_batches_status_check CHECK (((status)::text = ANY ((ARRAY['AVAILABLE'::character varying, 'HOLD'::character varying, 'DEPLETED'::character varying, 'EXPIRED'::character varying, 'DAMAGED'::character varying])::text[])))
);


ALTER TABLE public.inventory_batches OWNER TO postgres;

--
-- Name: inventory_write_off_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_write_off_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    inventory_write_off_id uuid NOT NULL,
    inventory_batch_id uuid NOT NULL,
    product_id uuid NOT NULL,
    product_description text,
    product_barcode character varying(100),
    uom_id uuid NOT NULL,
    storage_location_id uuid NOT NULL,
    quantity numeric(14,3) NOT NULL,
    unit_cost numeric(14,2) DEFAULT 0 NOT NULL,
    total_cost numeric(14,2) DEFAULT 0 NOT NULL,
    write_off_code character varying(50) NOT NULL,
    notes text,
    remark text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT inventory_write_off_items_quantity_check CHECK ((quantity > (0)::numeric)),
    CONSTRAINT inventory_write_off_items_total_cost_check CHECK ((total_cost >= (0)::numeric)),
    CONSTRAINT inventory_write_off_items_unit_cost_check CHECK ((unit_cost >= (0)::numeric))
);


ALTER TABLE public.inventory_write_off_items OWNER TO postgres;

--
-- Name: inventory_write_offs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_write_offs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    write_off_number character varying(100) NOT NULL,
    write_off_date date NOT NULL,
    reason character varying(150) NOT NULL,
    notes text,
    total_quantity numeric(14,3) DEFAULT 0 NOT NULL,
    total_cost numeric(14,2) DEFAULT 0 NOT NULL,
    status character varying(20) DEFAULT 'DRAFT'::character varying NOT NULL,
    remark text,
    management_comment text,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT inventory_write_offs_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'POSTED'::character varying, 'CANCELLED'::character varying])::text[]))),
    CONSTRAINT inventory_write_offs_total_cost_check CHECK ((total_cost >= (0)::numeric)),
    CONSTRAINT inventory_write_offs_total_quantity_check CHECK ((total_quantity >= (0)::numeric))
);


ALTER TABLE public.inventory_write_offs OWNER TO postgres;

--
-- Name: product_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_categories (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    parent_id uuid,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL
);


ALTER TABLE public.product_categories OWNER TO postgres;

--
-- Name: product_uom_conversions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_uom_conversions (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    product_id uuid NOT NULL,
    from_uom_id uuid NOT NULL,
    to_uom_id uuid NOT NULL,
    multiplier double precision NOT NULL,
    description text,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    CONSTRAINT product_uom_conversions_multiplier_check CHECK ((multiplier > (0)::double precision)),
    CONSTRAINT product_uom_conversions_same_uom_check CHECK ((from_uom_id <> to_uom_id)),
    CONSTRAINT product_uom_conversions_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);


ALTER TABLE public.product_uom_conversions OWNER TO postgres;

--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    sku character varying(100) NOT NULL,
    name character varying(200) NOT NULL,
    barcode character varying(100),
    category_id uuid,
    preferred_supplier_id uuid,
    base_uom_id uuid NOT NULL,
    default_storage_location_id uuid,
    description text,
    track_inventory boolean DEFAULT true NOT NULL,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    CONSTRAINT products_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: purchase_order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_order_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    purchase_order_id uuid NOT NULL,
    product_id uuid NOT NULL,
    uom_id uuid NOT NULL,
    quantity numeric(14,3) NOT NULL,
    unit_price numeric(14,2) NOT NULL,
    line_total numeric(14,2) NOT NULL,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT purchase_order_items_line_total_check CHECK ((line_total >= (0)::numeric)),
    CONSTRAINT purchase_order_items_quantity_check CHECK ((quantity > (0)::numeric)),
    CONSTRAINT purchase_order_items_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.purchase_order_items OWNER TO postgres;

--
-- Name: purchase_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_orders (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    supplier_id uuid NOT NULL,
    order_number character varying(100) NOT NULL,
    order_date date NOT NULL,
    expected_delivery_date date,
    notes text,
    subtotal numeric(14,2) DEFAULT 0 NOT NULL,
    status character varying(20) DEFAULT 'DRAFT'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    CONSTRAINT purchase_orders_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'APPROVED'::character varying, 'CANCELLED'::character varying, 'CLOSED'::character varying])::text[]))),
    CONSTRAINT purchase_orders_subtotal_check CHECK ((subtotal >= (0)::numeric))
);


ALTER TABLE public.purchase_orders OWNER TO postgres;

--
-- Name: return_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    return_id uuid NOT NULL,
    inventory_batch_id uuid,
    product_id uuid NOT NULL,
    product_description text,
    product_barcode character varying(100),
    uom_id uuid NOT NULL,
    storage_location_id uuid NOT NULL,
    quantity numeric(14,3) NOT NULL,
    unit_cost numeric(14,2) DEFAULT 0 NOT NULL,
    total_cost numeric(14,2) DEFAULT 0 NOT NULL,
    notes text,
    remark text,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT return_items_quantity_check CHECK ((quantity > (0)::numeric)),
    CONSTRAINT return_items_total_cost_check CHECK ((total_cost >= (0)::numeric)),
    CONSTRAINT return_items_unit_cost_check CHECK ((unit_cost >= (0)::numeric))
);


ALTER TABLE public.return_items OWNER TO postgres;

--
-- Name: returns; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.returns (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    return_number character varying(100) NOT NULL,
    return_date date NOT NULL,
    processing_target character varying(20) NOT NULL,
    return_code character varying(50) NOT NULL,
    return_type character varying(20) DEFAULT 'RETURN'::character varying NOT NULL,
    reason character varying(150) NOT NULL,
    reference_number character varying(100),
    notes text,
    remark text,
    status character varying(20) DEFAULT 'DRAFT'::character varying NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    total_quantity numeric(14,3) DEFAULT 0 NOT NULL,
    total_cost numeric(14,2) DEFAULT 0 NOT NULL,
    CONSTRAINT returns_processing_target_check CHECK (((processing_target)::text = ANY ((ARRAY['SUPPLIER'::character varying, 'CUSTOMER'::character varying])::text[]))),
    CONSTRAINT returns_return_type_check CHECK (((return_type)::text = ANY ((ARRAY['RETURN'::character varying, 'EXCHANGE'::character varying])::text[]))),
    CONSTRAINT returns_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'POSTED'::character varying, 'CANCELLED'::character varying])::text[]))),
    CONSTRAINT returns_total_cost_check CHECK ((total_cost >= (0)::numeric)),
    CONSTRAINT returns_total_quantity_check CHECK ((total_quantity >= (0)::numeric))
);


ALTER TABLE public.returns OWNER TO postgres;

--
-- Name: staff; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.staff (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    full_name character varying(255) NOT NULL,
    email character varying(255),
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.staff OWNER TO postgres;

--
-- Name: stock_movements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_movements (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    inventory_batch_id uuid,
    product_id uuid NOT NULL,
    uom_id uuid NOT NULL,
    from_storage_location_id uuid,
    to_storage_location_id uuid,
    movement_type character varying(30) NOT NULL,
    reference_type character varying(50),
    reference_id uuid,
    quantity numeric(14,3) NOT NULL,
    unit_cost numeric(14,2) DEFAULT 0 NOT NULL,
    total_cost numeric(14,2) DEFAULT 0 NOT NULL,
    movement_date date NOT NULL,
    notes text,
    status character varying(20) DEFAULT 'DRAFT'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    CONSTRAINT stock_movements_quantity_check CHECK ((quantity > (0)::numeric)),
    CONSTRAINT stock_movements_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'POSTED'::character varying, 'CANCELLED'::character varying])::text[]))),
    CONSTRAINT stock_movements_total_cost_check CHECK ((total_cost >= (0)::numeric)),
    CONSTRAINT stock_movements_type_check CHECK (((movement_type)::text = ANY ((ARRAY['GRN_IN'::character varying, 'ADJUSTMENT_IN'::character varying, 'ADJUSTMENT_OUT'::character varying, 'TRANSFER_IN'::character varying, 'TRANSFER_OUT'::character varying, 'OPENING_BALANCE'::character varying])::text[]))),
    CONSTRAINT stock_movements_unit_cost_check CHECK ((unit_cost >= (0)::numeric))
);


ALTER TABLE public.stock_movements OWNER TO postgres;

--
-- Name: storage_locations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.storage_locations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(150) NOT NULL,
    location_type character varying(30) DEFAULT 'WAREHOUSE'::character varying NOT NULL,
    parent_id uuid,
    description text,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    CONSTRAINT storage_locations_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[]))),
    CONSTRAINT storage_locations_type_check CHECK (((location_type)::text = ANY ((ARRAY['WAREHOUSE'::character varying, 'ZONE'::character varying, 'AISLE'::character varying, 'RACK'::character varying, 'BIN'::character varying, 'SHELF'::character varying, 'STAGING'::character varying, 'RETURN'::character varying])::text[])))
);


ALTER TABLE public.storage_locations OWNER TO postgres;

--
-- Name: supplier_credit_note_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_credit_note_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_credit_note_id uuid NOT NULL,
    supplier_invoice_item_id uuid,
    product_id uuid NOT NULL,
    product_description text,
    product_barcode character varying(100),
    uom_id uuid NOT NULL,
    quantity numeric(14,3) NOT NULL,
    unit_credit numeric(14,2) DEFAULT 0 NOT NULL,
    line_total numeric(14,2) DEFAULT 0 NOT NULL,
    reason character varying(150),
    notes text,
    remark text,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT supplier_credit_note_items_line_total_check CHECK ((line_total >= (0)::numeric)),
    CONSTRAINT supplier_credit_note_items_quantity_check CHECK ((quantity > (0)::numeric)),
    CONSTRAINT supplier_credit_note_items_unit_credit_check CHECK ((unit_credit >= (0)::numeric))
);


ALTER TABLE public.supplier_credit_note_items OWNER TO postgres;

--
-- Name: supplier_credit_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_credit_notes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    supplier_id uuid NOT NULL,
    supplier_invoice_id uuid,
    supplier_return_reference_number character varying(100),
    credit_note_number character varying(100) NOT NULL,
    credit_note_date date NOT NULL,
    subtotal numeric(14,2) DEFAULT 0 NOT NULL,
    total_credit numeric(14,2) DEFAULT 0 NOT NULL,
    reason character varying(150) NOT NULL,
    status character varying(20) DEFAULT 'DRAFT'::character varying NOT NULL,
    notes text,
    remark text,
    received_by uuid,
    processed_by uuid,
    approved_by uuid,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT supplier_credit_notes_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'RECEIVED'::character varying, 'UNDER_REVIEW'::character varying, 'APPROVED'::character varying, 'POSTED'::character varying, 'CANCELLED'::character varying])::text[]))),
    CONSTRAINT supplier_credit_notes_subtotal_check CHECK ((subtotal >= (0)::numeric)),
    CONSTRAINT supplier_credit_notes_total_credit_check CHECK ((total_credit >= (0)::numeric))
);


ALTER TABLE public.supplier_credit_notes OWNER TO postgres;

--
-- Name: supplier_invoice_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_invoice_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_invoice_id uuid NOT NULL,
    purchase_order_item_id uuid,
    goods_received_note_item_id uuid,
    product_id uuid NOT NULL,
    product_description text,
    product_barcode character varying(100),
    uom_id uuid NOT NULL,
    quantity numeric(14,3) NOT NULL,
    unit_price numeric(14,2) DEFAULT 0 NOT NULL,
    line_total numeric(14,2) DEFAULT 0 NOT NULL,
    tax_amount numeric(14,2) DEFAULT 0 NOT NULL,
    total numeric(14,2) DEFAULT 0 NOT NULL,
    notes text,
    remark text,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT supplier_invoice_items_line_total_check CHECK ((line_total >= (0)::numeric)),
    CONSTRAINT supplier_invoice_items_quantity_check CHECK ((quantity > (0)::numeric)),
    CONSTRAINT supplier_invoice_items_tax_amount_check CHECK ((tax_amount >= (0)::numeric)),
    CONSTRAINT supplier_invoice_items_total_check CHECK ((total >= (0)::numeric)),
    CONSTRAINT supplier_invoice_items_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.supplier_invoice_items OWNER TO postgres;

--
-- Name: supplier_invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_invoices (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    supplier_id uuid NOT NULL,
    purchase_order_id uuid,
    goods_received_note_id uuid,
    invoice_number character varying(100) NOT NULL,
    invoice_date date NOT NULL,
    due_date date,
    subtotal numeric(14,2) DEFAULT 0 NOT NULL,
    tax_amount numeric(14,2) DEFAULT 0 NOT NULL,
    total numeric(14,2) DEFAULT 0 NOT NULL,
    status character varying(20) DEFAULT 'DRAFT'::character varying NOT NULL,
    notes text,
    remark text,
    received_by uuid,
    processed_by uuid,
    approved_by uuid,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT supplier_invoices_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'RECEIVED'::character varying, 'UNDER_REVIEW'::character varying, 'APPROVED'::character varying, 'POSTED'::character varying, 'CANCELLED'::character varying])::text[]))),
    CONSTRAINT supplier_invoices_subtotal_check CHECK ((subtotal >= (0)::numeric)),
    CONSTRAINT supplier_invoices_tax_amount_check CHECK ((tax_amount >= (0)::numeric)),
    CONSTRAINT supplier_invoices_total_check CHECK ((total >= (0)::numeric))
);


ALTER TABLE public.supplier_invoices OWNER TO postgres;

--
-- Name: supplier_quotation_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_quotation_items (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    supplier_quotation_id uuid NOT NULL,
    product_id uuid NOT NULL,
    product_description text,
    product_barcode character varying(100),
    uom_id uuid NOT NULL,
    quantity numeric(14,3) NOT NULL,
    unit_price numeric(14,2) NOT NULL,
    line_total numeric(14,2) NOT NULL,
    notes text,
    remark text,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT supplier_quotation_items_line_total_check CHECK ((line_total >= (0)::numeric)),
    CONSTRAINT supplier_quotation_items_quantity_check CHECK ((quantity > (0)::numeric)),
    CONSTRAINT supplier_quotation_items_unit_price_check CHECK ((unit_price >= (0)::numeric))
);


ALTER TABLE public.supplier_quotation_items OWNER TO postgres;

--
-- Name: supplier_quotations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_quotations (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    supplier_id uuid NOT NULL,
    quote_number character varying(100) NOT NULL,
    quote_date date NOT NULL,
    validity_date date,
    subtotal numeric(14,2) DEFAULT 0 NOT NULL,
    total numeric(14,2) DEFAULT 0 NOT NULL,
    status character varying(20) DEFAULT 'DRAFT'::character varying NOT NULL,
    notes text,
    remark text,
    reviewed_by uuid,
    approved_by uuid,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT supplier_quotations_status_check CHECK (((status)::text = ANY ((ARRAY['DRAFT'::character varying, 'REVIEWED'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying, 'EXPIRED'::character varying, 'CANCELLED'::character varying])::text[]))),
    CONSTRAINT supplier_quotations_subtotal_check CHECK ((subtotal >= (0)::numeric)),
    CONSTRAINT supplier_quotations_total_check CHECK ((total >= (0)::numeric))
);


ALTER TABLE public.supplier_quotations OWNER TO postgres;

--
-- Name: supplier_return_policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_return_policies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    supplier_id uuid NOT NULL,
    policy_name character varying(150) NOT NULL,
    return_window_days integer DEFAULT 0 NOT NULL,
    restocking_fee_percent numeric(5,2) DEFAULT 0 NOT NULL,
    requires_approval boolean DEFAULT false NOT NULL,
    notes text,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    CONSTRAINT supplier_return_policies_fee_check CHECK (((restocking_fee_percent >= (0)::numeric) AND (restocking_fee_percent <= (100)::numeric))),
    CONSTRAINT supplier_return_policies_return_window_check CHECK ((return_window_days >= 0)),
    CONSTRAINT supplier_return_policies_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);


ALTER TABLE public.supplier_return_policies OWNER TO postgres;

--
-- Name: suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.suppliers (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    tenant_id uuid NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(150) NOT NULL,
    contact_person character varying(150),
    email character varying(150),
    phone character varying(50),
    address text,
    tax_id character varying(100),
    notes text,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT suppliers_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);


ALTER TABLE public.suppliers OWNER TO postgres;

--
-- Name: uom; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.uom (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    business_id uuid NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(100) NOT NULL,
    symbol character varying(20),
    description text,
    status character varying(20) DEFAULT 'ACTIVE'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    created_by uuid NOT NULL,
    updated_by uuid NOT NULL,
    CONSTRAINT uom_status_check CHECK (((status)::text = ANY ((ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying])::text[])))
);


ALTER TABLE public.uom OWNER TO postgres;

--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: businesses businesses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.businesses
    ADD CONSTRAINT businesses_pkey PRIMARY KEY (id);


--
-- Name: goods_received_note_items goods_received_note_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_received_note_items
    ADD CONSTRAINT goods_received_note_items_pkey PRIMARY KEY (id);


--
-- Name: goods_received_notes goods_received_notes_business_grn_number_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_received_notes
    ADD CONSTRAINT goods_received_notes_business_grn_number_unique UNIQUE (business_id, grn_number);


--
-- Name: goods_received_notes goods_received_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_received_notes
    ADD CONSTRAINT goods_received_notes_pkey PRIMARY KEY (id);


--
-- Name: inventory_adjustment_items inventory_adjustment_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustment_items
    ADD CONSTRAINT inventory_adjustment_items_pkey PRIMARY KEY (id);


--
-- Name: inventory_adjustments inventory_adjustments_business_adjustment_number_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_business_adjustment_number_unique UNIQUE (business_id, adjustment_number);


--
-- Name: inventory_adjustments inventory_adjustments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_pkey PRIMARY KEY (id);


--
-- Name: inventory_batches inventory_batches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_batches
    ADD CONSTRAINT inventory_batches_pkey PRIMARY KEY (id);


--
-- Name: inventory_batches inventory_batches_unique_grn_item; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_batches
    ADD CONSTRAINT inventory_batches_unique_grn_item UNIQUE (business_id, goods_received_note_item_id);


--
-- Name: inventory_write_off_items inventory_write_off_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_write_off_items
    ADD CONSTRAINT inventory_write_off_items_pkey PRIMARY KEY (id);


--
-- Name: inventory_write_offs inventory_write_offs_business_number_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_write_offs
    ADD CONSTRAINT inventory_write_offs_business_number_unique UNIQUE (business_id, write_off_number);


--
-- Name: inventory_write_offs inventory_write_offs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_write_offs
    ADD CONSTRAINT inventory_write_offs_pkey PRIMARY KEY (id);


--
-- Name: product_categories product_categories_business_id_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_business_id_name_key UNIQUE (business_id, name);


--
-- Name: product_categories product_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_pkey PRIMARY KEY (id);


--
-- Name: product_uom_conversions product_uom_conversions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_uom_conversions
    ADD CONSTRAINT product_uom_conversions_pkey PRIMARY KEY (id);


--
-- Name: product_uom_conversions product_uom_conversions_unique_pair; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_uom_conversions
    ADD CONSTRAINT product_uom_conversions_unique_pair UNIQUE (business_id, product_id, from_uom_id, to_uom_id);


--
-- Name: products products_business_sku_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_business_sku_unique UNIQUE (business_id, sku);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: purchase_order_items purchase_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_pkey PRIMARY KEY (id);


--
-- Name: purchase_orders purchase_orders_business_order_number_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_business_order_number_unique UNIQUE (business_id, order_number);


--
-- Name: purchase_orders purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_pkey PRIMARY KEY (id);


--
-- Name: return_items return_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_pkey PRIMARY KEY (id);


--
-- Name: returns returns_business_number_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_business_number_unique UNIQUE (business_id, return_number);


--
-- Name: returns returns_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_pkey PRIMARY KEY (id);


--
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (id);


--
-- Name: stock_movements stock_movements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_pkey PRIMARY KEY (id);


--
-- Name: storage_locations storage_locations_business_code_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.storage_locations
    ADD CONSTRAINT storage_locations_business_code_unique UNIQUE (business_id, code);


--
-- Name: storage_locations storage_locations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.storage_locations
    ADD CONSTRAINT storage_locations_pkey PRIMARY KEY (id);


--
-- Name: supplier_credit_note_items supplier_credit_note_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_credit_note_items
    ADD CONSTRAINT supplier_credit_note_items_pkey PRIMARY KEY (id);


--
-- Name: supplier_credit_notes supplier_credit_notes_business_number_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_credit_notes
    ADD CONSTRAINT supplier_credit_notes_business_number_unique UNIQUE (business_id, credit_note_number);


--
-- Name: supplier_credit_notes supplier_credit_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_credit_notes
    ADD CONSTRAINT supplier_credit_notes_pkey PRIMARY KEY (id);


--
-- Name: supplier_invoice_items supplier_invoice_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoice_items
    ADD CONSTRAINT supplier_invoice_items_pkey PRIMARY KEY (id);


--
-- Name: supplier_invoices supplier_invoices_business_invoice_number_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoices
    ADD CONSTRAINT supplier_invoices_business_invoice_number_unique UNIQUE (business_id, invoice_number);


--
-- Name: supplier_invoices supplier_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoices
    ADD CONSTRAINT supplier_invoices_pkey PRIMARY KEY (id);


--
-- Name: supplier_quotation_items supplier_quotation_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_quotation_items
    ADD CONSTRAINT supplier_quotation_items_pkey PRIMARY KEY (id);


--
-- Name: supplier_quotations supplier_quotations_business_quote_number_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_quotations
    ADD CONSTRAINT supplier_quotations_business_quote_number_unique UNIQUE (business_id, quote_number);


--
-- Name: supplier_quotations supplier_quotations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_quotations
    ADD CONSTRAINT supplier_quotations_pkey PRIMARY KEY (id);


--
-- Name: supplier_return_policies supplier_return_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_return_policies
    ADD CONSTRAINT supplier_return_policies_pkey PRIMARY KEY (id);


--
-- Name: supplier_return_policies supplier_return_policies_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_return_policies
    ADD CONSTRAINT supplier_return_policies_unique UNIQUE (business_id, supplier_id, policy_name);


--
-- Name: suppliers suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_pkey PRIMARY KEY (id);


--
-- Name: suppliers suppliers_tenant_code_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.suppliers
    ADD CONSTRAINT suppliers_tenant_code_unique UNIQUE (tenant_id, code);


--
-- Name: uom uom_business_code_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uom
    ADD CONSTRAINT uom_business_code_unique UNIQUE (business_id, code);


--
-- Name: uom uom_business_name_unique; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uom
    ADD CONSTRAINT uom_business_name_unique UNIQUE (business_id, name);


--
-- Name: uom uom_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uom
    ADD CONSTRAINT uom_pkey PRIMARY KEY (id);


--
-- Name: idx_audit_logs_business_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_business_id ON public.audit_logs USING btree (business_id);


--
-- Name: idx_audit_logs_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_created_at ON public.audit_logs USING btree (created_at);


--
-- Name: idx_audit_logs_entity_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_entity_id ON public.audit_logs USING btree (entity_id);


--
-- Name: idx_audit_logs_entity_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_entity_type ON public.audit_logs USING btree (entity_type);


--
-- Name: idx_goods_received_note_items_grn_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_goods_received_note_items_grn_id ON public.goods_received_note_items USING btree (goods_received_note_id);


--
-- Name: idx_goods_received_note_items_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_goods_received_note_items_product_id ON public.goods_received_note_items USING btree (product_id);


--
-- Name: idx_goods_received_note_items_uom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_goods_received_note_items_uom_id ON public.goods_received_note_items USING btree (uom_id);


--
-- Name: idx_goods_received_notes_business_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_goods_received_notes_business_id ON public.goods_received_notes USING btree (business_id);


--
-- Name: idx_goods_received_notes_grn_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_goods_received_notes_grn_number ON public.goods_received_notes USING btree (grn_number);


--
-- Name: idx_goods_received_notes_purchase_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_goods_received_notes_purchase_order_id ON public.goods_received_notes USING btree (purchase_order_id);


--
-- Name: idx_goods_received_notes_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_goods_received_notes_status ON public.goods_received_notes USING btree (status);


--
-- Name: idx_goods_received_notes_storage_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_goods_received_notes_storage_location_id ON public.goods_received_notes USING btree (storage_location_id);


--
-- Name: idx_inventory_adjustment_items_adjustment_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_adjustment_items_adjustment_id ON public.inventory_adjustment_items USING btree (inventory_adjustment_id);


--
-- Name: idx_inventory_adjustment_items_adjustment_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_adjustment_items_adjustment_type ON public.inventory_adjustment_items USING btree (adjustment_type);


--
-- Name: idx_inventory_adjustment_items_inventory_batch_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_adjustment_items_inventory_batch_id ON public.inventory_adjustment_items USING btree (inventory_batch_id);


--
-- Name: idx_inventory_adjustment_items_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_adjustment_items_product_id ON public.inventory_adjustment_items USING btree (product_id);


--
-- Name: idx_inventory_adjustment_items_storage_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_adjustment_items_storage_location_id ON public.inventory_adjustment_items USING btree (storage_location_id);


--
-- Name: idx_inventory_adjustment_items_uom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_adjustment_items_uom_id ON public.inventory_adjustment_items USING btree (uom_id);


--
-- Name: idx_inventory_adjustments_adjustment_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_adjustments_adjustment_date ON public.inventory_adjustments USING btree (adjustment_date);


--
-- Name: idx_inventory_adjustments_adjustment_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_adjustments_adjustment_number ON public.inventory_adjustments USING btree (adjustment_number);


--
-- Name: idx_inventory_adjustments_business_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_adjustments_business_id ON public.inventory_adjustments USING btree (business_id);


--
-- Name: idx_inventory_adjustments_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_adjustments_status ON public.inventory_adjustments USING btree (status);


--
-- Name: idx_inventory_batches_batch_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_batches_batch_number ON public.inventory_batches USING btree (batch_number);


--
-- Name: idx_inventory_batches_business_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_batches_business_id ON public.inventory_batches USING btree (business_id);


--
-- Name: idx_inventory_batches_expiry_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_batches_expiry_date ON public.inventory_batches USING btree (expiry_date);


--
-- Name: idx_inventory_batches_grn_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_batches_grn_id ON public.inventory_batches USING btree (goods_received_note_id);


--
-- Name: idx_inventory_batches_grn_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_batches_grn_item_id ON public.inventory_batches USING btree (goods_received_note_item_id);


--
-- Name: idx_inventory_batches_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_batches_product_id ON public.inventory_batches USING btree (product_id);


--
-- Name: idx_inventory_batches_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_batches_status ON public.inventory_batches USING btree (status);


--
-- Name: idx_inventory_batches_storage_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_batches_storage_location_id ON public.inventory_batches USING btree (storage_location_id);


--
-- Name: idx_inventory_batches_uom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_batches_uom_id ON public.inventory_batches USING btree (uom_id);


--
-- Name: idx_inventory_write_off_items_batch_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_write_off_items_batch_id ON public.inventory_write_off_items USING btree (inventory_batch_id);


--
-- Name: idx_inventory_write_off_items_header_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_write_off_items_header_id ON public.inventory_write_off_items USING btree (inventory_write_off_id);


--
-- Name: idx_inventory_write_off_items_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_write_off_items_product_id ON public.inventory_write_off_items USING btree (product_id);


--
-- Name: idx_inventory_write_off_items_storage_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_write_off_items_storage_location_id ON public.inventory_write_off_items USING btree (storage_location_id);


--
-- Name: idx_inventory_write_off_items_uom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_write_off_items_uom_id ON public.inventory_write_off_items USING btree (uom_id);


--
-- Name: idx_inventory_write_off_items_write_off_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_write_off_items_write_off_code ON public.inventory_write_off_items USING btree (write_off_code);


--
-- Name: idx_inventory_write_offs_business_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_write_offs_business_id ON public.inventory_write_offs USING btree (business_id);


--
-- Name: idx_inventory_write_offs_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_write_offs_date ON public.inventory_write_offs USING btree (write_off_date);


--
-- Name: idx_inventory_write_offs_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_write_offs_number ON public.inventory_write_offs USING btree (write_off_number);


--
-- Name: idx_inventory_write_offs_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_inventory_write_offs_status ON public.inventory_write_offs USING btree (status);


--
-- Name: idx_product_categories_business_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_categories_business_id ON public.product_categories USING btree (business_id);


--
-- Name: idx_product_categories_parent_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_categories_parent_id ON public.product_categories USING btree (parent_id);


--
-- Name: idx_product_uom_conversions_business_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_uom_conversions_business_id ON public.product_uom_conversions USING btree (business_id);


--
-- Name: idx_product_uom_conversions_from_uom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_uom_conversions_from_uom_id ON public.product_uom_conversions USING btree (from_uom_id);


--
-- Name: idx_product_uom_conversions_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_uom_conversions_product_id ON public.product_uom_conversions USING btree (product_id);


--
-- Name: idx_product_uom_conversions_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_uom_conversions_status ON public.product_uom_conversions USING btree (status);


--
-- Name: idx_product_uom_conversions_to_uom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_product_uom_conversions_to_uom_id ON public.product_uom_conversions USING btree (to_uom_id);


--
-- Name: idx_products_base_uom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_base_uom_id ON public.products USING btree (base_uom_id);


--
-- Name: idx_products_business_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_business_id ON public.products USING btree (business_id);


--
-- Name: idx_products_category_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_category_id ON public.products USING btree (category_id);


--
-- Name: idx_products_default_storage_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_default_storage_location_id ON public.products USING btree (default_storage_location_id);


--
-- Name: idx_products_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_name ON public.products USING btree (name);


--
-- Name: idx_products_sku; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_sku ON public.products USING btree (sku);


--
-- Name: idx_products_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_status ON public.products USING btree (status);


--
-- Name: idx_products_supplier_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_products_supplier_id ON public.products USING btree (preferred_supplier_id);


--
-- Name: idx_purchase_order_items_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_purchase_order_items_product_id ON public.purchase_order_items USING btree (product_id);


--
-- Name: idx_purchase_order_items_purchase_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_purchase_order_items_purchase_order_id ON public.purchase_order_items USING btree (purchase_order_id);


--
-- Name: idx_purchase_order_items_uom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_purchase_order_items_uom_id ON public.purchase_order_items USING btree (uom_id);


--
-- Name: idx_purchase_orders_business_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_purchase_orders_business_id ON public.purchase_orders USING btree (business_id);


--
-- Name: idx_purchase_orders_order_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_purchase_orders_order_number ON public.purchase_orders USING btree (order_number);


--
-- Name: idx_purchase_orders_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_purchase_orders_status ON public.purchase_orders USING btree (status);


--
-- Name: idx_purchase_orders_supplier_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_purchase_orders_supplier_id ON public.purchase_orders USING btree (supplier_id);


--
-- Name: idx_return_items_batch_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_return_items_batch_id ON public.return_items USING btree (inventory_batch_id);


--
-- Name: idx_return_items_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_return_items_product_id ON public.return_items USING btree (product_id);


--
-- Name: idx_return_items_return_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_return_items_return_id ON public.return_items USING btree (return_id);


--
-- Name: idx_return_items_storage_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_return_items_storage_location_id ON public.return_items USING btree (storage_location_id);


--
-- Name: idx_return_items_uom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_return_items_uom_id ON public.return_items USING btree (uom_id);


--
-- Name: idx_returns_business_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_returns_business_id ON public.returns USING btree (business_id);


--
-- Name: idx_returns_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_returns_date ON public.returns USING btree (return_date);


--
-- Name: idx_returns_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_returns_number ON public.returns USING btree (return_number);


--
-- Name: idx_returns_processing_target; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_returns_processing_target ON public.returns USING btree (processing_target);


--
-- Name: idx_returns_return_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_returns_return_code ON public.returns USING btree (return_code);


--
-- Name: idx_returns_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_returns_status ON public.returns USING btree (status);


--
-- Name: idx_staff_business_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_staff_business_id ON public.staff USING btree (business_id);


--
-- Name: idx_stock_movements_business_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_business_id ON public.stock_movements USING btree (business_id);


--
-- Name: idx_stock_movements_from_storage_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_from_storage_location_id ON public.stock_movements USING btree (from_storage_location_id);


--
-- Name: idx_stock_movements_inventory_batch_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_inventory_batch_id ON public.stock_movements USING btree (inventory_batch_id);


--
-- Name: idx_stock_movements_movement_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_movement_date ON public.stock_movements USING btree (movement_date);


--
-- Name: idx_stock_movements_movement_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_movement_type ON public.stock_movements USING btree (movement_type);


--
-- Name: idx_stock_movements_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_product_id ON public.stock_movements USING btree (product_id);


--
-- Name: idx_stock_movements_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_status ON public.stock_movements USING btree (status);


--
-- Name: idx_stock_movements_to_storage_location_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_to_storage_location_id ON public.stock_movements USING btree (to_storage_location_id);


--
-- Name: idx_stock_movements_uom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_stock_movements_uom_id ON public.stock_movements USING btree (uom_id);


--
-- Name: idx_storage_locations_business_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_storage_locations_business_id ON public.storage_locations USING btree (business_id);


--
-- Name: idx_storage_locations_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_storage_locations_code ON public.storage_locations USING btree (code);


--
-- Name: idx_storage_locations_parent_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_storage_locations_parent_id ON public.storage_locations USING btree (parent_id);


--
-- Name: idx_storage_locations_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_storage_locations_status ON public.storage_locations USING btree (status);


--
-- Name: idx_storage_locations_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_storage_locations_type ON public.storage_locations USING btree (location_type);


--
-- Name: idx_supplier_credit_note_items_header_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_credit_note_items_header_id ON public.supplier_credit_note_items USING btree (supplier_credit_note_id);


--
-- Name: idx_supplier_credit_note_items_invoice_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_credit_note_items_invoice_item_id ON public.supplier_credit_note_items USING btree (supplier_invoice_item_id);


--
-- Name: idx_supplier_credit_note_items_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_credit_note_items_product_id ON public.supplier_credit_note_items USING btree (product_id);


--
-- Name: idx_supplier_credit_note_items_uom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_credit_note_items_uom_id ON public.supplier_credit_note_items USING btree (uom_id);


--
-- Name: idx_supplier_credit_notes_business_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_credit_notes_business_id ON public.supplier_credit_notes USING btree (business_id);


--
-- Name: idx_supplier_credit_notes_invoice_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_credit_notes_invoice_id ON public.supplier_credit_notes USING btree (supplier_invoice_id);


--
-- Name: idx_supplier_credit_notes_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_credit_notes_number ON public.supplier_credit_notes USING btree (credit_note_number);


--
-- Name: idx_supplier_credit_notes_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_credit_notes_status ON public.supplier_credit_notes USING btree (status);


--
-- Name: idx_supplier_credit_notes_supplier_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_credit_notes_supplier_id ON public.supplier_credit_notes USING btree (supplier_id);


--
-- Name: idx_supplier_invoice_items_grn_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_invoice_items_grn_item_id ON public.supplier_invoice_items USING btree (goods_received_note_item_id);


--
-- Name: idx_supplier_invoice_items_header_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_invoice_items_header_id ON public.supplier_invoice_items USING btree (supplier_invoice_id);


--
-- Name: idx_supplier_invoice_items_po_item_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_invoice_items_po_item_id ON public.supplier_invoice_items USING btree (purchase_order_item_id);


--
-- Name: idx_supplier_invoice_items_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_invoice_items_product_id ON public.supplier_invoice_items USING btree (product_id);


--
-- Name: idx_supplier_invoice_items_uom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_invoice_items_uom_id ON public.supplier_invoice_items USING btree (uom_id);


--
-- Name: idx_supplier_invoices_business_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_invoices_business_id ON public.supplier_invoices USING btree (business_id);


--
-- Name: idx_supplier_invoices_goods_received_note_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_invoices_goods_received_note_id ON public.supplier_invoices USING btree (goods_received_note_id);


--
-- Name: idx_supplier_invoices_invoice_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_invoices_invoice_number ON public.supplier_invoices USING btree (invoice_number);


--
-- Name: idx_supplier_invoices_purchase_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_invoices_purchase_order_id ON public.supplier_invoices USING btree (purchase_order_id);


--
-- Name: idx_supplier_invoices_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_invoices_status ON public.supplier_invoices USING btree (status);


--
-- Name: idx_supplier_invoices_supplier_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_invoices_supplier_id ON public.supplier_invoices USING btree (supplier_id);


--
-- Name: idx_supplier_quotation_items_header_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_quotation_items_header_id ON public.supplier_quotation_items USING btree (supplier_quotation_id);


--
-- Name: idx_supplier_quotation_items_product_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_quotation_items_product_id ON public.supplier_quotation_items USING btree (product_id);


--
-- Name: idx_supplier_quotation_items_uom_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_quotation_items_uom_id ON public.supplier_quotation_items USING btree (uom_id);


--
-- Name: idx_supplier_quotations_business_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_quotations_business_id ON public.supplier_quotations USING btree (business_id);


--
-- Name: idx_supplier_quotations_quote_date; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_quotations_quote_date ON public.supplier_quotations USING btree (quote_date);


--
-- Name: idx_supplier_quotations_quote_number; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_quotations_quote_number ON public.supplier_quotations USING btree (quote_number);


--
-- Name: idx_supplier_quotations_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_quotations_status ON public.supplier_quotations USING btree (status);


--
-- Name: idx_supplier_quotations_supplier_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_quotations_supplier_id ON public.supplier_quotations USING btree (supplier_id);


--
-- Name: idx_supplier_return_policies_business_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_return_policies_business_id ON public.supplier_return_policies USING btree (business_id);


--
-- Name: idx_supplier_return_policies_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_return_policies_status ON public.supplier_return_policies USING btree (status);


--
-- Name: idx_supplier_return_policies_supplier_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_supplier_return_policies_supplier_id ON public.supplier_return_policies USING btree (supplier_id);


--
-- Name: idx_suppliers_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_suppliers_code ON public.suppliers USING btree (code);


--
-- Name: idx_suppliers_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_suppliers_name ON public.suppliers USING btree (name);


--
-- Name: idx_suppliers_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_suppliers_status ON public.suppliers USING btree (status);


--
-- Name: idx_suppliers_tenant_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_suppliers_tenant_id ON public.suppliers USING btree (tenant_id);


--
-- Name: idx_uom_business_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_uom_business_id ON public.uom USING btree (business_id);


--
-- Name: idx_uom_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_uom_code ON public.uom USING btree (code);


--
-- Name: idx_uom_name; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_uom_name ON public.uom USING btree (name);


--
-- Name: idx_uom_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_uom_status ON public.uom USING btree (status);


--
-- Name: businesses set_businesses_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_businesses_updated_at BEFORE UPDATE ON public.businesses FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: goods_received_note_items set_goods_received_note_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_goods_received_note_items_updated_at BEFORE UPDATE ON public.goods_received_note_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: goods_received_notes set_goods_received_notes_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_goods_received_notes_updated_at BEFORE UPDATE ON public.goods_received_notes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: inventory_adjustment_items set_inventory_adjustment_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_inventory_adjustment_items_updated_at BEFORE UPDATE ON public.inventory_adjustment_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: inventory_adjustments set_inventory_adjustments_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_inventory_adjustments_updated_at BEFORE UPDATE ON public.inventory_adjustments FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: inventory_batches set_inventory_batches_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_inventory_batches_updated_at BEFORE UPDATE ON public.inventory_batches FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: inventory_write_off_items set_inventory_write_off_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_inventory_write_off_items_updated_at BEFORE UPDATE ON public.inventory_write_off_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: inventory_write_offs set_inventory_write_offs_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_inventory_write_offs_updated_at BEFORE UPDATE ON public.inventory_write_offs FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: product_categories set_product_categories_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_product_categories_updated_at BEFORE UPDATE ON public.product_categories FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: product_uom_conversions set_product_uom_conversions_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_product_uom_conversions_updated_at BEFORE UPDATE ON public.product_uom_conversions FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: products set_products_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: purchase_order_items set_purchase_order_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_purchase_order_items_updated_at BEFORE UPDATE ON public.purchase_order_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: purchase_orders set_purchase_orders_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_purchase_orders_updated_at BEFORE UPDATE ON public.purchase_orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: return_items set_return_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_return_items_updated_at BEFORE UPDATE ON public.return_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: returns set_returns_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_returns_updated_at BEFORE UPDATE ON public.returns FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: staff set_staff_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_staff_updated_at BEFORE UPDATE ON public.staff FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: stock_movements set_stock_movements_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_stock_movements_updated_at BEFORE UPDATE ON public.stock_movements FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: storage_locations set_storage_locations_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_storage_locations_updated_at BEFORE UPDATE ON public.storage_locations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: supplier_credit_note_items set_supplier_credit_note_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_supplier_credit_note_items_updated_at BEFORE UPDATE ON public.supplier_credit_note_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: supplier_credit_notes set_supplier_credit_notes_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_supplier_credit_notes_updated_at BEFORE UPDATE ON public.supplier_credit_notes FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: supplier_invoice_items set_supplier_invoice_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_supplier_invoice_items_updated_at BEFORE UPDATE ON public.supplier_invoice_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: supplier_invoices set_supplier_invoices_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_supplier_invoices_updated_at BEFORE UPDATE ON public.supplier_invoices FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: supplier_quotation_items set_supplier_quotation_items_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_supplier_quotation_items_updated_at BEFORE UPDATE ON public.supplier_quotation_items FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: supplier_quotations set_supplier_quotations_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_supplier_quotations_updated_at BEFORE UPDATE ON public.supplier_quotations FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: supplier_return_policies set_supplier_return_policies_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_supplier_return_policies_updated_at BEFORE UPDATE ON public.supplier_return_policies FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: uom set_uom_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER set_uom_updated_at BEFORE UPDATE ON public.uom FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


--
-- Name: goods_received_note_items goods_received_note_items_goods_received_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_received_note_items
    ADD CONSTRAINT goods_received_note_items_goods_received_note_id_fkey FOREIGN KEY (goods_received_note_id) REFERENCES public.goods_received_notes(id) ON DELETE CASCADE;


--
-- Name: goods_received_note_items goods_received_note_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_received_note_items
    ADD CONSTRAINT goods_received_note_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- Name: goods_received_note_items goods_received_note_items_uom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_received_note_items
    ADD CONSTRAINT goods_received_note_items_uom_id_fkey FOREIGN KEY (uom_id) REFERENCES public.uom(id) ON DELETE RESTRICT;


--
-- Name: goods_received_notes goods_received_notes_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_received_notes
    ADD CONSTRAINT goods_received_notes_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: goods_received_notes goods_received_notes_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_received_notes
    ADD CONSTRAINT goods_received_notes_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: goods_received_notes goods_received_notes_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_received_notes
    ADD CONSTRAINT goods_received_notes_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON DELETE RESTRICT;


--
-- Name: goods_received_notes goods_received_notes_storage_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_received_notes
    ADD CONSTRAINT goods_received_notes_storage_location_id_fkey FOREIGN KEY (storage_location_id) REFERENCES public.storage_locations(id) ON DELETE RESTRICT;


--
-- Name: goods_received_notes goods_received_notes_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.goods_received_notes
    ADD CONSTRAINT goods_received_notes_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: inventory_adjustment_items inventory_adjustment_items_inventory_adjustment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustment_items
    ADD CONSTRAINT inventory_adjustment_items_inventory_adjustment_id_fkey FOREIGN KEY (inventory_adjustment_id) REFERENCES public.inventory_adjustments(id) ON DELETE CASCADE;


--
-- Name: inventory_adjustment_items inventory_adjustment_items_inventory_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustment_items
    ADD CONSTRAINT inventory_adjustment_items_inventory_batch_id_fkey FOREIGN KEY (inventory_batch_id) REFERENCES public.inventory_batches(id) ON DELETE SET NULL;


--
-- Name: inventory_adjustment_items inventory_adjustment_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustment_items
    ADD CONSTRAINT inventory_adjustment_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- Name: inventory_adjustment_items inventory_adjustment_items_storage_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustment_items
    ADD CONSTRAINT inventory_adjustment_items_storage_location_id_fkey FOREIGN KEY (storage_location_id) REFERENCES public.storage_locations(id) ON DELETE RESTRICT;


--
-- Name: inventory_adjustment_items inventory_adjustment_items_uom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustment_items
    ADD CONSTRAINT inventory_adjustment_items_uom_id_fkey FOREIGN KEY (uom_id) REFERENCES public.uom(id) ON DELETE RESTRICT;


--
-- Name: inventory_adjustments inventory_adjustments_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: inventory_adjustments inventory_adjustments_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: inventory_adjustments inventory_adjustments_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_adjustments
    ADD CONSTRAINT inventory_adjustments_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: inventory_batches inventory_batches_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_batches
    ADD CONSTRAINT inventory_batches_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: inventory_batches inventory_batches_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_batches
    ADD CONSTRAINT inventory_batches_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: inventory_batches inventory_batches_goods_received_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_batches
    ADD CONSTRAINT inventory_batches_goods_received_note_id_fkey FOREIGN KEY (goods_received_note_id) REFERENCES public.goods_received_notes(id) ON DELETE CASCADE;


--
-- Name: inventory_batches inventory_batches_goods_received_note_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_batches
    ADD CONSTRAINT inventory_batches_goods_received_note_item_id_fkey FOREIGN KEY (goods_received_note_item_id) REFERENCES public.goods_received_note_items(id) ON DELETE CASCADE;


--
-- Name: inventory_batches inventory_batches_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_batches
    ADD CONSTRAINT inventory_batches_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- Name: inventory_batches inventory_batches_storage_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_batches
    ADD CONSTRAINT inventory_batches_storage_location_id_fkey FOREIGN KEY (storage_location_id) REFERENCES public.storage_locations(id) ON DELETE RESTRICT;


--
-- Name: inventory_batches inventory_batches_uom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_batches
    ADD CONSTRAINT inventory_batches_uom_id_fkey FOREIGN KEY (uom_id) REFERENCES public.uom(id) ON DELETE RESTRICT;


--
-- Name: inventory_batches inventory_batches_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_batches
    ADD CONSTRAINT inventory_batches_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: inventory_write_off_items inventory_write_off_items_inventory_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_write_off_items
    ADD CONSTRAINT inventory_write_off_items_inventory_batch_id_fkey FOREIGN KEY (inventory_batch_id) REFERENCES public.inventory_batches(id) ON DELETE RESTRICT;


--
-- Name: inventory_write_off_items inventory_write_off_items_inventory_write_off_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_write_off_items
    ADD CONSTRAINT inventory_write_off_items_inventory_write_off_id_fkey FOREIGN KEY (inventory_write_off_id) REFERENCES public.inventory_write_offs(id) ON DELETE CASCADE;


--
-- Name: inventory_write_off_items inventory_write_off_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_write_off_items
    ADD CONSTRAINT inventory_write_off_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- Name: inventory_write_off_items inventory_write_off_items_storage_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_write_off_items
    ADD CONSTRAINT inventory_write_off_items_storage_location_id_fkey FOREIGN KEY (storage_location_id) REFERENCES public.storage_locations(id) ON DELETE RESTRICT;


--
-- Name: inventory_write_off_items inventory_write_off_items_uom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_write_off_items
    ADD CONSTRAINT inventory_write_off_items_uom_id_fkey FOREIGN KEY (uom_id) REFERENCES public.uom(id) ON DELETE RESTRICT;


--
-- Name: inventory_write_offs inventory_write_offs_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_write_offs
    ADD CONSTRAINT inventory_write_offs_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: inventory_write_offs inventory_write_offs_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_write_offs
    ADD CONSTRAINT inventory_write_offs_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: inventory_write_offs inventory_write_offs_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_write_offs
    ADD CONSTRAINT inventory_write_offs_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: product_categories product_categories_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: product_categories product_categories_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: product_categories product_categories_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.product_categories(id) ON DELETE SET NULL;


--
-- Name: product_categories product_categories_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_categories
    ADD CONSTRAINT product_categories_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: product_uom_conversions product_uom_conversions_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_uom_conversions
    ADD CONSTRAINT product_uom_conversions_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: product_uom_conversions product_uom_conversions_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_uom_conversions
    ADD CONSTRAINT product_uom_conversions_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: product_uom_conversions product_uom_conversions_from_uom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_uom_conversions
    ADD CONSTRAINT product_uom_conversions_from_uom_id_fkey FOREIGN KEY (from_uom_id) REFERENCES public.uom(id);


--
-- Name: product_uom_conversions product_uom_conversions_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_uom_conversions
    ADD CONSTRAINT product_uom_conversions_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- Name: product_uom_conversions product_uom_conversions_to_uom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_uom_conversions
    ADD CONSTRAINT product_uom_conversions_to_uom_id_fkey FOREIGN KEY (to_uom_id) REFERENCES public.uom(id);


--
-- Name: product_uom_conversions product_uom_conversions_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_uom_conversions
    ADD CONSTRAINT product_uom_conversions_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: products products_base_uom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_base_uom_id_fkey FOREIGN KEY (base_uom_id) REFERENCES public.uom(id);


--
-- Name: products products_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: products products_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.product_categories(id) ON DELETE SET NULL;


--
-- Name: products products_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: products products_default_storage_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_default_storage_location_id_fkey FOREIGN KEY (default_storage_location_id) REFERENCES public.storage_locations(id) ON DELETE SET NULL;


--
-- Name: products products_preferred_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_preferred_supplier_id_fkey FOREIGN KEY (preferred_supplier_id) REFERENCES public.suppliers(id) ON DELETE SET NULL;


--
-- Name: products products_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: purchase_order_items purchase_order_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- Name: purchase_order_items purchase_order_items_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON DELETE CASCADE;


--
-- Name: purchase_order_items purchase_order_items_uom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_items
    ADD CONSTRAINT purchase_order_items_uom_id_fkey FOREIGN KEY (uom_id) REFERENCES public.uom(id) ON DELETE RESTRICT;


--
-- Name: purchase_orders purchase_orders_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: purchase_orders purchase_orders_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: purchase_orders purchase_orders_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE RESTRICT;


--
-- Name: purchase_orders purchase_orders_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_orders
    ADD CONSTRAINT purchase_orders_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: return_items return_items_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: return_items return_items_inventory_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_inventory_batch_id_fkey FOREIGN KEY (inventory_batch_id) REFERENCES public.inventory_batches(id) ON DELETE SET NULL;


--
-- Name: return_items return_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- Name: return_items return_items_return_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_return_id_fkey FOREIGN KEY (return_id) REFERENCES public.returns(id) ON DELETE CASCADE;


--
-- Name: return_items return_items_storage_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_storage_location_id_fkey FOREIGN KEY (storage_location_id) REFERENCES public.storage_locations(id) ON DELETE RESTRICT;


--
-- Name: return_items return_items_uom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_uom_id_fkey FOREIGN KEY (uom_id) REFERENCES public.uom(id) ON DELETE RESTRICT;


--
-- Name: return_items return_items_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_items
    ADD CONSTRAINT return_items_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: returns returns_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: returns returns_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: returns returns_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: staff staff_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: stock_movements stock_movements_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: stock_movements stock_movements_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: stock_movements stock_movements_from_storage_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_from_storage_location_id_fkey FOREIGN KEY (from_storage_location_id) REFERENCES public.storage_locations(id) ON DELETE SET NULL;


--
-- Name: stock_movements stock_movements_inventory_batch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_inventory_batch_id_fkey FOREIGN KEY (inventory_batch_id) REFERENCES public.inventory_batches(id) ON DELETE SET NULL;


--
-- Name: stock_movements stock_movements_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- Name: stock_movements stock_movements_to_storage_location_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_to_storage_location_id_fkey FOREIGN KEY (to_storage_location_id) REFERENCES public.storage_locations(id) ON DELETE SET NULL;


--
-- Name: stock_movements stock_movements_uom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_uom_id_fkey FOREIGN KEY (uom_id) REFERENCES public.uom(id) ON DELETE RESTRICT;


--
-- Name: stock_movements stock_movements_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movements
    ADD CONSTRAINT stock_movements_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: storage_locations storage_locations_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.storage_locations
    ADD CONSTRAINT storage_locations_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: storage_locations storage_locations_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.storage_locations
    ADD CONSTRAINT storage_locations_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: storage_locations storage_locations_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.storage_locations
    ADD CONSTRAINT storage_locations_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.storage_locations(id) ON DELETE SET NULL;


--
-- Name: storage_locations storage_locations_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.storage_locations
    ADD CONSTRAINT storage_locations_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: supplier_credit_note_items supplier_credit_note_items_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_credit_note_items
    ADD CONSTRAINT supplier_credit_note_items_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: supplier_credit_note_items supplier_credit_note_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_credit_note_items
    ADD CONSTRAINT supplier_credit_note_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- Name: supplier_credit_note_items supplier_credit_note_items_supplier_credit_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_credit_note_items
    ADD CONSTRAINT supplier_credit_note_items_supplier_credit_note_id_fkey FOREIGN KEY (supplier_credit_note_id) REFERENCES public.supplier_credit_notes(id) ON DELETE CASCADE;


--
-- Name: supplier_credit_note_items supplier_credit_note_items_supplier_invoice_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_credit_note_items
    ADD CONSTRAINT supplier_credit_note_items_supplier_invoice_item_id_fkey FOREIGN KEY (supplier_invoice_item_id) REFERENCES public.supplier_invoice_items(id) ON DELETE SET NULL;


--
-- Name: supplier_credit_note_items supplier_credit_note_items_uom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_credit_note_items
    ADD CONSTRAINT supplier_credit_note_items_uom_id_fkey FOREIGN KEY (uom_id) REFERENCES public.uom(id) ON DELETE RESTRICT;


--
-- Name: supplier_credit_note_items supplier_credit_note_items_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_credit_note_items
    ADD CONSTRAINT supplier_credit_note_items_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: supplier_credit_notes supplier_credit_notes_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_credit_notes
    ADD CONSTRAINT supplier_credit_notes_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.staff(id);


--
-- Name: supplier_credit_notes supplier_credit_notes_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_credit_notes
    ADD CONSTRAINT supplier_credit_notes_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: supplier_credit_notes supplier_credit_notes_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_credit_notes
    ADD CONSTRAINT supplier_credit_notes_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: supplier_credit_notes supplier_credit_notes_processed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_credit_notes
    ADD CONSTRAINT supplier_credit_notes_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.staff(id);


--
-- Name: supplier_credit_notes supplier_credit_notes_received_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_credit_notes
    ADD CONSTRAINT supplier_credit_notes_received_by_fkey FOREIGN KEY (received_by) REFERENCES public.staff(id);


--
-- Name: supplier_credit_notes supplier_credit_notes_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_credit_notes
    ADD CONSTRAINT supplier_credit_notes_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE RESTRICT;


--
-- Name: supplier_credit_notes supplier_credit_notes_supplier_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_credit_notes
    ADD CONSTRAINT supplier_credit_notes_supplier_invoice_id_fkey FOREIGN KEY (supplier_invoice_id) REFERENCES public.supplier_invoices(id) ON DELETE SET NULL;


--
-- Name: supplier_credit_notes supplier_credit_notes_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_credit_notes
    ADD CONSTRAINT supplier_credit_notes_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: supplier_invoice_items supplier_invoice_items_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoice_items
    ADD CONSTRAINT supplier_invoice_items_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: supplier_invoice_items supplier_invoice_items_goods_received_note_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoice_items
    ADD CONSTRAINT supplier_invoice_items_goods_received_note_item_id_fkey FOREIGN KEY (goods_received_note_item_id) REFERENCES public.goods_received_note_items(id) ON DELETE SET NULL;


--
-- Name: supplier_invoice_items supplier_invoice_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoice_items
    ADD CONSTRAINT supplier_invoice_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- Name: supplier_invoice_items supplier_invoice_items_purchase_order_item_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoice_items
    ADD CONSTRAINT supplier_invoice_items_purchase_order_item_id_fkey FOREIGN KEY (purchase_order_item_id) REFERENCES public.purchase_order_items(id) ON DELETE SET NULL;


--
-- Name: supplier_invoice_items supplier_invoice_items_supplier_invoice_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoice_items
    ADD CONSTRAINT supplier_invoice_items_supplier_invoice_id_fkey FOREIGN KEY (supplier_invoice_id) REFERENCES public.supplier_invoices(id) ON DELETE CASCADE;


--
-- Name: supplier_invoice_items supplier_invoice_items_uom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoice_items
    ADD CONSTRAINT supplier_invoice_items_uom_id_fkey FOREIGN KEY (uom_id) REFERENCES public.uom(id) ON DELETE RESTRICT;


--
-- Name: supplier_invoice_items supplier_invoice_items_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoice_items
    ADD CONSTRAINT supplier_invoice_items_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: supplier_invoices supplier_invoices_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoices
    ADD CONSTRAINT supplier_invoices_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.staff(id);


--
-- Name: supplier_invoices supplier_invoices_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoices
    ADD CONSTRAINT supplier_invoices_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: supplier_invoices supplier_invoices_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoices
    ADD CONSTRAINT supplier_invoices_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: supplier_invoices supplier_invoices_goods_received_note_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoices
    ADD CONSTRAINT supplier_invoices_goods_received_note_id_fkey FOREIGN KEY (goods_received_note_id) REFERENCES public.goods_received_notes(id) ON DELETE SET NULL;


--
-- Name: supplier_invoices supplier_invoices_processed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoices
    ADD CONSTRAINT supplier_invoices_processed_by_fkey FOREIGN KEY (processed_by) REFERENCES public.staff(id);


--
-- Name: supplier_invoices supplier_invoices_purchase_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoices
    ADD CONSTRAINT supplier_invoices_purchase_order_id_fkey FOREIGN KEY (purchase_order_id) REFERENCES public.purchase_orders(id) ON DELETE SET NULL;


--
-- Name: supplier_invoices supplier_invoices_received_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoices
    ADD CONSTRAINT supplier_invoices_received_by_fkey FOREIGN KEY (received_by) REFERENCES public.staff(id);


--
-- Name: supplier_invoices supplier_invoices_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoices
    ADD CONSTRAINT supplier_invoices_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE RESTRICT;


--
-- Name: supplier_invoices supplier_invoices_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_invoices
    ADD CONSTRAINT supplier_invoices_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: supplier_quotation_items supplier_quotation_items_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_quotation_items
    ADD CONSTRAINT supplier_quotation_items_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: supplier_quotation_items supplier_quotation_items_product_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_quotation_items
    ADD CONSTRAINT supplier_quotation_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE RESTRICT;


--
-- Name: supplier_quotation_items supplier_quotation_items_supplier_quotation_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_quotation_items
    ADD CONSTRAINT supplier_quotation_items_supplier_quotation_id_fkey FOREIGN KEY (supplier_quotation_id) REFERENCES public.supplier_quotations(id) ON DELETE CASCADE;


--
-- Name: supplier_quotation_items supplier_quotation_items_uom_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_quotation_items
    ADD CONSTRAINT supplier_quotation_items_uom_id_fkey FOREIGN KEY (uom_id) REFERENCES public.uom(id) ON DELETE RESTRICT;


--
-- Name: supplier_quotation_items supplier_quotation_items_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_quotation_items
    ADD CONSTRAINT supplier_quotation_items_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: supplier_quotations supplier_quotations_approved_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_quotations
    ADD CONSTRAINT supplier_quotations_approved_by_fkey FOREIGN KEY (approved_by) REFERENCES public.staff(id);


--
-- Name: supplier_quotations supplier_quotations_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_quotations
    ADD CONSTRAINT supplier_quotations_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: supplier_quotations supplier_quotations_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_quotations
    ADD CONSTRAINT supplier_quotations_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: supplier_quotations supplier_quotations_reviewed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_quotations
    ADD CONSTRAINT supplier_quotations_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public.staff(id);


--
-- Name: supplier_quotations supplier_quotations_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_quotations
    ADD CONSTRAINT supplier_quotations_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE RESTRICT;


--
-- Name: supplier_quotations supplier_quotations_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_quotations
    ADD CONSTRAINT supplier_quotations_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: supplier_return_policies supplier_return_policies_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_return_policies
    ADD CONSTRAINT supplier_return_policies_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: supplier_return_policies supplier_return_policies_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_return_policies
    ADD CONSTRAINT supplier_return_policies_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: supplier_return_policies supplier_return_policies_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_return_policies
    ADD CONSTRAINT supplier_return_policies_supplier_id_fkey FOREIGN KEY (supplier_id) REFERENCES public.suppliers(id) ON DELETE CASCADE;


--
-- Name: supplier_return_policies supplier_return_policies_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_return_policies
    ADD CONSTRAINT supplier_return_policies_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- Name: uom uom_business_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uom
    ADD CONSTRAINT uom_business_id_fkey FOREIGN KEY (business_id) REFERENCES public.businesses(id) ON DELETE CASCADE;


--
-- Name: uom uom_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uom
    ADD CONSTRAINT uom_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.staff(id);


--
-- Name: uom uom_updated_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.uom
    ADD CONSTRAINT uom_updated_by_fkey FOREIGN KEY (updated_by) REFERENCES public.staff(id);


--
-- PostgreSQL database dump complete
--

\unrestrict 107c3dYePim5h6bGs1ecBoQmt4DJ0Mrj5YdzU0orPqDfaEddPas9FNIqJD4j4Xf

