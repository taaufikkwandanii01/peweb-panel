-- Function untuk auto-pending products ketika developer status menjadi rejected
CREATE OR REPLACE FUNCTION public.auto_pending_products_on_user_reject()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Jika status berubah menjadi rejected
  IF NEW.status = 'rejected' AND OLD.status != 'rejected' THEN
    -- Update semua products milik developer ini menjadi pending
    UPDATE public.products
    SET 
      status = 'pending',
      updated_at = now()
    WHERE developer_id = NEW.id;
    
    RAISE NOTICE 'Auto-pending % products for rejected user %', 
      (SELECT COUNT(*) FROM public.products WHERE developer_id = NEW.id), 
      NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Buat trigger pada tabel usersProfiles
DROP TRIGGER IF EXISTS trigger_auto_pending_products_on_reject ON public."usersProfiles";

CREATE TRIGGER trigger_auto_pending_products_on_reject
AFTER UPDATE OF status ON public."usersProfiles"
FOR EACH ROW
WHEN (NEW.status = 'rejected' AND OLD.status IS DISTINCT FROM 'rejected')
EXECUTE FUNCTION public.auto_pending_products_on_user_reject();