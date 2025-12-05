-- Allow admins to manage user roles
CREATE POLICY "Admins can manage user roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admins to delete objects
CREATE POLICY "Admins can delete objects"
ON public.objects_3d
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));