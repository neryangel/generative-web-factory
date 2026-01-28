-- Atomic reorder sections stored procedure
-- Prevents race conditions when multiple sort_order updates happen simultaneously

CREATE OR REPLACE FUNCTION reorder_sections(
  p_page_id UUID,
  p_section_orders JSONB -- Array of {id: UUID, sort_order: INT}
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  section_item JSONB;
BEGIN
  -- Validate all sections belong to the page
  IF EXISTS (
    SELECT 1 FROM jsonb_array_elements(p_section_orders) AS item
    WHERE NOT EXISTS (
      SELECT 1 FROM sections
      WHERE id = (item->>'id')::UUID
      AND page_id = p_page_id
    )
  ) THEN
    RAISE EXCEPTION 'One or more sections do not belong to the specified page';
  END IF;

  -- Update all sort_orders in a single transaction
  FOR section_item IN SELECT * FROM jsonb_array_elements(p_section_orders)
  LOOP
    UPDATE sections
    SET sort_order = (section_item->>'sort_order')::INT,
        updated_at = NOW()
    WHERE id = (section_item->>'id')::UUID
    AND page_id = p_page_id;
  END LOOP;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION reorder_sections(UUID, JSONB) TO authenticated;

COMMENT ON FUNCTION reorder_sections IS 'Atomically reorder sections within a page to prevent race conditions';
