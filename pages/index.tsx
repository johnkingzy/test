import { ChangeEvent, useReducer } from "react";

interface User {
  id: number;
  name: string;
  dateOfBirth: string;
  email: string;
}

type FilterByType = keyof User;

const usersData: User[] = [
  {
    id: 1,
    name: "John Doe",
    dateOfBirth: "01/01/1990",
    email: "johndoe@example.com",
  },
  {
    id: 2,
    name: "Jane Doe",
    dateOfBirth: "02/01/1991",
    email: "janedoe@example.com",
  },
  {
    id: 3,
    name: "Bob Smith",
    dateOfBirth: "03/01/1992",
    email: "bobsmith@example.com",
  },
];

enum ActionType {
  UPDATE_KEYWORD = "UPDATE_KEYWORD",
  UPDATE_FILTER = "UPDATE_FILTER",
}

type InitialState = {
  filterBy: FilterByType;
  keyword: string;
  users: User[];
};
const initialState: InitialState = {
  filterBy: "name",
  keyword: "",
  users: usersData,
};

function reducer(state: InitialState, action: any) {
  switch (action.type) {
    case ActionType.UPDATE_FILTER:
      if (state.keyword.length && action.payload.length) {
        return {
          ...state,
          filterBy: action.payload,
          users: usersData.filter((user) =>
            `${user[action.payload as FilterByType]}`
              .toLowerCase()
              .includes(state.keyword.toLowerCase())
          ),
        };
      }
      return {
        ...state,
        users: usersData,
      };
    case ActionType.UPDATE_KEYWORD:
      if (action.payload.length && state.filterBy.length) {
        return {
          ...state,
          keyword: action.payload,
          users: usersData.filter((user) =>
            `${user[state.filterBy as FilterByType]}`
              .toLowerCase()
              .includes(action.payload.toLowerCase())
          ),
        };
      }
      return {
        ...state,
        users: usersData,
      };
    default:
      return state;
  }
}

function UserList() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleChange = (evt: ChangeEvent<HTMLInputElement>) => {
    const { value } = evt.target;
    dispatch({
      type: ActionType.UPDATE_KEYWORD,
      payload: value,
    });
  };
  const handleFilterChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const { value } = evt.target;
    dispatch({
      type: ActionType.UPDATE_FILTER,
      payload: value,
    });
  };

  return (
    <div>
      <form>
        <select name="filter-by" id="filter-by" onChange={handleFilterChange}>
          <option value="name">Name</option>
          <option value="dateOfBirth">Date of Birth</option>
          <option value="email">Email</option>
        </select>
        <input
          placeholder="search here..."
          type="text"
          onChange={handleChange}
        />
      </form>
      {state.users.map((user) => (
        <div key={user.id} className="user-card">
          <p>{user.id}</p>
          <p>{user.name}</p>
          <p>{user.dateOfBirth}</p>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
}

export default UserList;
