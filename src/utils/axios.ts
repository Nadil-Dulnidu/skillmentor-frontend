import { BACKEND_URL } from "@/config/env";
import axios from "axios";

export default axios.create({
  baseURL: `${BACKEND_URL}/academic`,
})