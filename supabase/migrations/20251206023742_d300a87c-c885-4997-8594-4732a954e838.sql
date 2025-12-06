-- Add new game action types to award_game_points function
CREATE OR REPLACE FUNCTION public.award_game_points(action_type text, description_text text DEFAULT NULL::text)
 RETURNS json
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  current_user_id uuid;
  points_value int;
  new_points int;
BEGIN
  -- Get authenticated user
  current_user_id := auth.uid();
  
  IF current_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;
  
  -- Validate action_type and assign fixed points
  CASE action_type
    WHEN 'game_correct_answer' THEN points_value := 10;
    WHEN 'quiz_correct_answer' THEN points_value := 10;
    WHEN 'game_completion' THEN points_value := 20;
    WHEN 'quiz_level_completion' THEN points_value := 15;
    WHEN 'memory_game_complete' THEN points_value := 25;
    WHEN 'timeline_correct_answer' THEN points_value := 15;
    WHEN 'memory_match' THEN points_value := 5;
    ELSE
      RETURN json_build_object('success', false, 'error', 'Invalid action type');
  END CASE;
  
  -- Update user points
  UPDATE public.profiles 
  SET points = points + points_value
  WHERE user_id = current_user_id
  RETURNING points INTO new_points;
  
  -- Insert into points_history (bypasses RLS due to SECURITY DEFINER)
  INSERT INTO public.points_history (user_id, action, points, description)
  VALUES (current_user_id, action_type, points_value, description_text);
  
  RETURN json_build_object(
    'success', true, 
    'points_awarded', points_value, 
    'new_total', new_points
  );
END;
$function$;