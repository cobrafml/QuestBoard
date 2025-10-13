import postgres from 'postgres'

const connectionString = process.env.DATABASE_URL
const sql = postgres(connectionString)

export default sql
//DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.wedbfrxcoywngkueabbw.supabase.co:5432/postgres
