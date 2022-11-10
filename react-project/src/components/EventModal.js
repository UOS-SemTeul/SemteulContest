import "../static/EventModal.css";
import GlobalContext from "../context/GlobalContext";
import { useContext, useState } from "react";

export default function EventModal() {
  const { modalDate, setModalDate, dispatchCalTodo } =
    useContext(GlobalContext);
  const [title, setTitle] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const todoPayload = {
      title,
    };
    dispatchCalTodo({ type: "push", payload: todoPayload });
    setModalDate("");
  }

  return (
    <div className="bgModal">
      <form action="" className="eventModal">
        <header>
          <nav>
            <div>todo</div>
            <div>repo</div>
          </nav>
          <button className="close" onClick={() => setModalDate("")}></button>
        </header>
        <main>
          <input type="text" />
          <button type="submit" onClick={handleSubmit}>
            submit
          </button>
        </main>
      </form>
    </div>
  );
}
