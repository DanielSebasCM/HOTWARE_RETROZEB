INSERT INTO user (
        id_jira,
        id_google_auth,
        first_name,
        last_name,
        email,
        active
    )
VALUES (
        "YOUR_JIRA_ID",
        "None",
        "YOUR_FIRST_NAME",
        "YOUR_LAST_NAME",
        "YOUR_EMAIL",
        1
    );
INSERT INTO users_roles (uid, id_role)
VALUES (LAST_INSERT_ID(), 1);