require("dotenv").config();
const Project = require("../models/project.model");
const Sprint = require("../models/sprint.model");
const Issue = require("../models/issue.model");
const User = require("../models/user.model");

// No cambiar amenos que
const {
  JIRA_USER_HOTWARE,
  JIRA_API_KEY_HOTWARE,
  JIRA_URL_HOTWARE,
  JIRA_USER_EXTERNAL,
  JIRA_API_KEY_EXTERNAL,
  JIRA_URL_EXTERNAL,
} = process.env;

// Ejemplo de uso
// (async () => {
//   const sprint = await fetchProjectJiraLatestSprint(
//     jira_project_id,
//     "active"
//   );
//   const issues = await fetchSprintIssues(sprint.id_jira);
//   console.log(issues);
// })();

/**
 * @brief Fetches all the issues of a sprint
 * @param {int} jiraIdSprint JIRA sprint id
 * @returns Issues of the sprint on their actual state
 */
async function fetchSprintIssues(jiraIdSprint) {
  const url = `${JIRA_URL_EXTERNAL}/rest/agile/1.0/sprint/${jiraIdSprint}/issue`;

  const issues = await getAll(
    url,
    JIRA_USER_EXTERNAL,
    JIRA_API_KEY_EXTERNAL,
    {
      fields: [
        "parent",
        "customfield_10042",
        "priority",
        "status",
        "issuetype",
        "assignee",
        "labels",
      ],
    },
    "issues"
  );

  const sprint = await Sprint.getByJiraId(jiraIdSprint);
  const id_sprint = sprint?.id;

  const builtIssues = issues.map(async (issue) => {
    const user = issue.fields.assignee
      ? await User.getByJiraId(issue.fields.assignee.accountId)
      : null;

    return new Issue({
      id_jira: issue.id,
      epic_name: issue.fields.parent?.fields.summary,
      story_points: issue.fields.customfield_10042,
      priority: issue.fields.priority.name,
      state: issue.fields.status.name,
      type: issue.fields.issuetype.name,
      uid: user?.uid,
      id_sprint,
      labels: issue.fields.labels,
    });
  });

  return Promise.all(builtIssues);
}

/**
 * @brief Fetches all the sprints of a project
 * @param {int} jiraIdProject
 * @param {string[]} states States of the sprints to fetch (closed, active, future)
 * @returns {Promise<Sprint[]>} Sprints of the project
 *
 *   If the sprint is already in the database, it will return the database sprint
 *   Else, it will create a new sprint with id = null and return it without saving it to the database
 */
async function fetchProjectJiraSprints(jiraIdProject, states) {
  const boards = await fetchProjectBoards(jiraIdProject);

  const project = await Project.getByJiraId(jiraIdProject);

  const sprintIds = new Set();
  const sprints = [];

  for (const board of boards) {
    const boardSprints = await fetchBoardSprints(board.id, project.id, states);
    boardSprints.forEach((sprint) => {
      if (!sprintIds.has(sprint.id_jira)) {
        sprintIds.add(sprint.id_jira);
        sprints.push(sprint);
      }
    });
  }

  sprints.sort((a, b) => {
    a = new Date(a.start_date);
    b = new Date(b.start_date);
    return a > b ? -1 : a < b ? 1 : 0;
  });
  return sprints;
}

/**
 * @brief Fetches the latest sprint of a project
 * @param {int} jiraIdProject
 * @param {string} state State of the sprint to fetch (closed, active, future)
 * @returns {Promise<Sprint|null>} Latest sprint of the project
 *  If the sprint is already in the database, it will return the database sprint
 * Else, it will create a new sprint with id = null and return it without saving it to the database
 * If there is no sprint, it will return null
 */
async function fetchProjectJiraLatestSprint(jiraIdProject, state) {
  const sprints = await fetchProjectJiraSprints(jiraIdProject, [state]);
  return sprints[0] || null;
}

/**
 * @brief Fetches all the sprints of a board
 * @param {int} jiraIdBoard Board jira id
 * @param {int} idProject Project local id (default: null)
 * @param {string[]} states States of the sprints to fetch (example: ["closed", "active"])
 * @returns Sprints of the board
 *
 *   If the sprint is already in the database, it will return the database sprint
 *   Else, it will create a new sprint with id = null and return it without saving it to the database
 */
async function fetchBoardSprints(jiraIdBoard, idProject, states) {
  const url = `${JIRA_URL_EXTERNAL}/rest/agile/1.0/board/${jiraIdBoard}/sprint`;
  const jiraSprints = await getAll(
    url,
    JIRA_USER_EXTERNAL,
    JIRA_API_KEY_EXTERNAL,
    { state: states }
  );

  const localSprints = jiraSprints.map(async (sprint) => {
    const dbSprint = await Sprint.getByJiraId(sprint.id);
    if (dbSprint) {
      return dbSprint;
    } else {
      return new Sprint({
        id_jira: sprint.id,
        name: sprint.name,
        start_date: new Date(sprint.startDate),
        end_date: new Date(sprint.endDate),
        state: sprint.state,
        id_project: idProject,
      });
    }
  });
  return Promise.all(localSprints);
}

/**
 * @brief Fetches all the boards of a project
 * CURRENTLY RETURNS A STATIC VALUE!!
 * @param {id} jiraIdProject Project jira id
 * @returns
 */
async function fetchProjectBoards(jiraIdProject) {
  // Temporary while we figure out wich boards they want
  return [{ id: 570 }];

  const url = `${JIRA_URL_EXTERNAL}/rest/agile/1.0/board`;
  const boards = await getAll(url, JIRA_USER_EXTERNAL, JIRA_API_KEY_EXTERNAL, {
    projectKeyOrId: jiraIdProject,
    type: "scrum",
  });
  return boards;
}

/**
 * @brief fetches all the data from a paginated endpoint
 * @param {string} url url to fetch from, it must have at least one query parameter
 * @param {string} user user email
 * @param {string} api_key users api key
 * @param {string} key attribute where the return value array is located
 * @returns {Promise<any[]>}  array of all values
 */
async function getAll(url, user, api_key, params, key = "values") {
  const Authorization = `Basic ${Buffer.from(`${user}:${api_key}`).toString(
    "base64"
  )}`;
  const urlWithParams = new URL(url);
  for (const key in params) {
    urlWithParams.searchParams.append(key, params[key]);
  }
  let res = await fetch(urlWithParams, {
    method: "GET",
    headers: {
      Authorization,
    },
  }).then((res) => res.json());

  const data = res[key];

  while (true) {
    if (isDone(res)) break;

    const prevStartAt = res.startAt;
    const prevMaxResults = res.maxResults;
    const nextUrl = new URL(urlWithParams);
    nextUrl.searchParams.set("startAt", prevStartAt + prevMaxResults);

    res = await fetch(nextUrl, {
      method: "GET",
      headers: {
        Authorization,
      },
    }).then((res) => res.json());

    data.push(...res[key]);
  }
  return data;
}

function isDone(res) {
  if (res.isLast !== undefined) return res.isLast ? true : false;
  if (res.total !== undefined) return res.startAt + res.maxResults >= res.total;
  return true;
}
