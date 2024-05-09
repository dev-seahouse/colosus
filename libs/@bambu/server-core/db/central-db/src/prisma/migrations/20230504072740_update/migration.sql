-- AlterTable
ALTER TABLE "tenants"
  ADD COLUMN "linked_to_keycloak"       BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "uses_id_instead_of_realm" BOOLEAN NOT NULL DEFAULT false;

-- Update Values For Existing entries
UPDATE tenants
SET linked_to_keycloak = true
WHERE id IN (SELECT id FROM tenants);

UPDATE tenants
SET uses_id_instead_of_realm = false
WHERE id IN (SELECT id FROM tenants);
