import axios from "axios";

console.log(await axios({
  method: "GET",
  url: "https://jsonplaceholder.typicode.com/todos/1",
  headers: {
    Authorization: "Bearer token",
    "Content-Type": "application/json",
  },
  data: JSON.stringify({ key: "value" }),
}
))