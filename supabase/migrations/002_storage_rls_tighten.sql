-- Restringe storage: apenas root admin ou pasta do próprio usuário
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'storage' AND table_name = 'objects') THEN
    EXECUTE 'DROP POLICY IF EXISTS storage_project_files ON storage.objects';
    EXECUTE $p$
      CREATE POLICY storage_project_files ON storage.objects FOR ALL USING (
        bucket_id = 'project-files' AND (
          public.is_root_admin()
          OR (storage.foldername(name))[1] = auth.uid()::text
        )
      )
    $p$;
  END IF;
END $$;
