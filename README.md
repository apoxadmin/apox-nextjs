### setup:
1. Create an `.env.local` file in the main folder.
2. Set `NEXT_PUBLIC_SUPABASE_URL` to the Supabase URL
3. Set `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the anon public key
4. Set `SUPABASE_SERVICE_ROLE` to the `service_role`

the final format of `.env.local` should be:
NEXT_PUBLIC_SUPABASE_URL=<key>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon_key>
SUPABASE_SERVICE_ROLE=<service_role>

all three values can be found in the supabase settings by going to project settings
and data api

5. ensure that react and next js are installed. run `npm i` to initialize
all packages and `npm run dev` to start.

the project should be ready to work on from here.