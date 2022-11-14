import "../static/PageDateModal.css";
import GlobalContext from "../context/GlobalContext";
import { useQuery } from "@apollo/client";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

import { Fragment, useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth";
import dayjs from "dayjs";
import { useForm } from "../utils/hooks";
import { FETCH_TODOS_QUERY } from "../utils/querys";

export default function PageDateModal() {
  const { modalObj, setModalObj } = useContext(GlobalContext);
  const { user } = useContext(AuthContext);
  const userId = user?.id;
  const [prntTitle, setPrntTitle] = useState("");
  let pageList = [];
  const [prntList, setPrntList] = useState([]);
  let prntIdList = [];

  const { onChange, onSubmit, values } = useForm(createTdytd, {
    date: modalObj.date.format("YYYY-MM-DD").toString(),
    title: "",
    type: "page",
    // parent: prntIdList,
    text: "",
    userId,
  });

  const [createPage] = useMutation(CREATE_PAGE, {
    onError(err) {
      console.log(JSON.stringify(err, null, 2));
    },
    variables: values,
  });

  async function createTdytd() {
    createPage();
    setModalObj({ type: "" });
  }

  const { error, data } = useQuery(FETCH_TODOS_QUERY, {
    variables: { userId },
  });

  if (data && prntTitle) {
    pageList = data.getPages.pages.filter(({ title }) =>
      title.includes(prntTitle)
    );
    console.log("page", pageList);
  }
  console.log("prnt", prntList);

  function addPrnt(checked, title, date, id) {
    if (checked) {
      setPrntList([...prntList, { title, date, id }]);
    } else {
      setPrntList(prntList.filter((prnt) => prnt.id !== id));
    }
  }

  return (
    <div className="bgModal">
      <form
        action=""
        method="post"
        className="pageDateModal"
        onSubmit={onSubmit}
      >
        <header>
          <span className="grippy"></span>
          <button
            className="close"
            onClick={() => setModalObj({ type: "" })}
          ></button>
        </header>
        <main>
          {values.pageType === "todo" && <input type="checkbox" />}
          <input
            type="text"
            name="title"
            value={values.title}
            onChange={onChange}
            placeholder="Add Page Title"
            className="titleInput"
            required
          />
          {prntList.map((page, i) => (
            <div key={i}>
              <p>{page.title}</p>
              <p>{page.date}</p>
              <input
                type="checkbox"
                checked={prntList.some(({ id }) => id === page.id)}
                name={page.id}
                onChange={(e) => {
                  addPrnt(e.target.checked, page.title, page.date, page.id);
                }}
              />
            </div>
          ))}
          {prntList.length === 0 && <p>Select Parent</p>}
          <input
            type="search"
            name=""
            value={prntTitle}
            onChange={(e) => setPrntTitle(e.target.value)}
            placeholder="Search Parent"
          />
          {pageList.map((page, i) => (
            <div key={i}>
              <p>{page.title}</p>
              <p>{page.date}</p>
              <input
                type="checkbox"
                checked={prntList.some(({ id }) => id === page.id)}
                name={page.id}
                onChange={(e) => {
                  addPrnt(e.target.checked, page.title, page.date, page.id);
                }}
              />
            </div>
          ))}
          <div className="pageContent">
            <h4>contents</h4>
            <input
              type="text"
              name="text"
              value={values.text}
              onChange={onChange}
              placeholder="Add Text"
              className="textInput"
            />
          </div>
          <label>
            <input
              type="radio"
              name="pageType"
              value="page"
              onChange={onChange}
            />
            page
          </label>
          <label>
            <input
              type="radio"
              name="pageType"
              value="todo"
              onChange={onChange}
            />
            todo
          </label>
        </main>
        <button type="submit">submit</button>
      </form>
    </div>
  );
}

const CREATE_PAGE = gql`
  mutation CreatePage(
    $date: String!
    $title: String!
    $userId: ID!
    $pageType: String!
  ) {
    createPage(
      pageInput: {
        date: $date
        title: $title
        userId: $userId
        pageType: $pageType
      }
    ) {
      id
      pages {
        id
        title
        date
        isDone
        createdAt
        parent {
          parentId
        }
        child {
          childId
        }
        text
        pageType
      }
      userId
      username
    }
  }
`;