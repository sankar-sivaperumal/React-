import CryptoJS from "crypto-js";
import api from "../Forms/api";
import login from "./login";
import { useState } from "react";

const secretKey = "myLocalSecretKey"; // Keep it consistent with backend for dev

const [email]= useState("");
const [password ]= useState("");

async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();

  // Encrypt password
  const encryptedPassword = CryptoJS.AES.encrypt(password, secretKey).toString();

  try {
    const res = await api.post("/auth/login", {
      email,
      password: encryptedPassword,
    });

    login( res.data.access_token);
  } catch (err) {
    console.error(err);
  }
}

export default handleSubmit