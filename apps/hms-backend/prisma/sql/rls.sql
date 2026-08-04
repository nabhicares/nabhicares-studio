-- Run this after `prisma migrate dev` on the HMS database.
-- This enforces tenant isolation at the database layer. Even if the app
-- layer forgets a WHERE tenant_id = ..., Postgres will not return rows
-- outside the current session's tenant.

-- The app sets this per-request, right after acquiring a DB connection:
--   SET app.current_tenant_id = '<tenant-uuid>';
-- Super Admin sessions instead set app.is_super_admin = 'true' to bypass.

ALTER TABLE "Staff" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Patient" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Appointment" ENABLE ROW LEVEL SECURITY;

-- Table owners bypass RLS unless FORCE is set. The migrate role (`hms`)
-- owns these tables, so without FORCE a forgotten tenant setting would
-- still leak every row when connected as that user.
ALTER TABLE "Staff" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Patient" FORCE ROW LEVEL SECURITY;
ALTER TABLE "Appointment" FORCE ROW LEVEL SECURITY;

-- Prisma maps String ids to text (not uuid) unless @db.Uuid is used.
-- Compare as text so the policy expression type-checks against the schema.
CREATE POLICY tenant_isolation_staff ON "Staff"
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "tenantId" = current_setting('app.current_tenant_id', true)
  );

CREATE POLICY tenant_isolation_patient ON "Patient"
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "tenantId" = current_setting('app.current_tenant_id', true)
  );

CREATE POLICY tenant_isolation_appointment ON "Appointment"
  USING (
    current_setting('app.is_super_admin', true) = 'true'
    OR "tenantId" = current_setting('app.current_tenant_id', true)
  );

-- IMPORTANT: docker's POSTGRES_USER (`hms`) is a superuser and ALWAYS
-- bypasses RLS, even with FORCE. The NestJS app must connect as hms_app.
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'hms_app') THEN
    CREATE ROLE hms_app LOGIN PASSWORD 'hms_app_dev_pw';
  END IF;
END
$$;
GRANT CONNECT ON DATABASE nabhicares_hms TO hms_app;
GRANT USAGE ON SCHEMA public TO hms_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO hms_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO hms_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO hms_app;
ALTER ROLE hms_app NOBYPASSRLS;
