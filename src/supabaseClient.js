import { createClient } from '@supabase/supabase-js';

export const supabase = createClient("https://wedbfrxcoywngkueabbw.supabase.co", 
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlZGJmcnhjb3l3bmdrdWVhYmJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAwNDI0NzgsImV4cCI6MjA3NTYxODQ3OH0.OWWcpy4HplYOcEst8_D5KJqtYopQt8qNDAnuOiLHx4E");