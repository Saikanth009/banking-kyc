import axios from 'axios';

axios.post('http://localhost:8080/api/auth/register', {
  fullName: "John",
  email: "johndoe1@example.com",
  password: "password123",
  role: "CUSTOMER"
}).then(res => {
  console.log("SUCCESS:", res.data);
}).catch(err => {
  console.log("ERROR STATUS:", err.response?.status);
  console.log("ERROR DATA JSON:", JSON.stringify(err.response?.data));
});
