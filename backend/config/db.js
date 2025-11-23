import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config();
async function main() {
    await mongoose.connect(process.env.MONGO_URI)
}
export default main