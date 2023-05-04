-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 03-05-2023 a las 19:34:17
-- Versión del servidor: 10.4.24-MariaDB
-- Versión de PHP: 8.1.6
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */
;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */
;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */
;
/*!40101 SET NAMES utf8mb4 */
;
--
-- Base de datos: `hotware`
--

-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `answer`
--

DROP database IF EXISTS hotware;
CREATE DATABASE IF NOT EXISTS hotware DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE hotware;
CREATE TABLE `answer` (
  `id` int(11) NOT NULL,
  `value` varchar(400) NOT NULL,
  `uid` int(11) DEFAULT NULL,
  `id_retrospective` int(11) NOT NULL,
  `id_question` int(11) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `issues`
--

CREATE TABLE `issues` (
  `id` int(11) NOT NULL,
  `id_jira` int(11) DEFAULT NULL,
  `epic_name` varchar(255) DEFAULT NULL,
  `story_points` int(11) DEFAULT NULL,
  `priority` enum('Lowest', 'Low', 'Medium', 'High', 'Highest') NOT NULL DEFAULT 'Medium',
  `state` enum(
    'To Do',
    'En curso',
    'Pull request',
    'QA',
    'Blocked',
    'Done'
  ) NOT NULL DEFAULT 'To Do',
  `type` enum('Task', 'Bug', 'Story', 'Sub-task') NOT NULL DEFAULT 'Task',
  `uid` int(11) DEFAULT NULL,
  `id_sprint` int(11) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `issues_labels`
--

CREATE TABLE `issues_labels` (
  `id_issue` int(11) NOT NULL,
  `label` varchar(40) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `option`
--

CREATE TABLE `option` (
  `id` int(11) NOT NULL,
  `description` varchar(25) NOT NULL,
  `id_question` int(11) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `privilege`
--

CREATE TABLE `privilege` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `tag` enum(
    'Equipos',
    'Retrospectivas',
    'Preguntas',
    'Roles',
    'Usuarios',
    'Accionables',
    'Sprints',
    ''
  ) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
--
-- Volcado de datos para la tabla `privilege`
--

INSERT INTO `privilege` (`id`, `name`, `description`, `tag`)
VALUES (
    1,
    'getActionables',
    'Ver Accionables',
    'Accionables'
  ),
  (
    2,
    'canAcceptActionables',
    'Aceptar Accionables',
    'Accionables'
  ),
  (3, 'canCreateRoles', 'Crear Roles', 'Roles'),
  (4, 'getTeams', 'Ver Equipos', 'Equipos'),
  (
    5,
    'getRetrospectives',
    'Ver Retrospectivas',
    'Retrospectivas'
  ),
  (6, 'canJoinTeams', 'Unirse a Equipos', 'Equipos'),
  (7, 'getQuestions', 'Ver Preguntas', 'Preguntas'),
  (
    8,
    'canPostQuestions',
    'Crear Preguntas',
    'Preguntas'
  ),
  (
    9,
    'canDeleteQuestions',
    'Eiminar Preguntas',
    'Preguntas'
  ),
  (10, 'getRoles', 'Ver Roles', 'Roles'),
  (
    11,
    'canCreateRetrospectives',
    'Crear Retrospectiva',
    'Retrospectivas'
  ),
  (
    12,
    'canAnswerRetrospectives',
    'Contestar Retrospectiva',
    'Retrospectivas'
  ),
  (
    13,
    'getMetrics',
    'Ver Métricas de Sprint',
    'Sprints'
  ),
  (
    14,
    'deleteUsers',
    'Eliminar Usuarios',
    'Usuarios'
  ),
  (
    15,
    'canModifyUsers',
    'Modificar Usuarios',
    'Usuarios'
  ),
  (
    16,
    'canRejectActionables',
    'Rechazar Accionables',
    'Accionables'
  ),
  (17, 'canCreateTeams', 'Crear Equipos', 'Equipos'),
  (18, 'getUsers', 'Ver Usuarios', 'Usuarios'),
  (19, 'canDeleteRoles', 'Eliminar Roles', 'Roles'),
  (
    20,
    'canCompareRetrospectives',
    'Comparar Retrospectivas',
    'Retrospectivas'
  ),
  (
    21,
    'canModifyTeams',
    'Modificar Equipos',
    'Equipos'
  ),
  (
    22,
    'canDeleteTeams',
    'Eliminar Equipos',
    'Equipos'
  ),
  (23, 'canModifyRoles', 'Modificar Roles', 'Roles'),
  (
    24,
    'canCloseRetrospectives',
    'Cerrar Retrospectivas',
    'Retrospectivas'
  ),
  (
    25,
    'canCreateActionables',
    'Crear Accionables',
    'Accionables'
  );
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `project`
--

CREATE TABLE `project` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `id_jira` int(11) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
--
-- Volcado de datos para la tabla `project`
--

INSERT INTO `project` (`id`, `name`, `id_jira`, `active`)
VALUES (
    1,
    '[Tribe Project] ZeCommerce Global Tribe',
    10381,
    1
  );
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `question`
--

CREATE TABLE `question` (
  `id` int(11) NOT NULL,
  `description` varchar(255) NOT NULL,
  `type` enum('OPEN', 'BOOLEAN', 'SCALE', 'SELECTION') NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `retrospective`
--

CREATE TABLE `retrospective` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `start_date` datetime NOT NULL DEFAULT current_timestamp(),
  `end_date` datetime DEFAULT NULL,
  `state` enum('PENDING', 'IN_PROGRESS', 'CLOSED') NOT NULL DEFAULT 'IN_PROGRESS',
  `id_team` int(11) NOT NULL,
  `id_sprint` int(11) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `retrospective_question`
--

CREATE TABLE `retrospective_question` (
  `id_retrospective` int(11) NOT NULL,
  `id_question` int(11) NOT NULL,
  `required` tinyint(1) NOT NULL DEFAULT 1,
  `annonimous` tinyint(1) NOT NULL DEFAULT 0
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(40) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
--
-- Volcado de datos para la tabla `role`
--

INSERT INTO `role` (`id`, `name`, `active`)
VALUES (1, 'Admin', 1),
  (2, 'Team Member', 1);
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `role_privilege`
--

CREATE TABLE `role_privilege` (
  `id_role` int(11) NOT NULL,
  `id_privilege` int(11) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
--
-- Volcado de datos para la tabla `role_privilege`
--

INSERT INTO `role_privilege` (`id_role`, `id_privilege`)
VALUES (1, 1),
  (1, 2),
  (1, 3),
  (1, 4),
  (1, 5),
  (1, 6),
  (1, 7),
  (1, 8),
  (1, 9),
  (1, 10),
  (1, 11),
  (1, 12),
  (1, 13),
  (1, 14),
  (1, 15),
  (1, 16),
  (1, 17),
  (1, 18),
  (1, 19),
  (1, 20),
  (1, 21),
  (1, 22),
  (1, 23),
  (1, 24),
  (1, 25),
  (2, 4),
  (2, 5);
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `sprint`
--

CREATE TABLE `sprint` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `id_jira` int(11) DEFAULT NULL,
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `id_project` int(11) DEFAULT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `suggested_todo`
--

CREATE TABLE `suggested_todo` (
  `id` int(11) NOT NULL,
  `title` varchar(40) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `state` enum('PENDING', 'ACCEPTED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  `id_user_author` int(11) DEFAULT NULL,
  `priority` enum('Highest', 'High', 'Medium', 'Low', 'Lowest') NOT NULL DEFAULT 'Medium'
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `team`
--

CREATE TABLE `team` (
  `id` int(11) NOT NULL,
  `name` varchar(40) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 1
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
--
-- Volcado de datos para la tabla `team`
--

INSERT INTO `team` (`id`, `name`, `active`)
VALUES (1, 'General', 1);
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `team_users`
--

CREATE TABLE `team_users` (
  `id_team` int(11) NOT NULL,
  `uid` int(11) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `team_users_retrospectives`
--

CREATE TABLE `team_users_retrospectives` (
  `id_team` int(11) NOT NULL,
  `uid` int(11) NOT NULL,
  `id_retrospective` int(11) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `token`
--

CREATE TABLE `token` (`id` text NOT NULL) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `user`
--

CREATE TABLE `user` (
  `uid` int(11) NOT NULL,
  `id_jira` varchar(40) DEFAULT NULL,
  `id_google_auth` varchar(255) NOT NULL,
  `first_name` varchar(25) NOT NULL,
  `last_name` varchar(25) NOT NULL,
  `email` varchar(40) NOT NULL,
  `picture` varchar(400) DEFAULT NULL,
  `active` tinyint(1) NOT NULL DEFAULT 0
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- --------------------------------------------------------
--
-- Estructura de tabla para la tabla `users_roles`
--

CREATE TABLE `users_roles` (
  `uid` int(11) NOT NULL,
  `id_role` int(11) NOT NULL
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `answer`
--
ALTER TABLE `answer`
ADD PRIMARY KEY (`id`),
  ADD KEY `uid` (`uid`),
  ADD KEY `id_retrospective` (`id_retrospective`),
  ADD KEY `id_question` (`id_question`),
  ADD KEY `answer_ibfk_2` (`id_retrospective`, `id_question`);
--
-- Indices de la tabla `issues`
--
ALTER TABLE `issues`
ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id_jira`, `id_sprint`) USING BTREE,
  ADD KEY `id_sprint` (`id_sprint`),
  ADD KEY `uid` (`uid`);
--
-- Indices de la tabla `issues_labels`
--
ALTER TABLE `issues_labels`
ADD PRIMARY KEY (`id_issue`, `label`),
  ADD KEY `id_issue` (`id_issue`);
--
-- Indices de la tabla `option`
--
ALTER TABLE `option`
ADD PRIMARY KEY (`id`),
  ADD KEY `FK_Option_question` (`id_question`);
--
-- Indices de la tabla `privilege`
--
ALTER TABLE `privilege`
ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);
--
-- Indices de la tabla `project`
--
ALTER TABLE `project`
ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_jira` (`id_jira`);
--
-- Indices de la tabla `question`
--
ALTER TABLE `question`
ADD PRIMARY KEY (`id`);
--
-- Indices de la tabla `retrospective`
--
ALTER TABLE `retrospective`
ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_team_2` (`id_team`, `id_sprint`),
  ADD KEY `id_team` (`id_team`),
  ADD KEY `id_sprint` (`id_sprint`);
--
-- Indices de la tabla `retrospective_question`
--
ALTER TABLE `retrospective_question`
ADD PRIMARY KEY (`id_retrospective`, `id_question`),
  ADD KEY `id_retrospective_question` (`id_retrospective`, `id_question`),
  ADD KEY `retrospective_question_ibfk_2` (`id_question`);
--
-- Indices de la tabla `role`
--
ALTER TABLE `role`
ADD PRIMARY KEY (`id`);
--
-- Indices de la tabla `role_privilege`
--
ALTER TABLE `role_privilege`
ADD PRIMARY KEY (`id_role`, `id_privilege`),
  ADD UNIQUE KEY `id_role_2` (`id_role`, `id_privilege`),
  ADD UNIQUE KEY `id_role_3` (`id_role`, `id_privilege`),
  ADD KEY `id_privilege` (`id_privilege`),
  ADD KEY `id_role` (`id_role`);
--
-- Indices de la tabla `sprint`
--
ALTER TABLE `sprint`
ADD PRIMARY KEY (`id`),
  ADD KEY `id_project` (`id_project`);
--
-- Indices de la tabla `suggested_todo`
--
ALTER TABLE `suggested_todo`
ADD PRIMARY KEY (`id`),
  ADD KEY `id_user_author` (`id_user_author`);
--
-- Indices de la tabla `team`
--
ALTER TABLE `team`
ADD PRIMARY KEY (`id`);
--
-- Indices de la tabla `team_users`
--
ALTER TABLE `team_users`
ADD PRIMARY KEY (`id_team`, `uid`),
  ADD KEY `id_team` (`id_team`),
  ADD KEY `uid` (`uid`);
--
-- Indices de la tabla `team_users_retrospectives`
--
ALTER TABLE `team_users_retrospectives`
ADD PRIMARY KEY (`id_team`, `uid`, `id_retrospective`),
  ADD KEY `uid` (`uid`),
  ADD KEY `id_retrospective` (`id_retrospective`),
  ADD KEY `id_team` (`id_team`) USING BTREE;
--
-- Indices de la tabla `user`
--
ALTER TABLE `user`
ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `id_jira` (`id_jira`);
--
-- Indices de la tabla `users_roles`
--
ALTER TABLE `users_roles`
ADD PRIMARY KEY (`uid`, `id_role`),
  ADD KEY `id_role` (`id_role`),
  ADD KEY `uid` (`uid`);
--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `answer`
--
ALTER TABLE `answer`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `issues`
--
ALTER TABLE `issues`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 306;
--
-- AUTO_INCREMENT de la tabla `option`
--
ALTER TABLE `option`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `privilege`
--
ALTER TABLE `privilege`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 26;
--
-- AUTO_INCREMENT de la tabla `project`
--
ALTER TABLE `project`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 2;
--
-- AUTO_INCREMENT de la tabla `question`
--
ALTER TABLE `question`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 10;
--
-- AUTO_INCREMENT de la tabla `retrospective`
--
ALTER TABLE `retrospective`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 14;
--
-- AUTO_INCREMENT de la tabla `role`
--
ALTER TABLE `role`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 4;
--
-- AUTO_INCREMENT de la tabla `sprint`
--
ALTER TABLE `sprint`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 6;
--
-- AUTO_INCREMENT de la tabla `suggested_todo`
--
ALTER TABLE `suggested_todo`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT de la tabla `team`
--
ALTER TABLE `team`
MODIFY `id` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 4;
--
-- AUTO_INCREMENT de la tabla `user`
--
ALTER TABLE `user`
MODIFY `uid` int(11) NOT NULL AUTO_INCREMENT,
  AUTO_INCREMENT = 28;
--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `answer`
--
ALTER TABLE `answer`
ADD CONSTRAINT `answer_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE
SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `answer_ibfk_2` FOREIGN KEY (`id_retrospective`, `id_question`) REFERENCES `retrospective_question` (`id_retrospective`, `id_question`) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- Filtros para la tabla `issues`
--
ALTER TABLE `issues`
ADD CONSTRAINT `issues_ibfk_1` FOREIGN KEY (`id_sprint`) REFERENCES `sprint` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `issues_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE
SET NULL ON UPDATE CASCADE;
--
-- Filtros para la tabla `issues_labels`
--
ALTER TABLE `issues_labels`
ADD CONSTRAINT `issues_labels_ibfk_1` FOREIGN KEY (`id_issue`) REFERENCES `issues` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- Filtros para la tabla `option`
--
ALTER TABLE `option`
ADD CONSTRAINT `FK_Option_question` FOREIGN KEY (`id_question`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- Filtros para la tabla `retrospective`
--
ALTER TABLE `retrospective`
ADD CONSTRAINT `retrospective_ibfk_1` FOREIGN KEY (`id_team`) REFERENCES `team` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `retrospective_ibfk_2` FOREIGN KEY (`id_sprint`) REFERENCES `sprint` (`id`) ON UPDATE CASCADE;
--
-- Filtros para la tabla `retrospective_question`
--
ALTER TABLE `retrospective_question`
ADD CONSTRAINT `retrospective_question_ibfk_1` FOREIGN KEY (`id_retrospective`) REFERENCES `retrospective` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `retrospective_question_ibfk_2` FOREIGN KEY (`id_question`) REFERENCES `question` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- Filtros para la tabla `role_privilege`
--
ALTER TABLE `role_privilege`
ADD CONSTRAINT `FK_role_privilege_privilege` FOREIGN KEY (`id_privilege`) REFERENCES `privilege` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_role_privilege_role` FOREIGN KEY (`id_role`) REFERENCES `role` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- Filtros para la tabla `sprint`
--
ALTER TABLE `sprint`
ADD CONSTRAINT `sprint_ibfk_1` FOREIGN KEY (`id_project`) REFERENCES `project` (`id`) ON DELETE
SET NULL ON UPDATE CASCADE;
--
-- Filtros para la tabla `suggested_todo`
--
ALTER TABLE `suggested_todo`
ADD CONSTRAINT `suggested_todo_ibfk_1` FOREIGN KEY (`id_user_author`) REFERENCES `user` (`uid`) ON UPDATE CASCADE;
--
-- Filtros para la tabla `team_users_retrospectives`
--
ALTER TABLE `team_users_retrospectives`
ADD CONSTRAINT `team_users_retrospectives_ibfk_1` FOREIGN KEY (`id_team`) REFERENCES `team` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `team_users_retrospectives_ibfk_2` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON UPDATE CASCADE,
  ADD CONSTRAINT `team_users_retrospectives_ibfk_3` FOREIGN KEY (`id_retrospective`) REFERENCES `retrospective` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
--
-- Filtros para la tabla `users_roles`
--
ALTER TABLE `users_roles`
ADD CONSTRAINT `users_roles_ibfk_1` FOREIGN KEY (`uid`) REFERENCES `user` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_roles_ibfk_2` FOREIGN KEY (`id_role`) REFERENCES `role` (`id`) ON UPDATE CASCADE;
COMMIT;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */
;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */
;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */
;