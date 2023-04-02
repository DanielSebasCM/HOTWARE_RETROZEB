require("dotenv").config();
const paginationLimit = 50;
const Sprint = require("../models/sprint.model");
const {
  JIRA_USER_HOTWARE,
  JIRA_API_KEY_HOTWARE,
  JIRA_URL_HOTWARE,
  JIRA_USER_EXTERNAL,
  JIRA_API_KEY_EXTERNAL,
  JIRA_URL_EXTERNAL,
  ZECOMMERCE_PROJECT_ID,
} = process.env;

(async () => {
  const sprints = await fetchNewSprints();
  console.log(
    sprints.map((sprint) => ({
      id: sprint.id,
      name: sprint.name,
    }))
  );
})();

async function fetchNewSprints() {
  const boardsIds = [570];
  const sprintIds = new Set();
  const sprints = [];
  for (const boardId of boardsIds) {
    const boardSprints = await fetchboardSprints(boardId);

    boardSprints.forEach((sprint) => {
      if (!sprintIds.has(sprint.id)) {
        sprintIds.add(sprint.id);
        sprints.push(sprint);
      }
    });
  }

  sprints.sort((a, b) => {
    a = new Date(a.startDate);
    b = new Date(b.startDate);
    return a > b ? -1 : a < b ? 1 : 0;
  });

  return sprints;
}

async function fetchBoardsIds() {
  const url = `${JIRA_URL_EXTERNAL}/rest/agile/1.0/board?projectKeyOrId=${ZECOMMERCE_PROJECT_ID}&type=scrum&maxResults=${paginationLimit}`;

  const boards = await getAll(url, JIRA_USER_EXTERNAL, JIRA_API_KEY_EXTERNAL);
  const boardsIds = boards.map((board) => board.id);

  return boardsIds;
}

async function fetchboardSprints(boardId) {
  const url = `${JIRA_URL_EXTERNAL}/rest/agile/1.0/board/${boardId}/sprint?state=active,closed&maxResults=${paginationLimit}`;
  const sprints = await getAll(url, JIRA_USER_EXTERNAL, JIRA_API_KEY_EXTERNAL);
  return sprints;
}

async function getAll(url, user, api_key, key = "values") {
  const Authorization = `Basic ${Buffer.from(`${user}:${api_key}`).toString(
    "base64"
  )}`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization,
    },
  }).then((res) => res.json());

  const data = res[key];
  let page = 1;
  let done = res.isLast;
  while (!done) {
    const nextUrl = `${url}&startAt=${page * paginationLimit}`;
    const res = await fetch(nextUrl, {
      method: "GET",
      headers: {
        Authorization,
      },
    }).then((res) => res.json());

    data.push(...res[key]);
    page++;
    done = res.isLast;
  }
  return data;
}
