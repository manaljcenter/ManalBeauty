[1mdiff --git a/src/lib/supabase/server.ts b/src/lib/supabase/server.ts[m
[1mindex ecb0693..cdee00a 100644[m
[1m--- a/src/lib/supabase/server.ts[m
[1m+++ b/src/lib/supabase/server.ts[m
[36m@@ -4,8 +4,14 @@[m [mexport function createClient() {[m
   const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;[m
   const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;[m
 [m
[31m-  if (!supabaseUrl || !supabaseKey) {[m
[31m-    throw new Error('Missing Supabase environment variables');[m
[32m+[m[32m  if (!supabaseUrl) {[m
[32m+[m[32m    console.error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable');[m
[32m+[m[32m    throw new Error('Missing Supabase URL environment variable');[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  if (!supabaseKey) {[m
[32m+[m[32m    console.error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable');[m
[32m+[m[32m    throw new Error('Missing Supabase Service Role Key environment variable');[m
   }[m
 [m
   return createSupabaseClient(supabaseUrl, supabaseKey, {[m
