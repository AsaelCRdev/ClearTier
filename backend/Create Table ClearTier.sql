BEGIN;


CREATE TABLE IF NOT EXISTS public.ai_change_items
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    request_id integer NOT NULL,
    role_id integer NOT NULL,
    effect character varying(10) COLLATE pg_catalog."default" NOT NULL,
    operation character varying(20) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT ai_change_items_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.ai_change_requests
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    requested_by integer NOT NULL,
    prompt_text text COLLATE pg_catalog."default" NOT NULL,
    status character varying(20) COLLATE pg_catalog."default" NOT NULL DEFAULT 'PENDING'::character varying,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ai_change_requests_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.audit_logs
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    actor_id integer,
    action character varying(100) COLLATE pg_catalog."default" NOT NULL,
    target_type character varying(50) COLLATE pg_catalog."default" NOT NULL,
    target_id integer,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT audit_logs_pkey PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.permissions
(
    id_permissions integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    id_resource integer NOT NULL,
    action character varying(20) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT permissions_pkey PRIMARY KEY (id_permissions)
);

CREATE TABLE IF NOT EXISTS public.resources
(
    id_resource integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    description character varying COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT resources_pkey PRIMARY KEY (id_resource),
    CONSTRAINT uk_resources_name UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS public.role_permissions
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    role_id integer NOT NULL,
    permission_id integer NOT NULL,
    effect character varying(10) COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT role_permissions_pkey PRIMARY KEY (id),
    CONSTRAINT uk_role_permission UNIQUE (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS public.roles
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    name character varying COLLATE pg_catalog."default" NOT NULL,
    description text COLLATE pg_catalog."default" NOT NULL,
    is_system_role boolean NOT NULL DEFAULT false,
    CONSTRAINT roles_pkey PRIMARY KEY (id),
    CONSTRAINT roles_name_key UNIQUE (name)
);

CREATE TABLE IF NOT EXISTS public.user_roles
(
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    user_id integer NOT NULL,
    role_id integer NOT NULL,
    assigned_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT user_roles_pkey PRIMARY KEY (id),
    CONSTRAINT uk_user_role UNIQUE (user_id, role_id)
);

CREATE TABLE IF NOT EXISTS public.users
(
    id_user integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    admin_id integer,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    name character varying(100) COLLATE pg_catalog."default" NOT NULL,
    token_hash text COLLATE pg_catalog."default" NOT NULL,
    active boolean NOT NULL DEFAULT true,
    CONSTRAINT users_pkey PRIMARY KEY (id_user),
    CONSTRAINT users_admin_id_key UNIQUE (admin_id),
    CONSTRAINT users_email_key UNIQUE (email)
);

ALTER TABLE IF EXISTS public.ai_change_items
    ADD CONSTRAINT fk_ai_change_items_request FOREIGN KEY (request_id)
    REFERENCES public.ai_change_requests (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_ai_change_items_request_id
    ON public.ai_change_items(request_id);


ALTER TABLE IF EXISTS public.ai_change_items
    ADD CONSTRAINT fk_ai_change_items_role FOREIGN KEY (role_id)
    REFERENCES public.roles (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;


ALTER TABLE IF EXISTS public.ai_change_requests
    ADD CONSTRAINT fk_ai_change_requests_user FOREIGN KEY (requested_by)
    REFERENCES public.users (id_user) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;
CREATE INDEX IF NOT EXISTS idx_ai_change_requests_requested_by
    ON public.ai_change_requests(requested_by);


ALTER TABLE IF EXISTS public.audit_logs
    ADD CONSTRAINT fk_audit_logs_actor FOREIGN KEY (actor_id)
    REFERENCES public.users (id_user) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor_id
    ON public.audit_logs(actor_id);


ALTER TABLE IF EXISTS public.permissions
    ADD CONSTRAINT fk_resources FOREIGN KEY (id_resource)
    REFERENCES public.resources (id_resource) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE NO ACTION;


ALTER TABLE IF EXISTS public.role_permissions
    ADD CONSTRAINT fk_role_permissions_permission FOREIGN KEY (permission_id)
    REFERENCES public.permissions (id_permissions) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id
    ON public.role_permissions(permission_id);


ALTER TABLE IF EXISTS public.role_permissions
    ADD CONSTRAINT fk_role_permissions_role FOREIGN KEY (role_id)
    REFERENCES public.roles (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id
    ON public.role_permissions(role_id);


ALTER TABLE IF EXISTS public.user_roles
    ADD CONSTRAINT fk_user_roles_role FOREIGN KEY (role_id)
    REFERENCES public.roles (id) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE RESTRICT;
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id
    ON public.user_roles(role_id);


ALTER TABLE IF EXISTS public.user_roles
    ADD CONSTRAINT fk_user_roles_user FOREIGN KEY (user_id)
    REFERENCES public.users (id_user) MATCH SIMPLE
    ON UPDATE NO ACTION
    ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id
    ON public.user_roles(user_id);

END;